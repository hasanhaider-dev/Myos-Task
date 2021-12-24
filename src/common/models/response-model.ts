export class ResponseModel <Any> {
  message: string;
  payload: Any;
  statusCode: string;
  hasError: boolean;
}
