import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "@libs/logger"


export class SQSAdapter {


    constructor(
        private readonly logger = createLogger('SQSAdapter'),
        private readonly sqsName = process.env.SQS_NOTIFICATION,
        private readonly sqs = CreateSQSClient()){
    }

    private async getQueueUrl() {
        try {

            const res = await this.sqs.getQueueUrl({
                QueueName: this.sqsName, /* required */
            }).promise();
            return res.QueueUrl;

        } catch (err) {
            this.logger.error(`Error getting the queue ${this.sqsName} url: ${err}`)
            throw new Error(`Error getting the queue ${this.sqsName} url`);
        }
    }

    /**
     * 
     * @param attributes 
     * @param messageBody 
     */
    async sendMessage( messageBody:string, messageAttributes:any) {

        const queueURL = await this.getQueueUrl();
        this.logger.info(`queueURL: ${queueURL}`)
        
        //Convert the message atribute into a messae format
        //all attributes will be try to convert to string.
        //not nested objects are allowed
        var MessageAttributes = {};
        MessageAttributes["CustomAttr"] = {
            DataType: "String",
            StringValue: JSON.stringify(messageAttributes)
        }

        //Set parameters
        var params = {
           DelaySeconds: 5,
           MessageAttributes: MessageAttributes,
           MessageBody: messageBody,
           QueueUrl: queueURL
         };
        
        const logger = this.logger;
         
        this.sqs.sendMessage(params,
            function (err, data) {
                if (err) {
                    logger.error(`Error sending message in queue ${this.queueName}: ${err}`);
                } else {
                    logger.info(`Message sent in queue ${this.queueName}: message id: ${data.MessageId}`);
                }
            }
        )
    }
}


/**
 * Create a S3 client
 * @returns 
 */
 function CreateSQSClient():AWS.SQS {

    if (process.env.IS_OFFLINE) {
      return new AWS.SQS({
          endpoint:'http://localhost:9324'
      });
    }

    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.SQS()
}