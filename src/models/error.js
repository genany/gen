import http from '@/common/request';

export default {
  namespace: 'error',

  state: {
    error: '',
    isloading: false
  },

  effects: {
    *query403(_, { call, put }) {
      yield call(http.query403);
      yield put({
        type: 'trigger',
        payload: '403'
      });
    },
    *query401(_, { call, put }) {
      yield call(http.query401);
      yield put({
        type: 'trigger',
        payload: '401'
      });
    },
    *query500(_, { call, put }) {
      yield call(http.query500);
      yield put({
        type: 'trigger',
        payload: '500'
      });
    },
    *query404(_, { call, put }) {
      yield call(http.query404);
      yield put({
        type: 'trigger',
        payload: '404'
      });
    }
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload
      };
    }
  }
};
