import { Logger } from '@nestjs/common';

export class CustomException extends Error {
  constructor(public readonly message: string, private readonly logger: Logger) {
    super(message);
    this.logger.error(message);
  }
}
