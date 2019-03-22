import http from '@/common/request';

export default {
  namespace: 'user',

  state: {
    userInfo: {
      name: '',
      email: ''
    },
    list: [],
    currentUser: {}
  },

  effects: {
    // * fetch (_, { call, put }) {
    //   const resData = yield call(http.queryUsers)
    //   yield put({
    //     type: 'save',
    //     payload: resData.data
    //   })
    // },
    // * fetchCurrent (_, { call, put }) {
    //   const resData = yield call(http.queryCurrent)
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: resData.data
    //   })
    // },
    *getUserInfo({ payload, callback }, { call, put, select }) {
      const res = yield call(http.getUserInfo, payload);
      if (res.code === 200) {
        localStorage.setItem('user', JSON.stringify(res.data));
        yield put({
          type: 'userInfo',
          payload: res.data
        });
      }
      if (callback) {
        callback(res);
      }
    },
    *login({ payload, callback }, { call, put, select }) {
      const res = yield call(http.login, payload, { method: 'POST' });
      if (res.code === 200) {
        localStorage.setItem('user', JSON.stringify(res.data));
        yield put({
          type: 'userInfo',
          payload: res.data
        });
      }
      if (callback) {
        callback(res);
      }
    },
    *logout({ payload, callback }, { call, put, select }) {
      const res = yield call(http.logout, payload, { method: 'POST' });
      localStorage.setItem('user', '');
      if (res.code === 200) {
        localStorage.removeItem('user');
        yield put({
          type: 'userInfo',
          payload: res.data
        });
      }
      if (callback) {
        callback(res);
      }
    },
    *resetUserInfo({ payload, callback }, { call, put, select }) {
      localStorage.removeItem('user');
      yield put({
        type: 'userInfo',
        payload: {
          name: '',
          email: ''
        }
      });
      if (callback) {
        callback();
      }
    },
    *register({ payload, callback }, { call, put, select }) {
      const res = yield call(http.register, payload, { method: 'POST' });
      if (res.code === 200) {
        // localStorage.setItem('user', res.data)
        // yield put({
        //   type: 'userInfo',
        //   payload: res.data
        // })
      }
      if (callback) {
        callback(res);
      }
    }
  },

  reducers: {
    userInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload
        }
      };
    }
  }
};
