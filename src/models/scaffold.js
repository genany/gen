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
      const response = yield call(getScaffoldFiles, payload);
      // response.key = payload.key
      response.data.list.forEach(item => {
        item.value = '' + item.name;
        item.key = uuid();
        item.title = item.label || item.name;
        if (!item.isFile) {
          item.children = [];
        } else {
          item.isLeaf = true;
        }
      });
      console.log(response.data.list);
      if (callback) callback(response.data.list);
    },
    *fileContent({ payload, callback }, { call, put }) {
      const response = yield call(getScaffoldFileContent, payload);

      if (callback) callback(response.data);
    },
    *list({ payload }, { call, put }) {
      const response = yield call(http.scaffoldList, payload);
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
      const response = yield call(http.scaffoldInfo, payload);
      yield put({
        type: 'saveInfo',
        payload: response.data
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(http.scaffoldAdd, payload, {
        method: 'post'
      });
      yield put({
        type: 'removeItems',
        payload: payload
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(http.scaffoldRemove, payload, {
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
    saveFiles(state, action) {
      // response.data.treeData = arrToTree(response.data.list, 'id', 'pid', '0');

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
