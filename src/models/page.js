import http from '@/common/request';
import { uuid } from '../utils/utils';
import _ from 'lodash';

const initState = {
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    app_id: '',
    pid: '',
    name: '',
    label: '',
    desc: '',
    path: '',
    page_template: {},
    page_component: []
  }
};

export default {
  namespace: 'page',

  state: _.cloneDeep(initState),

  effects: {
    *list({ payload, callback }, { call, put }) {
      const resData = yield call(http.pageList, payload);

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
        type: 'resetPage',
        payload: {
          type: 'info'
        }
      });
      if (payload.id == 0) {
        return;
      }
      const resData = yield call(http.pageInfo, payload);

      if (resData.code === 200) {
        const interResponse = yield call(http.interInfo, {
          id: resData.data.inter_id
        });
        resData.data.interInfo = interResponse.data;

        yield put({
          type: 'saveInfo',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *add({ payload, callback }, { call, put }) {
      const resData = yield call(http.pageAdd, payload, { method: 'post' });

      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *remove({ payload, callback }, { call, put }) {
      const resData = yield call(http.pageRemove, payload, { method: 'post' });

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
    addPageTemplate(state, action) {
      let info = state.info;
      // info.page_template.push(action.payload);
      info.page_template[0] = action.payload;
      return {
        ...state,
        info: info
      };
    },
    updatePageTemplate(state, action) {
      let info = state.info;

      info.page_template.forEach((item, index) => {
        if (item.key == action.key) {
          info.page_template[index] = action;
        }
      });

      return {
        ...state,
        info: info
      };
    },
    addTemplateFormFeild(state, action) {
      let info = state.info;
      let payload = action.payload;
      info.page_template[payload.templateIndex].content.children.push(payload.field);

      return {
        ...state,
        info: info
      };
    },
    addPageComponent(state, action) {
      let info = state.info;
      info.page_component.push(action.payload);
      return {
        ...state,
        info: info
      };
    },
    updatePageComponent(state, action) {
      let info = state.info;

      info.page_component.forEach((item, index) => {
        if (item.key == action.key) {
          info.page_component[index] = action;
        }
      });

      return {
        ...state,
        info: info
      };
    },

    removeItems(state, action) {
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) == -1);
      return {
        ...state,
        data: data
      };
    },

    resetPage(state, action) {
      const type = action.payload.type;
      if (type == 'list') {
        return {
          ...state,
          data: _.cloneDeep(initState.data)
        };
      } else if (type == 'info') {
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
