import { ArgumentsHost, Catch, HttpException, Logger } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {

    private readonly logger = new Logger(GqlHttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const gqlCtx = gqlHost.getContext();
        const status = exception.getStatus();
        const message = exception.message;

        if (exception instanceof HttpException) {

            const { statusCode, timestamp, message: errorMessage } = exception.getResponse() as {
                statusCode: number;
                timestamp: string;
                message?: string;
            };

            const errorResponse = {
                statusCode: status || statusCode || 500,
                message: message || errorMessage || 'Internal Server Error',
                timestamp: timestamp || new Date().toISOString(),
            };
                        
            return errorResponse

        } else { 
            console.log("error", exception);
            
        }

    }
}