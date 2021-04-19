import { note, noteInit } from "@models/note";
import {createLogger} from "@libs/logger"
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { convNotetoDBItem, DbItem } from "./keepLiteTableSch";

//const XAWS = AWSXRay.captureAWS(AWS)
const XAWS = AWS;
export class postAdapter{

  constructor(
      private readonly logger = createLogger('noteAdapter'),
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly NoteLiteTable = process.env.NOTE_LITE_TABLE,
      private readonly NoteLiteGSI1 = process.env.NOTE_LITE_SGI1){

  }

  /**
   * 
   * @param userId 
   * @returns 
   */
  async getNote(userId:string):Promise<note[]>{

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

      //Filter and send notes
      notes.Items.filter(x => x.SK == "BODY")
      return notes.Items as note[];
    }
    catch (error) {
      this.logger.error("Dynamodb Error: " + error )
      return undefined;
    }


  }

  /**
   * 
   * @param note 
   * @returns 
   */
  async putPost(note: note): Promise<note> {
      
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
  async Update(noteId: string, body: noteInit):Promise<any> {

    try {
      //Read the permissions for the note
      const params = {
        TableName: this.NoteLiteTable,
        Key: {
          PK: noteId,
          SK: "BODY"
        },
        ExpressionAttributeValues: {
          ':body': body.body,
          ':label': body.label,
          ':reminder': body.reminder,
        },
        UpdateExpression: 'set payload.label = :label, payload.body = :body, payload.reminder = :reminder',
        ReturnValues: 'ALL_NEW',
      };
      return await this.docClient.update(params).promise();
    }
    catch (error) {
      this.logger.error(`Error updating noteId: ${noteId}: ${error} `);
      return undefined;
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
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }