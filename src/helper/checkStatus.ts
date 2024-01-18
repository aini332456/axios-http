import { ResponseCodeEnum, ServiceOptions, errorRoutePathEnum } from "../index";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (
  status: number,
  errorMessageBox: Required<ServiceOptions>["errorProcess"]["errorMessageBox"],
  pushRoute: Required<ServiceOptions>["errorProcess"]["pushRoute"]
) => {
  switch (status) {
    case ResponseCodeEnum.BadRequest:
      errorMessageBox && errorMessageBox("请求失败！请您稍后重试");
      break;
    case ResponseCodeEnum.Unauthorized:
      errorMessageBox && errorMessageBox("登录失效！请您重新登录");
      pushRoute && pushRoute(errorRoutePathEnum.Unauthorized);
      break;
    case ResponseCodeEnum.Forbidden:
      errorMessageBox && errorMessageBox("当前账号无权限访问！");
      break;
    case ResponseCodeEnum.NotFound:
      errorMessageBox && errorMessageBox("你所访问的资源不存在！");
      pushRoute && pushRoute(errorRoutePathEnum.NotFound);
      break;
    case ResponseCodeEnum.MethodNotAllowed:
      errorMessageBox && errorMessageBox("请求方式错误！请您稍后重试");
      break;
    case ResponseCodeEnum.RequestTimeout:
      errorMessageBox && errorMessageBox("请求超时！请您稍后重试");
      break;
    case ResponseCodeEnum.InternalServerError:
      errorMessageBox && errorMessageBox("服务异常！");
      pushRoute && pushRoute(errorRoutePathEnum.InternalServerError);
      break;
    case ResponseCodeEnum.BadGateway:
      errorMessageBox && errorMessageBox("网关错误！");
      break;
    case ResponseCodeEnum.ServiceUnavailable:
      errorMessageBox && errorMessageBox("服务不可用！");
      break;
    case ResponseCodeEnum.GatewayTimeout:
      errorMessageBox && errorMessageBox("网关超时！");
      break;
    default:
      errorMessageBox && errorMessageBox("请求失败！");
  }
};
