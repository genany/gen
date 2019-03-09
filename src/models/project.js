import http from '@/common/request';

export default {
  namespace: 'project',

  state: {
    notice: []
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      const response = yield call(http.queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : []
      });
    }
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload
      };
    }
  }
};
