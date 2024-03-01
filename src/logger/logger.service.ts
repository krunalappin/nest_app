import { Logger } from '@nestjs/common';

export class LoggerHelper {
  private logger = new Logger();

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string, trace?: string, exception?: unknown) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
