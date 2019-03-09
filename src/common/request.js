// import fetch from 'dva/fetch'
import React from 'react';
import { notification, message, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import axios from 'axios';
import store from '@/index';
import urlMaps, { baseUrl, loginWhiteList } from './urlMaps';
import cookie from 'js-cookie';
import { getQueryString } from '../utils/utils';

const http = {};
export default http;

Object.keys(urlMaps).forEach(item => {
  http[item] = (url => {
    return (data, options) => {
      options = options || { method: 'GET' };
      options.originUrl = url;
      url = baseUrl + url;

      const newOptions = { ...options, data: data };

      return request(url, newOptions);
    };
  })(urlMaps[item]);
});

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
  504: '网关超时。'
};

function checkStatus(res) {
  const request = res.request;
  const response = res.response;
  const config = res.config;
  if (request.status >= 200 && request.status < 300) {
    return res;
  }
  const errorText = codeMessage[request.status] || request.statusText;
  notification.error({
    message: `请求错误 ${request.status}`,
    description: (
      <div>
        <Alert message="请求地址" description={config.originUrl} type="error" />
        <Alert
          message="请求数据"
          description={config.data}
          type="error"
          style={{ marginTop: 10 }}
        />
        {/* <Alert message='返回数据' description={request.responseText} type='error' /> */}
      </div>
    )
  });
  const error = new Error(errorText);
  error.name = request.status;
  error.response = res;
  return error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  const defaultOptions = {
    // credentials: 'include'
  };
  const newOptions = { ...defaultOptions, ...options };
  let method = newOptions.method || 'get';
  method = method.toLocaleUpperCase();
  newOptions.data = newOptions.data || {};
  let hostname = window.location.hostname;
  // 本地开发使用get，方便调试
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    method = 'GET';
    newOptions.method = method;
  }

  if (method === 'POST' || method === 'PUT') {
    if (!(newOptions.data instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      };
      // console.log(options, 'options')
      newOptions.body = JSON.stringify(newOptions.data);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
        ...newOptions.headers
      };
    }
  } else if (method === 'GET') {
    let urlConnectChar = '&';
    if (url.indexOf('?') === -1) {
      urlConnectChar = '?';
    }

    url +=
      urlConnectChar +
      'data=' +
      window.encodeURIComponent(JSON.stringify(newOptions.data));
  }
  newOptions.headers = newOptions.headers || {};
  newOptions.headers['x-csrf-token'] = cookie('csrfToken');

  newOptions.url = url;

  const user = getQueryString('user');
  if (user) {
    newOptions.headers['token'] = 'user';
  }

  return axios(newOptions).then(response => {
    const { dispatch } = store;
    const code = response.data.code;

    if (code === 200) {
    } else if (code === 1000) {
      dispatch({ type: 'user/resetUserInfo', payload: {} });
      dispatch(routerRedux.push('/user/userLogin'));
      // return
    } else {
      message.error(response.data.msg || '请求失败');
    }
    return response.data;
  }, checkStatus);
}
