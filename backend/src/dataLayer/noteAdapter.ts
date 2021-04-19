import { note } from "@models/note";
import {createLogger} from "@libs/logger"
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { convNotetoDBItem } from "./keepLiteTableSch";

//const XAWS = AWSXRay.captureAWS(AWS)
const XAWS = AWS;
export class postAdapter{

    constructor(
        private readonly logger = createLogger('noteAdapter'),
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly NoteLiteTable = process.env.NOTE_LITE_TABLE,
        private readonly NoteLiteGSI1 = process.env.NOTE_LITE_SGI1){

    }

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