import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// 定义接口返回数据的通用结构
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 定义扩展的请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean; // 是否显示加载提示
  showError?: boolean; // 是否显示错误提示
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟(ms)
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 例如：添加 token
    const token = 'ndbsdhjbdsjbvdh';
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 可以在这里处理 loading 显示
    if ((config as RequestConfig).showLoading) {
      // showLoading()
    }

    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 可以在这里隐藏 loading
    // hideLoading()

    const res = response.data as ApiResponse<any>;
    console.log(response.data, 'response.data');
    // 根据自定义错误码处理
    if (res.code !== 200) {
      // 处理业务错误
      console.log('Business Error:', res?.message);

      // 可以根据不同的错误码做不同处理
      switch (res.code) {
        case 401:
          // 未授权，跳转登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          break;
        case 500:
          // 服务器错误
          break;
        default:
          break;
      }

      return Promise.reject(res || 'Error');
    }

    return res as any;
  },
  (error: AxiosError) => {
    // 响应错误处理
    // hideLoading()

    let errorMessage = 'Request Failed';

    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      switch (status) {
        case 400:
          errorMessage = 'Bad Request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'Forbidden';
          break;
        case 404:
          errorMessage = 'Not Found';
          break;
        case 500:
          errorMessage = 'Internal Server Error';
          break;
        default:
          errorMessage = `Error ${status}`;
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      errorMessage = 'Network Error - No Response';
    } else {
      // 请求配置出错
      errorMessage = error.message;
    }

    console.error('Response Error:', errorMessage);

    return Promise.reject(error);
  }
);

// 带重试机制的请求
function requestWithRetry<T = any>(
  config: RequestConfig
): Promise<ApiResponse<T>> {
  return service.request(config) as Promise<ApiResponse<T>>;
}

// 封装 GET 请求
export function get<T = any>(
  url: string,
  params?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return requestWithRetry<T>({
    url,
    method: 'GET',
    params,
    ...config,
  });
}

// 封装 POST 请求
export function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return requestWithRetry<T>({
    url,
    method: 'POST',
    data,
    ...config,
  });
}

// 封装 PUT 请求
export function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return requestWithRetry<T>({
    url,
    method: 'PUT',
    data,
    ...config,
  });
}

// 封装 DELETE 请求
export function del<T = any>(
  url: string,
  params?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return requestWithRetry<T>({
    url,
    method: 'DELETE',
    params,
    ...config,
  });
}

// 封装 PATCH 请求
export function patch<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  return requestWithRetry<T>({
    url,
    method: 'PATCH',
    data,
    ...config,
  });
}

// 上传文件
export function upload<T = any>(
  url: string,
  file: File | Blob,
  config?: RequestConfig,
  filename: string = 'file'
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append(filename, file);

  return requestWithRetry<T>({
    url,
    method: 'POST',
    data: formData,
    headers: new axios.AxiosHeaders({
      'Content-Type': 'multipart/form-data',
    }),
    ...config,
  } as RequestConfig);
}

/**
 * 下载文件
 *
 * @param url - 文件下载地址
 * @param filename - 下载后保存的文件名，默认为 'download'
 */
export function download(url: string, filename?: string): void {
  service({
    url,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
}

export default {
  get,
  post,
  put,
  delete: del,
  patch,
  upload,
  download,
};
