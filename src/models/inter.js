import http from '@/common/request';
import _ from 'lodash';
const initState = {
  data: {
    list: [],
    pagination: {}
  },
  info: {
    id: '',
    inter_app_id: '',
    name: '',
    label: '',
    cate_id: '',

    url: '',
    method: '',
    comments: `/*
 template|form: {}
*/
{}
              `,
    header: `{

}`,
    req: `
/*
  ui|form: {}
*/
{
  /*
    label: "名称",
    ui|input: {}
  */
  name: daycool
}`,
    res_header: `{

}`,
    res: `
{
  code: 200
  msg: 成功
  data: {

  }
}`
  }
};

export default {
  namespace: 'inter',

  state: _.cloneDeep(initState),

  effects: {
    *list({ payload, callback }, { call, put }) {
      const resData = yield call(http.interList, payload);

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
      const resData = yield call(http.interInfo, payload);

      if (resData.code === 200) {
        yield put({
          type: 'saveInfo',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *add({ payload, callback }, { call, put }) {
      const resData = yield call(http.interAdd, payload, { method: 'post' });

      if (resData.code === 200) {
        yield put({
          type: 'save',
          payload: resData.data
        });
      }

      if (callback) callback(resData);
    },
    *remove({ payload, callback }, { call, put }) {
      const resData = yield call(http.interRemove, payload, {
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
