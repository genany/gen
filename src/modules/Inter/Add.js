import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  message,
  notification,
  Popconfirm,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Tabs
} from 'antd';
import JSON5 from 'json5';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CodeArea from '../../components/CodeArea';
import { setToEn } from '../../utils/utils.js';
import {
  formItemPageLayout,
  formItemLayout,
  submitFormLayout,
  formItemLayoutFull
} from '../../utils/formLayout.js';
import { objToHjsonStr, hjsonStrToObj, objToHjson, hjsonToHjsonStr, HjsonData } from 'hjson2';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ inter, interApp, loading }) => ({
  inter,
  interApp,
  submitting: loading.effects['inter/add']
}))
@Form.create()
export default class Add extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      tabKey: 'form'
    };
  }
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.dispatch({
      type: 'inter/info',
      payload: {
        id: id
      }
    });
    this.props.dispatch({
      type: 'interApp/list',
      payload: {}
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let id = this.props.inter.info.id;
        let payload = values;
        if (id) {
          payload = {
            ...payload,
            id
          };
        }
        this.props.dispatch({
          type: 'inter/add',
          payload: payload,
          callback: resData => {
            if (resData.code === 200) {
              message.success('保存成功');
              this.props.dispatch(routerRedux.push('/inter/list'));
            }
          }
        });
      }
    });
  };
  cancel = () => {
    this.props.dispatch(routerRedux.push('/inter/list'));
  };
  trans = type => {
    this.setState({ tabKey: type });
    if (type === 'form') {
      this.toForm();
    } else {
      this.toSource();
    }
  };
  toSource = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    const sourceHjson = new HjsonData().parse(`
                                              {
                                                label: '',
                                                url: '',
                                                method: '',
                                                header: '',
                                                res_header: '',
                                                req: '',
                                                res: '',
                                              }`);

    const templateHjson = new HjsonData().parse(getFieldValue('comments'));
    const reqHjson = new HjsonData().parse(getFieldValue('req'));
    const resHjson = new HjsonData().parse(getFieldValue('res'));

    sourceHjson.obj.label = getFieldValue('label');
    sourceHjson.obj.url = getFieldValue('url');
    sourceHjson.obj.method = getFieldValue('method');
    sourceHjson.obj.header = hjsonStrToObj(getFieldValue('header'));
    sourceHjson.obj.res_header = hjsonStrToObj(getFieldValue('res_header'));
    sourceHjson.obj.req = hjsonStrToObj(getFieldValue('req'));
    sourceHjson.obj.res = hjsonStrToObj(getFieldValue('res'));

    sourceHjson.setRootCommentJson(templateHjson.getRootCommentJson());
    sourceHjson.setCommentJson(['req'], reqHjson.getRootCommentJson());
    sourceHjson.setCommentJson(['res'], resHjson.getRootCommentJson());

    setFieldsValue({
      source: sourceHjson.stringify()
    });
  };

  toForm = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const sourceHjson = new HjsonData().parse(getFieldValue('source'));
    const sourceObj = sourceHjson.obj;
    // const sourceObj = sourceHjson.obj;
    const templateHjson = new HjsonData().parse('');
    const headerHjson = new HjsonData().parse('');
    const resHeaderHjson = new HjsonData().parse('');
    const reqHjson = new HjsonData().parse('');
    const resHjson = new HjsonData().parse('');
    headerHjson.obj = sourceHjson.obj.header;
    resHeaderHjson.obj = sourceHjson.obj.res_header;
    reqHjson.obj = sourceHjson.obj.req;
    resHjson.obj = sourceHjson.obj.res;
    templateHjson.setRootCommentJson(sourceHjson.getRootCommentJson());
    // headerHjson.setRootCommentJson(sourceHjson.getCommentJson(['header']))
    // resHeaderHjson.setRootCommentJson(
    //   sourceHjson.getCommentJson(['res_header'])
    // )
    reqHjson.setRootCommentJson(sourceHjson.getCommentJson(['req']));
    resHjson.setRootCommentJson(sourceHjson.getCommentJson(['res']));

    setFieldsValue({
      label: sourceObj.label,
      url: sourceObj.url,
      method: sourceObj.method,
      comments: hjsonToHjsonStr(templateHjson),
      header: hjsonToHjsonStr(headerHjson),
      res_header: hjsonToHjsonStr(resHeaderHjson),
      req: hjsonToHjsonStr(reqHjson),
      res: hjsonToHjsonStr(resHjson)
    });
    // this.setState(
    //   {
    //     source: hjsonStrToObj(getFieldValue('source'))
    //   },
    //   () => {
    //     setFieldsValue({
    //       ...this.state.source
    //     });
    //   }
    // );
  };
  onChangeContent = (obj, hjson, content) => {
    this.hjson = hjson;
    // this.setState({ content: obj }, () => {
    //   console.log(this.state.content, 333333333);
    // });
  };
  render() {
    const {
      inter: { info },
      submitting
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const interAppData = this.props.interApp.data;
    console.log('TCL: this.state.source', this.state.source);
    return (
      <Card bordered={false}>
        <Tabs activeKey={this.state.tabKey} onChange={this.trans}>
          <Tabs.TabPane tab="表单" key="form">
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="所属项目：">
                {getFieldDecorator('inter_app_id', {
                  initialValue: info.inter_app_id,
                  rules: [
                    {
                      required: true,
                      message: '所属项目'
                    }
                  ]
                })(
                  <Select>
                    <Option value="">请选择所属项目</Option>
                    {interAppData.list.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="名称：">
                {getFieldDecorator('label', {
                  initialValue: info.label,
                  rules: [
                    {
                      required: true,
                      message: '名称'
                    }
                  ]
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="接口分类：">
                {getFieldDecorator('cate_id', {
                  initialValue: info.cate_id,
                  rules: [
                    {
                      required: true,
                      message: '接口分类'
                    }
                  ]
                })(
                  <Select>
                    <Option value={1}>用户</Option>
                    <Option value={2}>帖子</Option>
                    <Option value={3}>视频</Option>
                    <Option value={4}>支付</Option>
                    <Option value={5}>订单</Option>
                    <Option value={6}>商品</Option>
                    <Option value={7}>公用</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="请求方式：">
                {getFieldDecorator('method', {
                  initialValue: info.method,
                  rules: [
                    {
                      required: true,
                      message: '请求方式'
                    }
                  ]
                })(
                  <Select>
                    <Option value="GET">GET</Option>
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="OPTIONS">OPTIONS</Option>
                    <Option value="DELETE">DELETE</Option>
                    <Option value="HEAD">HEAD</Option>
                    <Option value="PATCH">PATCH</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="地址：">
                {getFieldDecorator('url', {
                  initialValue: info.url,
                  rules: [
                    { required: true, message: '请输入Path' },
                    {
                      pattern: /^(\/)?[a-zA-Z]+([a-zA-Z0-9_\/]*)$/,
                      message: '请输入以字母开头,只包含字母、数字、下划线字符'
                    }
                  ]
                })(<Input placeholder="/user/userInfo" />)}
              </FormItem>
              <FormItem {...formItemLayoutFull} label="模版：">
                {getFieldDecorator('comments', {
                  initialValue: info.comments,
                  rules: [{ required: true, message: '请求Header' }]
                })(
                  <CodeArea
                    type="javascript"
                    placeholder={`
请输入模版 如：
`}
                    height="150px"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayoutFull} label="请求Header：">
                {getFieldDecorator('header', {
                  initialValue: info.header,
                  rules: [{ required: true, message: '请求Header' }]
                })(
                  <CodeArea
                    type="javascript"
                    placeholder={`
请输入json或json5 如：
{
  content-type: application/json; charset=UTF-8,
  token: 'xxxxxx'
}`}
                    height="100px"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayoutFull} label="请求数据：">
                {getFieldDecorator('req', {
                  initialValue:
                    info.req ||
                    `
//dddd
              `,
                  rules: [{ required: true, message: '请求数据' }]
                })(<CodeArea type="javascript" placeholder={`请输入hjson`} height="300px" />)}
              </FormItem>
              <FormItem {...formItemLayoutFull} label="响应Header：">
                {getFieldDecorator('res_header', {
                  initialValue: info.res_header,
                  rules: [{ required: true, message: '响应Header' }]
                })(<CodeArea type="javascript" placeholder={`请输入hjson`} height="100px" />)}
              </FormItem>
              <FormItem {...formItemLayoutFull} label="响应数据：">
                {getFieldDecorator('res', {
                  initialValue: info.res,
                  rules: [{ required: true, message: '请求数据' }]
                })(
                  <CodeArea
                    type="javascript"
                    placeholder={`
请输入json或json5 如：
{
  code: 200,
  msg: "成功",
  data: {
    id: 123456,
    name: "daycool",
    addr: "河北",
    github: "https://github.com/daycool",
  }
}`}
                    height="300px"
                  />
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
                <Button
                  type="warning"
                  loading={submitting}
                  style={{ marginLeft: 16 }}
                  onClick={() => message.warn('开发中，敬请期待。。。')}
                >
                  保存并生成页面
                </Button>
                <Popconfirm title="修改不会保存，确认取消吗？" onConfirm={this.cancel}>
                  <Button type="danger" style={{ marginLeft: 16 }}>
                    取消
                  </Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="源码" key="source">
            <FormItem {...formItemLayoutFull} label="响应数据：">
              {getFieldDecorator('source', {
                initialValue: ''

                // rules: [
                //   { required: true, message: '源码' },
                //   {
                //     validator: function(rule, value, callback) {},
                //     message: '必须是合法hjson',
                //     trigger: 'blur',
                //   },
                // ],
              })(<CodeArea type="javascript" height="900px" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                onClick={() => {
                  notification.warning({ message: '请在表单页保存' });
                  this.setState({ tabKey: 'form' });
                }}
              >
                保存
              </Button>

              <Popconfirm title="修改不会保存，确认取消吗？" onConfirm={this.cancel}>
                <Button type="danger" style={{ marginLeft: 16 }}>
                  取消
                </Button>
              </Popconfirm>
            </FormItem>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
