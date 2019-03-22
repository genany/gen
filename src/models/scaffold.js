import http from '@/common/request';
import { uuid } from '../utils/utils.js';
import native from '../utils/native.js';

import _ from 'lodash';

const { scaffoldFiles, scaffoldFileContent } = http;

async function getScaffoldFiles(params) {
  if (native.isNativeEnable()) {
    return new Promise((resolve, reject) => {
      native.scaffoldFiles(params, data => {
        resolve({
          code: 200,
          msg: '辅助工具获取文件list成功',
          data: {
            list: data
          }
        });
      });
    });
  } else {
    return scaffoldFiles(params);
  }
}

async function getScaffoldFileContent(params) {
  if (native.isNativeEnable()) {
    return new Promise((resolve, reject) => {
      native.getFileContent(params, data => {
        resolve({
          code: 200,
          msg: '辅助工具获取文件内容成功',
          data: data
        });
      });
    });
  } else {
    return scaffoldFileContent(params);
  }
}

const initState = {
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    name: '',
    label: '',
    desc: '',
    file: '',
    extra_template: [],
    router_file_path: '',
    router_template: '',
    menu_file_path: '',
    menu_template: '',
    page_dir: '',
    store_template: '',
    store_dir: '',
    service_template: '',
    service_dir: ''
  },
  files: {
    list: [],
    treeData: []
  }
};

export default {
  namespace: 'scaffold',

  state: _.cloneDeep(initState),

  effects: {
    *files({ payload, callback }, { call, put }) {
      const resData = yield call(getScaffoldFiles, payload);
      // resData.key = payload.key
      if (resData.code === 200) {
        resData.data.list.forEach(item => {
          item.value = '' + item.name;
          item.key = uuid();
          item.title = item.label || item.name;
          if (!item.isFile) {
            item.children = [];
          } else {
            item.isLeaf = true;
          }
        });
      }
      if (callback) callback(resData.data.list);
    },
    *fileContent({ payload, callback }, { call, put }) {
      const resData = yield call(getScaffoldFileContent, payload);

      if (callback) callback(resData.data);
    },
    *list({ payload, callback }, { call, put }) {
      const resData = yield call(http.scaffoldList, payload);

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
      const resData = yield call(http.scaffoldInfo, payload);

      if (resData.code === 200) {
        yield put({
          type: 'saveInfo',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *add({ payload, callback }, { call, put }) {
      const resData = yield call(http.scaffoldAdd, payload, {
        method: 'post'
      });

      if (resData.code === 200) {
      }

      if (callback) callback(resData);
    },
    *remove({ payload, callback }, { call, put }) {
      const resData = yield call(http.scaffoldRemove, payload, {
        method: 'post'
      });

      if (resData.code === 200) {
        yield put({
          type: 'removeItems',
          payload: payload
        });
      }

      if (callback) callback(resData);
    },
    *pullCode({ payload, callback }, { call, put }) {
      const resData = yield call(http.pullCode, payload);

      if (resData.code === 200) {
      }

      if (callback) callback(resData);
    }
  },

  reducers: {
    saveFiles(state, action) {
      return {
        ...state,
        files: {
          list: action.payload.list,
          treeData: action.payload.list
        }
      };
    },
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
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) == -1);
      return {
        ...state,
        data: data
      };
    },

    reset(state, action) {
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
