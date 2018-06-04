import { layoutList, layoutInfo, layoutRemove, layoutAdd } from '../services/api';
import _ from 'lodash';
const initState = {
  loading: false,
  data: {
    list: [],
    pagination: {},
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
    cssTemplate: '',
  }
};

export default {
  namespace: 'layout',
  state: _.cloneDeep(initState),

  effects: {
    * list({ payload }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(layoutList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'loading',
        payload: false,
      });
    },
    * info({ payload }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      yield put({
        type: 'reset',
        payload: {
          type: 'info',
        }
      });
      if (payload.id == 0) {
        return;
      }
      const response = yield call(layoutInfo, payload);
      yield put({
        type: 'saveInfo',
        payload: response.data,
      });
      yield put({
        type: 'loading',
        payload: false,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(layoutAdd, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(layoutRemove, payload);
      yield put({
        type: 'removeItems',
        payload: payload,
      });
      yield put({
        type: 'loading',
        payload: false,
      });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload,
      }
    },
    removeItems(state, action) {
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) == -1);
      return {
        ...state,
        data: data,
      }
    },
    loading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    },
    reset(state, action) {
      const type = action.type;
      if (type == 'list') {
        return {
          ...state,
          data: initState.data,
        };
      } else if (type == 'info') {
        return {
          ...state,
          info: initState.info,
        };
      } else {
        return {
          ...initState,
        };
      }
    },
  },
};
