import http from '@/common/request';
import { enquireScreen, unenquireScreen } from 'enquire-js';

export default {
  namespace: 'global',

  state: {
    isMobile: false,
    form: {
      layout: 'inline'
    },
    collapsed: false,
    userInfo: {},
    noticeList: [],
    letterNav: {}
  },

  effects: {
    *getUserInfo({ payload, callback }, { call, put, select }) {
      const resData = yield call(http.getUserInfo, payload);

      if (resData.code === 200) {
        yield put({
          type: 'userInfo',
          payload: {
            name: 'daycool',
            email: 'qmw920@163.com'
          }
        });
      }

      if (callback) callback(resData);
    },
    *getLetterNav({ payload }, { call, put, select }) {
      const res = yield call(http.getLetterNav, payload);
      console.log(res);
      yield put({
        type: 'letterNav',
        payload: res.payload
      });
    },
    *fetchNotices(_, { call, put }) {},
    *clearNotices({ payload }, { put, select }) {}
  },

  reducers: {
    userInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        noticeList: payload
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        noticeList: state.notices.filter(item => item.type !== payload)
      };
    },
    changeMobile(state, { payload }) {
      return {
        ...state,
        isMobile: payload.isMobile,
        form: {
          ...state.form,
          layout: payload.layout
        }
      };
    },
    letterNav(state, { payload }) {
      return {
        ...state,
        letterNav: payload
      };
    }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      enquireScreen(isMobile => {
        dispatch({
          type: 'changeMobile',
          payload: {
            isMobile: isMobile,
            layout: isMobile ? 'vertical' : 'inline'
          }
        });
      });

      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    }
  }
};
