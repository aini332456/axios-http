/**
 * @description：响应CODE
 */
export enum ResponseCodeEnum {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

/**
 * @description：错误页面
 */
export enum errorRoutePathEnum {
  InternalServerError = "/500",
  NotFound = "/400",
  Unauthorized = "/login",
}
