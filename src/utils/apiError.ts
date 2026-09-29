export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public fields?: Record<string, string>;

  constructor(statusCode: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, fields?: Record<string, string>) {
    return new ApiError(400, 'BAD_REQUEST', message, fields);
  }

  static validationError(message: string, fields?: Record<string, string>) {
    return new ApiError(422, 'VALIDATION_ERROR', message, fields);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message: string = 'Access denied') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string) {
    return new ApiError(409, 'CONFLICT', message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, 'INTERNAL_SERVER_ERROR', message);
  }
}
