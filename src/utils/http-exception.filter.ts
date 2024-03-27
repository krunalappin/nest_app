import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const type = host.getType<GqlContextType>();
    if (type === 'http') {
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus();
      const message = exception.message;

      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          message,
          path: request.url,
        });
    } else if (type === 'graphql') {
      return exception
    }
  }
}



// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//     const message = exception.message;

//     response
//       .status(status)
//       .json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         message,
//         path: request.url,
//       });
//   }
// }