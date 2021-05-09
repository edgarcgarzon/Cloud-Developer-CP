import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "@libs/logger"


export class SESAdapter {


    constructor(
        private readonly logger = createLogger('SESAdapter'),
        private readonly ses = CreateSESClient(),
        private readonly appEmail = process.env.APP_EMAIL){
    }

    /**
     * 
     * @param TO 
     * @param CC 
     * @param subject 
     * @param body 
     */
    sendMessage(TO: string[], CC: string[], subject: string, body: string) {

        // Create sendEmail params 
        var params = {
            Destination: {
                CcAddresses: [...CC, this.appEmail],
                ToAddresses: TO
            },
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: body
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: this.appEmail,
            ReplyToAddresses: [
                this.appEmail
                /* more items */
            ],
        };

        console.log(JSON.stringify(params));

        const logger = this.logger;
        this.ses.sendEmail(params).promise().then(function (data) {
            logger.info(`email sent: ${data.MessageId}`);
        }).catch(
            function (err) {
                logger.error(`email error: ${err}`);
            })
    }

}


/**
 * Create a SES client
 * @returns 
 */
 function CreateSESClient():AWS.SES {

    if (process.env.IS_OFFLINE) {
      return new AWS.SES();
    }

    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.SES()
}