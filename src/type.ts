import { InternalAxiosRequestConfig } from "axios";
import { errorRoutePathEnum } from "./index";
export type ServiceOptions = {
  /**重复请求拦截 */
  repeatRequestProcess?: boolean;
  /**显示loading */
  loadingProcess?: {
    showLoading: () => void;
    /**hideLoading应该是幂等的 */
    hideLoading: () => void;
  };
  /**携带token */
  tokenProcess?: {
    tokenHeaders?: string;
    getToken: () => string;
  };
  /**响应处理 */
  errorProcess?: {
    /**常见错误消息弹框 查看./ResponseCodeEnum.ts */
    errorMessageBox?: (msg: string) => void;
    /**404, 500等情况下路由跳转 */
    pushRoute?(routerPath: errorRoutePathEnum): void;
  };
};
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  cancel?: boolean;
}
