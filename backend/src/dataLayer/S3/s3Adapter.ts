import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "@libs/logger"
import { iUser } from '@models/user'
import { noteLogic } from '@businessLogic/NoteLogic'


export class s3Adapter {

    constructor(
      private readonly logger = createLogger('s3Adapter'),
      private readonly attchmentBucketName = process.env.S3_BUCKET_ATTACH,
      private readonly urlExpiration = process.env.S3_BUCKET_ATTACH_SIG_URL_EXPIRATION,
      private readonly s3 = CreateS3Client()) {
    }

    /**
     * Get signed URL for image download
     * @param postId 
     * @param fileId 
     * @returns 
     */
    getGetUrl(postId: string, fileId:string):string{

        this.logger.info(`Get signed URL for key: ${postId}/${fileId}`)

        return this.s3.getSignedUrl('getObject', {
            Bucket: this.attchmentBucketName,
            Key: `${postId}/${fileId}`,
            Expires: Number(this.urlExpiration)
          })
    }

    /**
     * Get signed URL for image upload
     * @param fileId 
     * @returns 
     */
    getUploadUrl(postId:string, fileId: string, user: iUser):string {

        this.logger.info(`Get signed URL for key: ${postId}/${fileId}`)

        return this.s3.getSignedUrl('putObject', {
          Bucket: this.attchmentBucketName,
          Key: `${postId}/${fileId}`,
          Expires: Number(this.urlExpiration),
          Metadata: {
            userid: `${user.Id}`,
            useremail : `${user.email}`,
          }
        })
    }

    /**
     * 
     * @param key 
     */
    async S3PutObjectEvent(key:string):Promise<any>{

      //get head objects
      const data = await this.s3.headObject({
        Bucket: this.attchmentBucketName,
        Key:key}).promise()
      
        const metadata = data['Metadata'];

        this.logger.info(`S3 Event for key ${JSON.stringify(key)} and Metadata ${JSON.stringify(metadata)}`);

        //Get noteId and fileId from key
        const parts = key.split("/");
        const noteId = decodeURIComponent(parts[0]);
        const fileId = decodeURIComponent(parts[1]);

        //Build the user from the metadata
        const user:iUser ={
            Id:metadata["userid"],
            email:metadata["useremail"]
        }

        new noteLogic().AddAttachment(noteId, fileId, user);
        
    }
}

/**
 * Create a S3 client
 * @returns 
 */
function CreateS3Client():AWS.S3 {

    if (process.env.IS_OFFLINE) {
      return new AWS.S3({
            accessKeyId: 'S3RVER', // This specific key is required when working offline
            secretAccessKey: 'S3RVER',
            endpoint: new AWS.Endpoint('http://localhost:8080'),
          });
    }

    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.S3()
}
