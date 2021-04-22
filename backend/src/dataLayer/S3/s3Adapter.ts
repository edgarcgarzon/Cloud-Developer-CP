import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "@libs/logger"


export class s3Adapter {

    constructor(
      private readonly logger = createLogger('noteAdapter'),
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
    getUploadUrl(postId:string, fileId: string, publisher: string):string {

        this.logger.info(`Get signed URL for key: ${postId}/${fileId}`)

        return this.s3.getSignedUrl('putObject', {
          Bucket: this.attchmentBucketName,
          Key: `${postId}/${fileId}`,
          Expires: Number(this.urlExpiration),
          Metadata: {
            publisher: `${publisher}`
          }
        })
    }

    async getMetadata(key:string):Promise<any>{
      const data = await this.s3.headObject({
        Bucket: this.attchmentBucketName,
        Key:key}).promise()
      
        return data['Metadata']
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
