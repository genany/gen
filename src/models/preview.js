import http from '@/common/request';

export default {
  namespace: 'preview',

  state: {
    pagePreviewLoading: false,
    data: {}
  },

  effects: {
    *page({ payload, callback }, { call, put }) {
      yield put({
        type: 'pagePreviewLoading',
        payload: true
      });
      const response = yield call(http.previewPage, payload);
      yield put({
        type: 'pagePreviewLoading',
        payload: false
      });
      if (callback) callback();
    },
    *preview({ payload, callback }, { call, put }) {
      yield put({
        type: 'pagePreviewLoading',
        payload: true
      });
      const response = yield call(http.preview, payload);
      yield put({
        type: 'pagePreviewLoading',
        payload: false
      });
      if (callback) callback();
    }
  },

  reducers: {
    pagePreviewLoading(state, action) {
      return {
        ...state,
        pagePreviewLoading: action.payload
      };
    }
  }
};
