import { iNote, noteInit } from "@models/note";
import {createLogger} from "@libs/logger"
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { convDBItemTonote, convNotetoDBItem, DbItem } from "./keepLiteTableSch";
import { iUser } from "@models/user";



export class noteAdapter{
 
  constructor(
      private readonly logger = createLogger('noteAdapter'),
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly NoteLiteTable:string = process.env.NOTE_LITE_TABLE,
      private readonly NoteLiteGSI1:string = process.env.NOTE_LITE_SGI1){

  }

  /**
   * 
   * @param userId 
   * @returns 
   */
  async getNote(userId:string, shared:boolean = false):Promise<iNote[]>{

    this.logger.info("Get items from DB for userId " + userId);

    try {
      //Read notes from DB
      const notes = await this.docClient.query({
        TableName: this.NoteLiteTable,
        IndexName: this.NoteLiteGSI1,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise();

      var res: Array<any> = notes.Items;

      //If not the note requested were no the ones shared
      if (!shared) {
        //Filter
        res = res.filter(x => x.SK == "BODY")
      }
      else{

        //Get the share items, build the array for query
        res = res.filter(x => x.SK.includes("SHARE#"));
        if(!res.length){return res;}
        res.forEach((x,i) => {res[i] = {PK: x["PK"], SK: "BODY"}});

        var RequestItems = {}; 
        RequestItems[`${this.NoteLiteTable}`] = {Keys: res};

        this.logger.info(`Shared items to search: ${JSON.stringify(RequestItems)}`);

        //Query the main table
        const sharedNotes = await this.docClient.batchGet({
          RequestItems: RequestItems
        }).promise();

        res = sharedNotes.Responses[`${this.NoteLiteTable}`];

      }

      //convert to Note
      res.forEach((x, i) => {
        res[i] = convDBItemTonote(x as DbItem)
      })
      return res as iNote[];
    }
    catch (error) {
      this.logger.error("Dynamodb Error: " + error )
      throw new Error("Internal error")
    }
  }

  /**
   * 
   * @param noteId 
   */
  async getUsers(noteId: any):Promise<iUser[]> {
    try {
        //Read notes from DB
        const notes = await this.docClient.query({
          TableName: this.NoteLiteTable,
          KeyConditionExpression: 'PK = :noteId',
          ExpressionAttributeValues: {
            ':noteId': noteId
          }
        }).promise();

        var users = [];
        notes.Items.forEach( x => {
          var item = x as DbItem;

          if(item.SK == "BODY"){
            users.push({Id: item.PK, email:item.payload.owner})
          }
          if(item.SK.includes("SHARE#")){
            users.push({Id: item.PK, email:item.email})
          }
        });

        return users;
    }
    catch(error){
      this.logger.error("Dynamodb Error: " + error )
      throw new Error("Internal error")
    }
  }

  /**
   * 
   * @param note 
   * @returns 
   */
  async putPost(note: iNote): Promise<iNote> {
      
    this.logger.info("Item to add to the DB: " + JSON.stringify(note)); 

    try{
      const item = convNotetoDBItem(note); 

      await this.docClient.put({
        TableName: this.NoteLiteTable,
        Item: item
      }).promise();
    }
    catch(error){
      this.logger.error("Dynamodb Error: " + error )
      return undefined;
    }

    return note;
  }

  /**
   * 
   * @param userId 
   * @param noteId 
   * @returns 
   */
  async getPerms(userId: string, noteId:string):Promise<string>
  {

    this.logger.info("Get permissions for userId: " + userId + " noteId: " + noteId);

    try{
      
      //Read the permissions for the note
      const params = {
        TableName: this.NoteLiteTable,
        IndexName: this.NoteLiteGSI1,
        KeyConditionExpression: 'userId = :userId and PK = :noteId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':noteId': noteId,
        }
      };

      const notes = await this.docClient.query(params).promise();

      //If the post is not listed, user does not have access
      if(!notes.Items[0]){return "";}

      //If the post is listed, user have access.
      const {permissions} = notes.Items[0];
      return permissions;
      

    }
    catch(error)
    {
      this.logger.error("Error getting permissions: " + error);
      return undefined;
    }
  }

  /**
   * 
   * @param noteId 
   * @param body 
   * @returns 
   */
  async Update(noteId: string, body: any): Promise<any> {

    //Create the expression dynamically
    var UpdateExpression = "set ";
    var ExpressionAttributeValues = {}
    for (const prop in body) {
      if (body.hasOwnProperty(prop)) {
        ExpressionAttributeValues[`:${prop}`] = body[prop];
        UpdateExpression += `payload.${prop} = :${prop}, `
      }
    }
    UpdateExpression = UpdateExpression.slice(0, -2);
    this.logger.info(`UpdateExpression: ${UpdateExpression}`);
    this.logger.info(`ExpressionAttributeValues: ${JSON.stringify(ExpressionAttributeValues)}`)

    try {
      //Read the permissions for the note
      const params = {
        TableName: this.NoteLiteTable,
        Key: {
          PK: noteId,
          SK: "BODY"
        },
        ExpressionAttributeValues: ExpressionAttributeValues,
        UpdateExpression: UpdateExpression,
        ReturnValues: 'ALL_NEW',
      };
      return await this.docClient.update(params).promise();
    }
    catch (error) {
      this.logger.error(`Error updating noteId: ${noteId}: ${error} `);
      throw new Error("Internal problem")
    }
  }

  /**
   * 
   * @param noteId 
   * @param targetUserId 
   */
  async shareNote(noteId: string, targetUser: iUser, permissions:string):Promise<any> {

    this.logger.info(`Add/delete share item noteId "${noteId}" with user "${targetUser.Id}" and permissions "${permissions}"`); 

    const item = {
      PK:noteId,
      SK: `SHARE#${targetUser.Id}`,
      userId: targetUser.Id,
      permissions: permissions,
      email: targetUser.email
    }

    try {
      if (permissions !== "") {
        await this.docClient.put({
          TableName: this.NoteLiteTable,
          Item: item
        }).promise();
      }
      else {
        await this.docClient.delete({
          TableName: this.NoteLiteTable,
          Key:{
            PK: item.PK,
            SK: item.SK
          }
        }).promise();
      }
    }
    catch (error) {
      this.logger.error("Dynamodb Error: " + error)
      throw new Error(`Error adding a share item `);
    }

    return item;
  }

  /**
   * 
   * @param noteId 
   * @param fileId 
   */
  async AddAttachment(noteId: string, fileId: string, LastUpdateBy: string = "unknown", LastUpdateOn:string = "unknown"): Promise<any> {
    try {
      //Read the permissions for the note
      const params = {
        TableName: this.NoteLiteTable,
        Key: {
          PK: noteId,
          SK: "BODY"
        },
        ExpressionAttributeValues: {
          ':attachment': [fileId],
          ':attachmentStr': fileId,
          ':LastUpdateBy': LastUpdateBy,
          ':LastUpdateOn': LastUpdateOn
        },
        ConditionExpression: "not contains(payload.attachment, :attachmentStr)",
        UpdateExpression: "set payload.attachment = list_append(payload.attachment, :attachment), payload.LastUpdateBy = :LastUpdateBy, payload.LastUpdateOn = :LastUpdateOn",
        ReturnValues: 'ALL_NEW',
      };
      return await this.docClient.update(params).promise();
    }
    catch (error) {
      this.logger.error(`Error adding attachment to the item: ${noteId}: ${error} `);
      return undefined;
    }
  }

  /**
   * 
   * @param noteId 
   * @param userId 
   */
  async delete(noteId: string) {

    this.logger.info(`Delete notes`);
    try{
      //Read notes from DB
      const notes = await this.docClient.query({
        TableName: this.NoteLiteTable,
        KeyConditionExpression: 'PK = :PK',
        ExpressionAttributeValues: {
          ':PK': noteId
        },
        ProjectionExpression: "PK, SK"
      }).promise();

      if(!notes.Items.length){
        throw new Error("noteId not found")
      }

      //Build the delete request
      var res:Array<any> = notes.Items;
      this.logger.info(`items to delete: ${JSON.stringify(res)}`)
      res.forEach((x,i) => {
        res[i] = {
          DeleteRequest:{ Key:{ PK:x.PK, SK:x.SK }}
        }
      })

      //Build the requested items
      var RequestItems = {}; 
      RequestItems[`${this.NoteLiteTable}`] = res;
      this.logger.info(`items to delete: ${JSON.stringify(RequestItems)}`)

      //send the delete request
      await this.docClient.batchWrite({
        RequestItems: RequestItems
      }).promise();

    }catch(err){
      this.logger.error(`Error deleting: ${err}`);
      throw new Error("Internal error");
    }
  }

}

/**
 * 
 * @returns 
 */
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('<OFFLINE:> Creating a local DynamoDB instance')
      return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.DynamoDB.DocumentClient()
  }