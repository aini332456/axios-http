import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AxiosCanceler } from "./helper/axiosCancel";
import { checkStatus } from "./helper/checkStatus";
import { ServiceOptions, CustomAxiosRequestConfig } from "./type";
import { ResponseCodeEnum } from "./enum";
export * from "./type";
export * from "./enum";

const axiosCanceler = new AxiosCanceler();

export default class RequestHttp {
  service: AxiosInstance;
  public constructor(
    config: AxiosRequestConfig,
    serviceOptions: ServiceOptions
  ) {
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        /**重复请求处理 */
        if (serviceOptions.repeatRequestProcess ?? true) {
          // 如果重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
          if (config.cancel ?? true) {
            axiosCanceler.addPending(config);
          }
        }

        /**显示loading */
        if (serviceOptions.loadingProcess) {
          // 如果当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
          if (config.loading ?? true) {
            serviceOptions.loadingProcess.showLoading();
          }
        }

        /**携带token */
        if (serviceOptions.tokenProcess) {
          if (config.headers && typeof config.headers.set === "function") {
            config.headers.set(
              serviceOptions.tokenProcess.tokenHeaders || "Authorization",
              serviceOptions.tokenProcess.getToken()
            );
          }
        }

        return config;
      },

      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;
        const config: CustomAxiosRequestConfig = response.config;
        /**从请求表中移除 */
        axiosCanceler.removePending(config);
        /**隐藏loading */
        serviceOptions.loadingProcess?.hideLoading();
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        const errorMsgBox = serviceOptions.errorProcess?.errorMessageBox;
        const pushRoute = serviceOptions.errorProcess?.pushRoute;
        /**隐藏loading */
        serviceOptions.loadingProcess?.hideLoading();
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) {
          checkStatus(response.status, errorMsgBox, pushRoute);
        } else if (!window.navigator.onLine) {
          checkStatus(
            ResponseCodeEnum.InternalServerError,
            errorMsgBox,
            pushRoute
          );
        }
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}
