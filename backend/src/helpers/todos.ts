import { ToDoAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import {parseUserId} from "../auth/utils";  //added import
import {TodoUpdate} from "../models/TodoUpdate"; //added


// TODO: Implement businessLogic
 //all added code
const uuid4 = require(uuid);
const toDosAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDosAccess.getAllToDo(userId);
}

export async function generateUploadUrl(jwtToken: string, todoId: string): Promise<string> {
    const uploadUrl = await toDosAccess.getSignedUrl(todoId)
    const userId = parseUserId(jwtToken);
    await toDosAccess.updateAttachmentUrl(userId, todoId)

  return uploadUrl
    
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuid4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return toDosAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDosAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export  async function deleteToDo(todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken);
    await Promise.all([
        toDosAccess.deleteToDo(userId, todoId),
        toDosAccess.deleteTodoAttachment(todoId)
      ])  
    
}



