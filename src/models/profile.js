import http from '@/common/request';

export default {
  namespace: 'profile',

  state: {
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: []
  },

  effects: {
    *fetchBasic(_, { call, put }) {
      const response = yield call(http.queryBasicProfile);
      yield put({
        type: 'show',
        payload: response
      });
    },
    *fetchAdvanced(_, { call, put }) {
      const response = yield call(http.queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response
      });
    }
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
