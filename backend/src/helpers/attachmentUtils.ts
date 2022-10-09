import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
    constructor(
        private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' })) {
    }

    async getUploadUrl(s3BucketName: string,todoId: string, signedurlExpiration: string): Promise<string> {
        return this.s3Client.getSignedUrl('putObject', {
          Bucket: s3BucketName,
          Key: todoId,
          Expires: Number(signedurlExpiration)
        })
      }

}