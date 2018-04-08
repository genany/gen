import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  let method = newOptions.method || 'get';
  method = method.toLocaleUpperCase();
  newOptions.body = newOptions.body || {};
  let hostname = window.location.hostname;
  //本地开发使用get，方便调试
  if(hostname == 'localhost' || hostname == '127.0.0.1'){
    method = 'GET';
    newOptions.method = method;
  }



  if (method === 'POST' || method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      // console.log(options, 'options')
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }else if(method == 'GET'){
    let urlConnectChar = '&';
    if(url.indexOf('?') === -1){
      urlConnectChar = '?';
    }

    url += urlConnectChar + 'data=' + window.encodeURIComponent(JSON.stringify(newOptions.body));
  }

  // var reqBaseUrl = 'http://127.0.0.1:8360';
  // url = reqBaseUrl + url;

  // newOptions.mode = 'cors';
  // console.log(url, newOptions, '请求数据');

  if(window.baseUrl){
    url = window.baseUrl + url;
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }

      const p = new Promise((resolve, reject) => {
        response.json().then(resData => {
          if(resData.code === 1000){
            store.dispatch(routerRedux.push('/user/login'));
          }else if(resData.code  > 1000){
            notification.error({
              message: `请求错误 ${resData.code}: ${url}`,
              description: resData.msg,
            });
          }else{
            resolve(resData);
          }
        });
      });
      return p;
    })
    .catch((e) => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
