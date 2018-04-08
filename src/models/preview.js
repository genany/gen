import { previewApp, previewPage } from '../services/api';

export default {
  namespace: 'preview',

  state: {
    pagePreviewLoading: false,
    data: {

    },

  },

  effects: {
    *page({payload, callback}, {call, put}){
      yield put({
        type: 'pagePreviewLoading',
        payload: true,
      });
      const response = yield call(previewPage, payload);
      yield put({
        type: 'pagePreviewLoading',
        payload: false,
      });
      if (callback) callback();
    }
  },

  reducers: {
    pagePreviewLoading(state, action){
      return {
        ...state,
        pagePreviewLoading: action.payload,
      }
    }
  },
};
