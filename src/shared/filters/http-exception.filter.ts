import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  
  private readonly logger = new Logger(HttpExceptionFilter.name);
  
  constructor(@Inject('winston') private readonly winstonLogger: Logger) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const err = {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: String(error.stack)
      }
      this.logger.error(error.stack)
      this.winstonLogger.error(err)
      return response.status(500).json(err)
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: error.message
    })
  }
}