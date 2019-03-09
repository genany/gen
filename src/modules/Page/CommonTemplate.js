import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import produce from 'immer';

import _ from 'lodash';

import jeditor from '../../components/package/index.js';
import HjsonData, { hjsonToJsonSchema, jsonSchemaToHjson } from 'hjson2';
import Template from './Template.js';
const GenerateSchema = require('generate-schema/src/schemas/json.js');

const mock = [
  // { name: '字符串', mock: '@string' },
  // { name: '自然数', mock: '@natural' },
  // { name: '浮点数', mock: '@float' },
  // { name: '字符', mock: '@character' },
  // { name: '布尔', mock: '@boolean' },
  // { name: 'url', mock: '@url' },
  // { name: '域名', mock: '@domain' },
  // { name: 'ip地址', mock: '@ip' },
  // { name: 'id', mock: '@id' },
  // { name: 'guid', mock: '@guid' },
  // { name: '当前时间', mock: '@now' },
  // { name: '时间戳', mock: '@timestamp' },
];

let CommentsJsonSchemaEditor = null;
let ReqJsonSchemaEditor = null;
let ResJsonSchemaEditor = null;

@connect(({ template, component, loading }) => ({
  template,
  component,
  submitting: loading.effects['template/list']
}))
export default class CommonTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      req: '',
      reqJsonSchema: null,
      reqJsonSchemaStr: '',
      res: '',
      resJsonSchema: null,
      resJsonSchemaStr: '',
      comments: '',
      commentsJsonSchema: null,
      commentsJsonSchemaStr: '',
      template: undefined,
      source: '',
      type: '',
      paths: [],
      component: null
    };

    CommentsJsonSchemaEditor = jeditor({ mock: mock });
    ReqJsonSchemaEditor = jeditor({ mock: mock });
    ResJsonSchemaEditor = jeditor({ mock: mock });
  }
  // getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(
  //     'TCL: CommonTemplate -> getDerivedStateFromProps -> nextProps',
  //     nextProps
  //   )
  //   const state = {}
  //   const value = nextProps.value || { req: '', res: '', comments: '' }
  //   if (value.req !== prevState.req) {
  //     state.req = jsonSchemaToHjson(hjsonToJsonSchema(nextProps.req))
  //   }
  //   if (value.res !== prevState.res) {
  //     state.res = jsonSchemaToHjson(hjsonToJsonSchema(nextProps.res))
  //   }
  //   if (value.comments !== prevState.comments) {
  //     state.comments = jsonSchemaToHjson(hjsonToJsonSchema(nextProps.comments))
  //   }
  //   if (Object.keys(state).length) {
  //     return state
  //   }

  //   return null
  // }
  componentWillReceiveProps(nextProps) {
    const prevState = this.state;
    const state = {};
    const value = nextProps.value || { req: '', res: '', comments: '' };
    if (value.req !== prevState.req) {
      state.req = value.req;
      state.reqJsonSchema = hjsonToJsonSchema(state.req);
      state.reqJsonSchemaStr = JSON.stringify(state.reqJsonSchema);
    }
    if (value.res !== prevState.res) {
      state.res = value.res;
      state.resJsonSchema = hjsonToJsonSchema(state.res);
      state.resJsonSchemaStr = JSON.stringify(state.resJsonSchema);
    }
    if (value.comments !== prevState.comments) {
      state.comments = value.comments;
      state.commentsJsonSchema = hjsonToJsonSchema(state.comments);
      state.commentsJsonSchemaStr = JSON.stringify(state.commentsJsonSchema);
    }

    if (nextProps.currComponent && this.state.type) {
      let type = this.state.type;
      let jsonSchema = this.state[`${type}JsonSchema`];
      set(jsonSchema, this.state.paths.slice(0, -1), nextProps.currComponent);

      // hjson.setCommentJson(this.state.paths, nextProps.currComponent)

      state[`${type}`] = jsonSchemaToHjson(jsonSchema);
      state[`${type}JsonSchema`] = jsonSchema;
      state[`${type}JsonSchemaStr`] = JSON.stringify(state[`${type}JsonSchema`]);
    }

    if (Object.keys(state).length) {
      this.setState(state);
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'template/list',
      payload: {}
    });
    this.props.dispatch({
      type: 'component/list',
      payload: {}
    });
  }
  componentWillUnmout() {
    CommentsJsonSchemaEditor = null;
    ReqJsonSchemaEditor = null;
    ResJsonSchemaEditor = null;
  }

  onChange = (source, type) => {
    this.setState(
      produce(state => {
        state.type = type;
        state[`${type}JsonSchemaStr`] = source;
        state[`${type}JsonSchema`] = JSON.parse(source);
        state[`${type}`] = jsonSchemaToHjson(state[`${type}JsonSchema`]);
      }),
      () => {
        this.triggerOnChange();
      }
    );
  };
  onChangeTemplate = template => {
    const info = this.props.value;
    this.setState(
      produce(state => {
        state.commentsJsonSchema.template.__componentName = template.name;
        state.commentsJsonSchemaStr = JSON.stringify(state.commentsJsonSchema);
        state.comments = jsonSchemaToHjson(state.commentsJsonSchema);
      }),
      () => {
        this.triggerOnChange();
      }
    );
  };
  onSelectedComponent = (paths, component, type) => {
    this.setState({ type, paths, component }, () => {
      this.props.onSelectedComponent(component);
    });
  };

  triggerOnChange() {
    const { reqJsonSchema, resJsonSchema, commentsJsonSchema } = this.state;
    this.props.onChange({
      ...this.props.value,
      req: reqJsonSchema ? jsonSchemaToHjson(reqJsonSchema) : '',
      res: resJsonSchema ? jsonSchemaToHjson(resJsonSchema) : '',
      comments: commentsJsonSchema ? jsonSchemaToHjson(commentsJsonSchema) : ''
    });
  }

  render() {
    let templateName = '';
    if (this.state.commentsJsonSchema) {
      templateName = this.state.commentsJsonSchema.template.__componentName;
    }
    return (
      <div>
        <Card title="模版">
          <Template value={templateName} onChange={this.onChangeTemplate} />
        </Card>
        <Card title="请求数据">
          <ReqJsonSchemaEditor
            showEditor={false}
            isMock={true}
            data={this.state.reqJsonSchemaStr}
            template={this.props.template.data.list}
            component={this.props.component.data.list}
            onChange={e => {
              this.onChange(e, 'req');
            }}
            selectedComponent={(paths, val) => {
              this.onSelectedComponent(paths, val, 'req');
            }}
          />
        </Card>
        <Card title="响应数据">
          <ResJsonSchemaEditor
            showEditor={false}
            isMock={true}
            data={this.state.resJsonSchemaStr}
            template={this.props.template.data.list}
            component={this.props.component.data.list}
            onChange={e => {
              this.onChange(e, 'res');
            }}
            selectedComponent={(paths, val) => {
              this.onSelectedComponent(paths, val, 'res');
            }}
          />
        </Card>
      </div>
    );
  }
}

function set(obj, paths, value) {
  paths.forEach((key, index) => {
    if (index === paths.length - 1) {
      obj[key] = value;
    } else {
      obj = obj[key];
    }
  });
}
