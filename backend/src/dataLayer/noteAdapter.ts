import { note } from "@models/note";
import {createLogger} from "@libs/logger"
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { convDbItemToNote, convNotetoDBItem, DbItem } from "./keep-lite-sch";

const XAWS = AWSXRay.captureAWS(AWS)
export class postAdapter{

    constructor(
        private readonly logger = createLogger('itemAcess'),
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly NoteLiteTable = process.env.NOTE_LITE_TABLE){

    }

    async getPost(userId:string, label?: string):Promise<note[]>{
        throw("not implemented");
    }

    async putPost(note: note): Promise<any> {
        this.logger.info(JSON.stringify(note));

        const item = convNotetoDBItem(note);

        await this.docClient.put({
          TableName: this.NoteLiteTable,
          Item: item
        }).promise()

        return item;
    }
}

/**
 * 
 * @returns 
 */
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }