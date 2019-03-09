import { routerRedux } from 'dva/router';
import http from '@/common/request';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(http.fakeAccountLogin, payload, {
        method: 'post'
      });
      yield put({
        type: 'changeLoginStatus',
        payload: {
          ...response.data,
          status: 'ok',
          currentAuthority: 'admin',
          type: 'account'
        }
      });
      // Login successfully
      if (response.code === 200) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest'
          }
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    }
  }
};
