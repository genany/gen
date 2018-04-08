import { pageList, pageInfo, pageRemove, pageAdd } from '../services/api';

const initState = {
    loading: false,
    data: {
      list: [],
      pagination: {},
    },
    info: {
      id: '',
      app_id: '',
      pid: '',
      name: '',
      label: '',
      desc: '',
      path: '',
      page_template: [],
      page_component: [],
    }
  };

export default {
  namespace: 'page',

  state: initState,

  effects: {
    *list({ payload }, { call, put }) {
      yield put({
        type: 'loading',
        payload: true,
      });
      const response = yield call(pageList, payload);
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
      const response = yield call(pageInfo, payload);
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
      const response = yield call(pageAdd, payload);
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
      const response = yield call(pageRemove, payload);
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
    addPageTemplate(state, action){
      let info = state.info;
      // info.page_template.push(action.payload);
      info.page_template[0] = action.payload;
      return {
        ...state,
        info: info,
      };
    },
    updatePageTemplate(state, action){
      let info = state.info;

      info.page_template.forEach((item, index) => {
        if(item.key == action.key){
          info.page_template[index] = action;
        }
      });

      return {
        ...state,
        info: info,
      };
    },
    addTemplateFormFeild(state, action){
      let info = state.info;
      let payload = action.payload;
      info.page_template[payload.templateIndex].content.fields.push(payload.field);

      return {
        ...state,
        info: info,
      };
    },
    addPageComponent(state, action){
      let info = state.info;
      info.page_component.push(action.payload);
      return {
        ...state,
        info: info,
      };
    },
    updatePageComponent(state, action){
      let info = state.info;

      info.page_component.forEach((item, index) => {
        if(item.key == action.key){
          info.page_component[index] = action;
        }
      });

      return {
        ...state,
        info: info,
      };
    },

    removeItems(state, action){
      const data = state.data;
      data.list = data.list.filter(item => action.payload.id.indexOf(item.id) == -1);
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
      const type = action.type;
      if(type == 'list'){
        return {
          ...state,
          data: initState.data,
        };
      }else if(type == 'info'){
        return {
          ...state,
          info: initState.info,
        };
      }else{
        return {
          ...initState,
        };
      }
    },
    reset(state, action){
      const type = action.type;
      if(type == 'list'){
        return {
          ...state,
          data: initState.data,
        };
      }else if(type == 'info'){
        return {
          ...state,
          info: initState.info,
        };
      }else{
        return {
          ...initState,
        };
      }
    },
  },
};
