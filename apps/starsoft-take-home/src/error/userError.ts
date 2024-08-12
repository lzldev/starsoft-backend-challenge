export class UserError extends Error {
  statusCode = 400;
  constructor(message: string, code = 400) {
    super(message);
    this.statusCode = code;
  }
}
