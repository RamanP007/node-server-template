export class ModelValidationError extends Error {
  public name = "";
  public readonly errors: { message: string }[] = [];

  constructor(message: string, name?: string, errors?: { message: string }[]) {
    super(message);
    this.name = name || "";
    this.errors = errors || [];
  }
}

export interface JwtAuthPayload {
  _uid: number;
  _status: number;
  _ut: string;
}
