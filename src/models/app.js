import { appList, appInfo, appRemove, appAdd } from '../services/api';
import { arrToTree } from '../utils/utils';
import native from '../utils/native.js';
import _ from 'lodash';
const initState = {
  loading: false,
  data: {
    list: [],
    pagination: {},
  },
  info: {
    id: '',
    name: '',
    label: '',
    desc: '',
    base_url: '',
    inter_app_id: '',
    scaffold_id : '',
    layout_id: '',
    page: [],
    pageTreeData: [],
  }
};

export default {
  namespace: 'app',

  state: _.cloneDeep(initState),

  effects: {
    *list({ payload }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(appList, payload);
      response.data.list.forEach(item => {
        let project = native.getProject(item.id);
        if(project){
          item.projectPath = project.projectPath;
        }
      })
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'loading',
        payload: false,
      });
    },
    *info({payload}, {call, put}) {
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
      if(payload.id == 0){
         return ;
      }

      const response = yield call(appInfo, payload);
      response.data.pageTreeData = arrToTree(response.data.page, 'id', 'pid', null);
      yield put({
        type: 'saveInfo',
        payload: response.data,
      });
      yield put({
        type: 'loading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(appAdd, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(appRemove, payload);
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
    saveInfo(state, action){
      return {
        ...state,
        info: action.payload,
      }
    },
    removeItems(state, action){
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) == -1);
      return {
        ...state,
        data: data,
      }
    },
    updateProjectPath(state, action){
      const data = state.data;
      let project = data.list.find(item => action.payload.id);
      project.projectPath = action.payload.projectPath;

      return {
        ...state,
        data: data,
      }
    },
    loading(state, action){
      return {
        ...state,
        loading: action.payload,
      }
    },
    reset(state, action){
      const type = action.payload.type;
      if(type == 'list'){
        return {
          ...state,
          data: _.cloneDeep(initState.data),
        };
      }else if(type == 'info'){
        return {
          ...state,
          info: _.cloneDeep(initState.info),
        };
      }else{
        return {
          ...initState,
        };
      }
    },
  },
};
