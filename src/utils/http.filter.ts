import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response, response } from 'express';
import { SOMETHING_WENT_WRONG } from 'src/constants/message-constants';
import { LoggerHelper } from 'src/logger/logger.service';

export class MyException extends HttpException {
    constructor(status: number, message: string, errorCode?: string) {
        super({ statusCode: status, message, errorCode }, status);
    }
}

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
    constructor() {
        
    }
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        ctx.getResponse<Response>();
        let status: number;
        let message: string;
        console.log(exception, '<==exception===');
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            if (status === HttpStatus.INTERNAL_SERVER_ERROR)
                message = SOMETHING_WENT_WRONG;
            else message = exception.message;
        } else {
            // this.logger.error(message);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = SOMETHING_WENT_WRONG;
        }
        if (message && status === HttpStatus.NOT_FOUND) {
            return ;          
        }
    }
}

