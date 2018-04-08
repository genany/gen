import {
  Form,
  Input,
  Select,
  Button,
  Tooltip,
  Icon,
  Row,
  Col,
  message
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

import { uuid } from '../../utils/utils.js';
import {setToEn, zh2En} from '../../utils/utils.js';
import CodeArea from '../CodeArea';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 3 },
  },
};

const formItemLayoutFull = {
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

@Form.create()
export default class ExtraField extends React.Component {
  constructor(props) {
    super(props);

    const value = [...this.props.value] || [];
    this.state = {
      extraField: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = [...nextProps.value];
      this.setState({extraField: value});

    }
  }
  componentDidMount(){

  }
  componentWillUnmount(){

  }

  addExtraField = () => {
    let extraField = this.state.extraField;
    let extraFieldItem = {
      name: '',
      label: '',
      desc: '',
      type: '',
      options: [],
      default_value: '',
    };

    extraField.push(extraFieldItem);
    this.setState({
      extraField: extraField
    });

    this.triggerChange(extraField);

    // this.props.dispatch({
    //   type: 'template/addExtraField',
    //   payload: extraField,
    // });
  }
  toEn = (value, name, record) => {
    const extraField = this.state.extraField;


    zh2En(value).then((enValue) => {
      extraField.forEach(item => {
        if(item.key == record.key){
          item[name] = enValue;
        }
      });
      this.setState({
        extraField: extraField
      });
      this.triggerChange(extraField);

    });
  }

  change = (value, name, record) => {
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      if(item.key == record.key){
        item[name] = value;
      }
    });

    this.setState({
      extraField: extraField
    });

    this.triggerChange(extraField);

    // this.props.dispatch({
    //   type: 'template/updateExtraField',
    //   payload: extraField
    // });
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  renderExtraField = (extraField) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return extraField.map((item, index) => {
      return (
        <FormItem key={item.key} {...formItemLayoutFull} label={'扩展字段' + (index + 1)}>
          <Row gutter={8}>
            <Col className="gutter-row" span={8}>
              <Input value={item.name} onChange={e => {this.change(e.target.value, 'name', item)}} placeholder="请输入英文名称"/>
            </Col>
            <Col className="gutter-row" span={8}>
              <Input value={item.label} onBlur={(e) => {this.toEn(e.target.value, 'name', item)}} onChange={e => {this.change(e.target.value, 'label', item)}} placeholder="请输入中文名称"/>
            </Col>
            <Col className="gutter-row" span={8}>
              <Select value={item.type} onChange={e => {this.change(e, 'type', item)}} placeholder="请选择值类型">
                <Option value="">请选择值控件类型</Option>
                <Option value="radio">单选</Option>
                <Option value="checkbox">多选</Option>
                <Option value="input">单行输入</Option>
                <Option value="textarea">多行输入</Option>
                <Option value="select">下拉选择</Option>
                <Option value="date">日期</Option>
              </Select>
            </Col>
            <Col className="gutter-row" span={8}>
              <TextArea lineNumbers={false} value={item.desc} onChange={value => {this.change(value, 'desc', item)}} placeholder="请输入简介" />
            </Col>
            <Col className="gutter-row" span={8}>
              <CodeArea lineNumbers={false} value={item.options} onChange={value => {this.change(value, 'options', item)}} placeholder="请输入选项" />
            </Col>
            <Col className="gutter-row" span={8}>
              <CodeArea lineNumbers={false} value={item.default_value} onChange={value => {this.change(value, 'default_value', item)}} placeholder="请输入默认值" />
            </Col>
          </Row>
        </FormItem>
      );
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const extraField = this.state.extraField;
    extraField.forEach(item => {
      item.key = item.key || uuid();
    });
    return (
      <span>
        <Row gutter={8}>
          <Col className="gutter-row" span={3}>
            扩展字段&nbsp;
            <Tooltip title="这里得扩展字段，在模版中直接使用，在创建页面一定显示，让用户配置。比如组件的属性或方法配置">
              <Icon type="question-circle-o" />
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={8}>
            <Button onClick={this.addExtraField} >添加扩展字段</Button>
          </Col>
        </Row>
        {this.renderExtraField(extraField)}
      </span>
    );
  }
}
