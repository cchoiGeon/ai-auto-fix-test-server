import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(statusCode: number, code: string, message: string) {
    super({ statusCode, code, message }, statusCode);
  }
}
