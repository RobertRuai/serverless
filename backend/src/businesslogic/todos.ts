import { ToDoAccess } from '../datalayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
 //all added code
const toDosAccess = new ToDoAccess();


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
    }

    logger.info('creating todo' + JSON.stringify(newTodo))

    await toDosAccess.createToDo(newTodo)

    return newTodo
}


export const getTodosForUser = async (userId: string) => {
    return await toDosAccess.getTodosForUser(userId);
}

export const generateUploadUrl = async (userId: string, todoId: string): Promise<string> => {
  const uploadUrl = await toDosAccess.getSignedUrl(todoId)
  await toDosAccess.updateAttachmentUrl(userId, todoId)

  return uploadUrl
}


export const updateToDo = async ( userId: string, todoId: string, updatedTodoRequest: UpdateTodoRequest) => {
    logger.info('calling update todo in todosAccess', updateToDo)
    return  await toDosAccess.updateToDo(userId, todoId, updatedTodoRequest)
}

export const deleteToDo = async (todoId: string, userId: string): Promise<void> => {
    return await toDosAccess.deleteToDo(todoId, userId)
}




