import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    // console.log(exception.validationErrors)

    const validationErrors = exception.validationErrors.map(e => {
      return {
        property: e.property,
        children: e.children,
        constraints: e.constraints
      }
    })

    const err = this.formatErrors(exception.validationErrors)

    return response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: 'ValidationException',
      message: err,
      validationMetadata: validationErrors
    });
  }

  private formatErrors(errors: any[]) {
    return errors.map((err) => {
      for (let property in err.constraints) {
        return err.constraints[property];
      }
    })
  }
}
