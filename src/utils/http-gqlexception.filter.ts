import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter, GqlExecutionContext } from "@nestjs/graphql";

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: GqlArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = ctx.res;

    let status = 500;
    let message = 'Internal Server Error';
    let error = 'Unknown Error';

    if (exception && exception.getStatus) {
      status = exception.getStatus();
    }

    if (exception && exception.getResponse) {
      const responseObject = exception.getResponse();
      if (responseObject && responseObject['error']) {
        error = responseObject['error'];
      }
      if (responseObject && responseObject['message']) {
        message = responseObject['message'];
      }
    }
    return exception;

    // response.status(status).json({
    //   // status,
    //   error,
    //   message,
    // });
  }
}


