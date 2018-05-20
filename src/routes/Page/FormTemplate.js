import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  Table, Divider, Switch,
  message,
  Popconfirm,
  TreeSelect,
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ExtraFieldConfig from '../../components/ExtraFieldConfig';
import Attr from '../../components/Attr';
import {uuid} from '../../utils/utils.js';
import _ from 'lodash';
import JSON5 from 'json5';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    md: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

const submitFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

const formItemLayoutFull = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 },
  },
};

@Form.create()
export default class PageTemplate extends PureComponent {

  constructor(props) {
    super(props);

    const template = this.props.template || {content: {fields: [], extra_field: []}};
    this.state = {
      template: template,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('template' in nextProps) {
      const template = nextProps.template;
      template.content.fields = template.content.fields || [];
      template.content.extra_field = template.content.extra_field || [];
      this.setState({template: template});

    }
  }
  componentDidMount(){

  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'pageTemplate/add',
          payload: values,
          callback: () => {
            message.success('保存成功');

          }
        });
      }
    });
  }

  getDefaultField = (name, defaultValue) => {
    const componentData = this.props.component.data;
    const defaultFieldType = 'input';
    const defaultField = componentData.list.find(item => item.name == 'input');
    const field = {
      name: name || '',
      label: '',
      type: defaultFieldType,
      component: {
        ...defaultField,
        extra_field: []
      },
      placeholder: '',
      default_value: defaultValue || '',
      rules: [],
    };
    return field;
  }

  addFormFeild = () => {
    const template = {...this.state.template};
    const fields = template.content.fields;
    const field = this.getDefaultField();

    fields.push(field);

    this.triggerChange(template);
  }
  addValidRule = (fieldRecord) => {
    const template = this.state.template;
    const fields = template.content.fields;
    fields.forEach(field => {
      if(field.key == fieldRecord.key){
        field.rules.push({
          name: '',
          rule: '',
          success_msg: '',
          error_msg: '',
        });
      }
    });

    this.triggerChange(template);
  }
  getValidRule(value){
    var rule = null;
    this.props.valid.data.list.forEach(item => {
      if(item.name == value){
        rule = item;
      }
    });
    return rule;
  }

  changeValid(value, record, name, fieldRecord){
    const template = {...this.state.template};
    const fields = template.content.fields;
    const rule = this.getValidRule(value);
    fields.forEach(item => {
      item.rules.forEach(ruleItem => {
        if(ruleItem.key == record.key){
          ruleItem[name] = value;
          ruleItem.rule = rule.rule;
          ruleItem.error_msg = rule.error_msg;
          ruleItem.success_msg = rule.success_msg;
        }
      });
    });

    this.setState({
      template: template
    });

    this.triggerChange(template);
  }

  changeTemplate = (value, record, name, fieldRecord) => {
    const template = {...this.state.template};
    template[name] = value;

    this.triggerChange(template);
  }

  changeExtraField = (value, record, name, fieldRecord) => {
    const template = {...this.state.template};
    const extra_field = template.content.extra_field;
    extra_field.forEach(item => {
      if(item.name == record.name){
        item.default_value = value;
      }
    });

    this.triggerChange(template);
  }

  change = (value, record, name, fieldRecord) => {
    const template = this.state.template;
    const fields = template.content.fields;
    fields.forEach(item => {
      if(item.key == record.key){
        item[name] = value;
      }
    });

    this.triggerChange(template);
  }
  changeComponent = (value, record, name, fieldRecord) => {//验证才有fieldRecord
    var originComponent = this.props.component.data.list.find(item => item.name == value);
    var component = _.cloneDeep(originComponent);
    console.log(originComponent, component , 3333333)
    component.uuid = uuid();
    component.extra_field = [];
    this.change(value, record, name, fieldRecord);
    this.change(component, record, 'component', fieldRecord);//字段得有组件
    this.props.onChangeComponent(component, record);
  }
  selectedComponent = (record) => {//选中组件,用来修改组件扩展字段
    if(!record.type) return ;
    var component = this.props.component.data.list.find(item => item.name == record.type);
    this.props.onChangeComponent(record.component, record);
  }
  changeRuleRow = (value, record, name, fieldRecord) => {
    const template = this.state.template;
    const fields = template.content.fields;
    fields.forEach(item => {
      item.rules.forEach(rule => {
        if(rule.key == record.key){
          rule[name] = value;
        }
      });
    });
    this.triggerChange(template);
  }

  triggerChange = (template) => {


    this.props.dispatch({
      type: 'page/updateTemplate',
      payload: template
    });
  }

  // triggerComponentChange = (component) => {
  //   this.props.onChangeComponent(component);
  // }

  selectInter = (value) => {
    const interData = {...this.props.inter.data};
    let inter = interData.list.find(item => {
      return item.id == value;
    });
    const template = this.state.template;
    if(inter){
      let reqDataStr = inter.req_data || '{}';
      let resDataStr = inter.res_data;
      // console.log(reqDataStr)
      let reqData = JSON5.parse(reqDataStr);
      let fields = this.buildFeildData(reqData);
      template.content.fields = fields;
      template.inter_id = inter.id;
    }else{
      template.content.fields = [];
      template.inter_id = '';
    }
  }

  buildFeildData = (data) => {
    const componentData = this.props.component.data;
    const fields = [];
    Object.keys(data).forEach(item => {
      const defaultFieldType = 'input';
      const defaultField = componentData.treeData.filter(item => item.name == 'form').find(item => item.name == 'input');
      const field = this.getDefaultField(item, data[item]);
      fields.push(field);
    });
    return fields;
  }

  onDeleteField = (record) => {
    const template = this.state.template;
    template.content.fields = template.content.fields.filter(item => item.key != record.key);
    this.triggerChange(template);
  }
  onDeleteValidRule = (record, fieldRecord) => {
    const template = this.state.template;
    const fields = template.fields;

    fields.forEach(item => {
      if(item.key == fieldRecord.key){
        item.rules = item.rules.filter(rule => rule.key != record.key);
      }
    });

    this.triggerChange(template);
  }

  render(){
    // const { template } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const template = this.state.template;
    const componentData = this.props.component.data;
    const validData = this.props.valid.data;
    const interData = this.props.inter.data;
    const formFieldData = [];
    const fields = template.content.fields;
    const extra_field = template.content.extra_field;
    const componentList = componentData.treeData.filter(item => item.name == 'form');

    fields.forEach(item => {
      item.key = item.key || uuid();
    })

    const formFieldColumns = [
      {
        dataIndex: 'name',
        title: '字段',
        key: 'name',
        render: (text, record) => {
          return (
            <Input value={text} onChange={e => this.change(e.target.value, record, 'name')} placeholder="字段"/>
          );
        }
      },
      {
        width: 100,
        dataIndex: 'type',
        title: '类型',
        key: 'type',
        render: (text, record) => {
          return (
            <TreeSelect
              style={{ width: 150 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={componentList}
              placeholder="请选择组件"
              treeDefaultExpandAll
              defaultValue={text}
              onChange={(value) => this.changeComponent(value, record, 'type')}
            />
          );
        }
      },
      {
        dataIndex: 'label',
        title: 'Label',
        key: 'label',
        render: (text, record) => {
          return (
            <Input value={text}  onChange={e => this.change(e.target.value, record, 'label')} placeholder="Label"/>
          );
        }
      },
      {
        dataIndex: 'default_value',
        title: '默认值',
        key: 'default_value',
        render: (text, record) => {
          return (
            <Input value={text}  onChange={e => this.change(e.target.value, record, 'default_value')} placeholder="默认值"/>
          );
        }
      },
      {
        dataIndex: 'placeholder',
        title: 'Placeholder',
        key: 'placeholder',
        render: (text, record) => {
          return (
            <Input value={text}  onChange={e => this.change(e.target.value, record, 'placeholder')} placeholder="placeholder"/>
          );
        }
      },
      {
        dataIndex: 'is_valid',
        title: '验证',
        key: 'is_valid',
        render: (text, record) => {
          return (
            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
          );
        }
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm title="确认删除吗？" onConfirm={() => this.onDeleteField(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      }
    ];

    const expandedRowValidRender = (fieldRecord) => {
      const rulesData = fieldRecord.rules;
      rulesData.forEach(item => {
        item.key = item.key || uuid();
      });

      const ruleColumns = [
        {
          width: 120,
          dataIndex: 'name',
          title: '名称',
          key: 'name',
          render: (text, record) => {
            return (
              <Select onChange={(value) => {this.changeValid(value, record, 'name', fieldRecord)}} placeholder="名称">
                {
                  validData.list.map(item => {
                    return (
                      <Option value={item.name} key={item.id}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            );
          }
        },
        {

          dataIndex: 'rule',
          title: '规则',
          key: 'rule',
          render: (text, record) => {
            return (
              <Input value={text} onChange={e => this.changeRuleRow(e.target.value, record, 'rule', fieldRecord)} placeholder="规则"/>
            );
          }
        },
        {
          dataIndex: 'error_msg',
          title: '错误',
          key: 'error_msg',
          render: (text, record) => {
            return (
              <Input value={text} onChange={e => this.changeRuleRow(e.target.value, record, 'error_msg', fieldRecord)} placeholder="错误信息"/>
            );
          }
        },
        {
          dataIndex: 'success_msg',
          title: '成功',
          key: 'success_msg',
          render: (text, record) => {
            return (
              <Input value={text} onChange={e => this.changeRuleRow(e.target.value, record, 'success_msg', fieldRecord)} placeholder="成功信息"/>
            );
          }
        },
        {
          dataIndex: 'operation',
          title: '操作',
          key: 'operation',
          render: (text, record) => (
            <span className="table-operation">
              <Popconfirm title="确认删除吗？" onConfirm={() => this.onDeleteValidRule(record, fieldRecord)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          ),
        },
      ];

      return (
        <span>
          <Table
            columns={ruleColumns}
            dataSource={rulesData}
            pagination={false}
            size="small"
          />
          <Button type="primary" onClick={() => {this.addValidRule(fieldRecord)}} style={{marginTop: 16}}>
            添加验证
          </Button>
        </span>
      );
    };

    return (
      <div>
        <Card title={template.label}>
          <FormItem {...formItemLayout} label="接口：">
            {getFieldDecorator('inter_id', {
              initialValue: template.inter_id,
              rules: [{
                required: true, message: '请选择接口',
              }],
            })(
              <Select onChange={(value) => {this.selectInter(value)}} placeholder="选择接口自动生成">
                <Option value="" key="">不使用接口</Option>
                {interData.list.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>{item.label}</Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="表单页面配置：">
            <Table
              columns={formFieldColumns}
              dataSource={fields}
              expandedRowRender={expandedRowValidRender}
              pagination={false}
              size="middle"
              onRow={record => {
                return {
                  onClick: () => {
                    this.selectedComponent(record);
                  }
                };
              }}
            />
            <Button type="primary" onClick={this.addFormFeild} style={{marginTop: 16}}>
              添加字段
            </Button>
          </FormItem>
        </Card>

      </div>
    );
  }
}
