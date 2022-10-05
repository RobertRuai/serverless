import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteToDo } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   // const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    
    // added code
    console.log("Processing Event ", event);
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId;
 
     await deleteToDo(todoId, userId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({})
    };

  }