import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { CustomException } from './custome-exception';

@Catch(CustomException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
    
        // Check if the request is coming from GraphQL or REST endpoint
        const isGraphQl = GqlArgumentsHost.create(host).getContext().req !== undefined;
    
        if (exception instanceof CustomException) {
          const status = 500; // You can define your own status code
          const message = exception.message;
    
          this.logger.error(`[${request.method}] ${request.url}`, exception.stack);
    
          return {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: message,
            path: isGraphQl ? request.url : undefined,
          };
        } else {
          // For other unhandled exceptions
          const status = 500;
          const message = 'Internal Server Error';
    
          this.logger.error(`[${request.method}] ${request.url}`, exception.stack);
    
          return {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: message,
            path: isGraphQl ? request.url : undefined,
          };
        }
      }

//   catch(exception: any, host: ArgumentsHost): any {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest();

//     // Check if the request is coming from GraphQL or REST endpoint
//     const isGraphQl = GqlArgumentsHost.create(host).getContext().req !== undefined;

//     if (exception instanceof HttpException) {
//       const status = 500; // You can define your own status code
//       const message = exception.message;

//       this.logger.error(`[${request.method}] ${request.url}`, exception.stack);

//       return {
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         message: message,
//         path: isGraphQl ? request.url : undefined,
//       };
//     } else {
//       // For other unhandled exceptions
//       const status = 500;
//       const message = 'Internal Server Error';

//       this.logger.error(`[${request.method}] ${request.url}`, exception.stack);

//       return {
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         message: message,
//         path: isGraphQl ? request.url : undefined,
//       };
//     }
//   }
}
