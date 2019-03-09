import http from '@/common/request';
import _ from 'lodash';
const initState = {
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    scaffold_id: '',
    name: '',
    label: '',
    desc: '',
    template: '',
    htmlTemplate: '',
    jsTemplate: '',
    cssTemplate: ''
  }
};

export default {
  namespace: 'layout',
  state: _.cloneDeep(initState),

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(http.layoutList, payload);
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
      const response = yield call(http.layoutInfo, payload);
      yield put({
        type: 'saveInfo',
        payload: response.data
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(http.layoutAdd, payload, { method: 'post' });
      yield put({
        type: 'save',
        payload: response.data
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(http.layoutRemove, payload, {
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
      const type = action.type;
      if (type === 'list') {
        return {
          ...state,
          data: initState.data
        };
      } else if (type === 'info') {
        return {
          ...state,
          info: initState.info
        };
      } else {
        return {
          ...initState
        };
      }
    }
  }
};
