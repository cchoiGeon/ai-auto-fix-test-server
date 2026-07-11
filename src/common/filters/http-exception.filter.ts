import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiException } from '../exception/api.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 하나의 에러를 4줄로 흩뿌리지 않도록 단일 로그로 합친다.
    // method url → status | 상세메시지 | body(있을 때만)
    const detail =
      exception instanceof HttpException ? exception.getResponse() : exception;
    const hasBody =
      request.body && Object.keys(request.body as object).length > 0;
    const logLine =
      `${request.method} ${request.url} → ${status} ` +
      `| ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` +
      (hasBody ? ` | body=${JSON.stringify(request.body)}` : '');

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // 서버 오류·예상치 못한 예외만 디버깅용 스택까지 같은 로그에 첨부
      this.logger.error(
        logLine,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      // 4xx 클라이언트 오류는 한 줄 경고로 (스택 생략 → 노이즈 제거)
      this.logger.warn(logLine);
    }

    // ApiException인 경우 (커스텀 에러 코드 포함)
    if (exception instanceof ApiException) {
      const exceptionResponse = exception.getResponse() as {
        statusCode: number;
        code: string;
        message: string;
      };

      response.status(status).json({
        statusCode: status,
        message: exceptionResponse.message,
        data: {
          code: exceptionResponse.code,
          message: exceptionResponse.message,
        },
      });
      return;
    }

    // 일반 HttpException인 경우
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const errorMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Error';

      const errorCode = `HTTP_${status}`;

      response.status(status).json({
        statusCode: status,
        message: errorMessage,
        data: {
          code: errorCode,
          message: errorMessage,
        },
      });
      return;
    }

    // 그 외 예외 (500 에러)
    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
      data: {
        code: 'HTTP_500',
        message: 'Internal server error',
      },
    });
  }
}
