class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    stack = '',
    error = [],
  ){
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.sucess = false;
    this.data = null;

    if(stack){
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}