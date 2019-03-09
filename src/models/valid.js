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
    *list({ payload }, { call, put }) {
      const response = yield call(http.validList, payload);
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    *info({ payload }, { call, put }) {
      yield put({
        type: 'reset',
        payload: {
          type: 'info'
        }
      });
      if (payload.id == 0) {
        return;
      }
      const response = yield call(http.validInfo, payload);
      yield put({
        type: 'saveInfo',
        payload: response.data
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(http.validAdd, payload, { method: 'post' });
      yield put({
        type: 'save',
        payload: response.data
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(http.validRemove, payload, {
        method: 'post'
      });
      yield put({
        type: 'removeItems',
        payload: payload
      });
      if (callback) callback();
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
      data.list = data.list.filter(
        item => action.payload.id.indexOf(item.id) === -1
      );
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
