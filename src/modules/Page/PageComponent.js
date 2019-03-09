import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Tree,
  Row,
  Col,
  Table,
  Divider,
  Switch,
  message,
  Popconfirm,
  TreeSelect,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ExtraFieldConfig from '../../components/ExtraFieldConfig';
import Attr from '../../components/Attr';
import { uuid } from '../../utils/utils.js';
import JSON5 from 'json5';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 3 }
  }
};

const formItemLayoutFull = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
    md: { span: 21 }
  }
};

@Form.create()
export default class PageComponent extends PureComponent {
  constructor(props) {
    super(props);

    const component = this.props.component || { content: { extra_field: [] } };
    this.state = {
      component: component
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('component' in nextProps) {
      const component = nextProps.component;
      component.content.extra_field = component.content.extra_field || [];
      this.setState({ component: component });
    }
  }
  componentDidMount() {}

  triggerChange = component => {
    this.setState({
      component: component
    });

    setTimeout(() => {
      this.props.dispatch({
        type: 'page/updateComponent',
        payload: component
      });
    });
  };

  render() {
    // const { template } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const component = this.state.component;
    const validData = this.props.valid.data;
    const interData = this.props.inter.data;
    const extra_field = component.content.extra_field;
    const formFieldData = [];
    const componentLabel = component.label || component.content.label;

    return (
      <div>
        <Card title={componentLabel}>
          {extra_field.length
            ? getFieldDecorator('extra_field', {
                initialValue: extra_field,
                rules: [
                  {
                    required: true,
                    message: '扩展字段'
                  }
                ]
              })(<Attr placeholder="配置扩展字段" />)
            : '此组件没有配置项'}
        </Card>
      </div>
    );
  }
}
