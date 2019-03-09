import http from '@/common/request';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(http.register, payload);
      yield put({
        type: 'registerHandle',
        payload: response
      });
    }
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status
      };
    }
  }
};
