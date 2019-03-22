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
      const resData = yield call(http.previewPage, payload);
      if (resData.code === 200) {
      }
      yield put({
        type: 'pagePreviewLoading',
        payload: false
      });

      if (callback) callback(resData);
    },
    *preview({ payload, callback }, { call, put }) {
      yield put({
        type: 'pagePreviewLoading',
        payload: true
      });
      const resData = yield call(http.preview, payload);
      yield put({
        type: 'pagePreviewLoading',
        payload: false
      });

      if (callback) callback(resData);
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
