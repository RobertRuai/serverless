import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')



// TODO: Implement the dataLayer logic

//added all code

export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX) {
    }

    async getTodosForUser(userId: string){
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.createdAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info(`Todo Items for user:${userId} retrieved`, result)

        return result
    }

    async createToDo(todoItem: TodoItem){
        logger.info('creating todo  in todosAccess', todoItem)

        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()
    }

    async getSignedUrl(bucketKey: string): Promise<string> {
        return this.s3Client.getSignedUrl('putObject', {
          Bucket: this.bucketName,
          Key: bucketKey,
          Expires: this.urlExpiration
        })
    }

    async updateAttachmentUrl(userId: string, todoId: string): Promise<void> {
        await this.docClient.update({
          TableName: this.todoTable,
          Key: {
            "userId": userId,
            "todoId": todoId
          },
          UpdateExpression: "set attachmentUrl=:attachmentUrl",
          ExpressionAttributeValues:{
              ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
          }
        }).promise()
    }




    async updateToDo(userId: string, todoId: string, updatedTodoRequest: UpdateTodoRequest){
        logger.info('updating Todo ', updatedTodoRequest)

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: "set dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
              ":dueDate": updatedTodoRequest.dueDate,
              ":done": updatedTodoRequest.done
            }
        }).promise()

        logger.info('Todo  updated', updatedTodoRequest)

        return updatedTodoRequest
    }

    
    async deleteToDo(todoId: string, userId: string){
        logger.info('Deleting Todo  '+todoId)
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()
    }

    async deleteTodoItemAttachment(bucketKey: string): Promise<void> {
        await this.s3Client.deleteObject({
          Bucket: this.bucketName,
          Key: bucketKey
        }).promise()
    }
    
}