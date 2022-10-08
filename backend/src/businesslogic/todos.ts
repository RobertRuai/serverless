import { ToDoAccess } from '../datalayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
 //all added code
const toDosAccess = new ToDoAccess();
const attachmentUtils = new AttachmentUtils()

const s3BucketName = process.env.S3_BUCKET_NAME
const signedurlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('TodosAccess')

export const createToDo = async (createTodoRequest: CreateTodoRequest, userId: string) => {
    const todoId = uuid.v4()
    const newTodo: TodoItem = {
        todoId,
        userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    }

    logger.info('creating todo' + JSON.stringify(newTodo))

    await toDosAccess.createToDo(newTodo)

    return newTodo
}


export const getTodosForUser = async (userId: string) => {
    return await toDosAccess.getTodosForUser(userId);
}

export const createAttachmentPresignedUrl = async (todoId: string): Promise<string> => {
    logger.info('creating attachment signed url')
    return await attachmentUtils.getSignedUrl(s3BucketName, todoId, signedurlExpiration)
}


export const updateToDo = async ( userId: string, todoId: string, updatedTodoRequest: UpdateTodoRequest) => {
    logger.info('calling update todo in todosAccess', updateToDo)
    return  await toDosAccess.updateToDo(userId, todoId, updatedTodoRequest)
}

export const deleteToDo = async (todoId: string, userId: string): Promise<void> => {
    return await toDosAccess.deleteToDo(todoId, userId)
}




