import http from '@/common/request';
import _ from 'lodash';
const initState = {
  loading: false,
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    name: '',
    label: '',
    desc: '',
    rule: '',
    error_msg: '',
    success_msg: ''
  }
};

export default {
  namespace: 'valid',

  state: _.cloneDeep(initState),

  effects: {
    *list({ payload, callback }, { call, put }) {
      const resData = yield call(http.validList, payload);
      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *info({ payload, callback }, { call, put }) {
      yield put({
        type: 'reset',
        payload: {
          type: 'info'
        }
      });
      if (payload.id == 0) {
        return;
      }
      const resData = yield call(http.validInfo, payload);

      if (resData.code === 200) {
        yield put({
          type: 'saveInfo',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *add({ payload, callback }, { call, put }) {
      const resData = yield call(http.validAdd, payload, { method: 'post' });
      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }
      if (callback) callback(resData);
    },
    *remove({ payload, callback }, { call, put }) {
      const resData = yield call(http.validRemove, payload, {
        method: 'post'
      });
      if (resData.code === 200) {
        yield put({
          type: 'removeItems',
          payload: payload
        });
      }
      if (callback) callback(resData);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload
      };
    },
    removeItems(state, action) {
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) === -1);
      return {
        ...state,
        data: data
      };
    },
    reset(state, action) {
      const type = action.payload.type;
      if (type === 'list') {
        return {
          ...state,
          data: _.cloneDeep(initState.data)
        };
      } else if (type === 'info') {
        return {
          ...state,
          info: _.cloneDeep(initState.info)
        };
      } else {
        return {
          ...initState
        };
      }
    }
  }
};
