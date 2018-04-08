import {
  Form,
  Checkbox,
  Radio,
  DatePicker,
  Input,
  Select,
  Button,
  Tooltip,
  Icon,
  Row,
  Col,
  message
} from 'antd';
import JSON5  from 'json5';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { TextArea } = Input;


import { uuid } from '../../utils/utils.js';

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
export default class ExtraFieldConfig extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || [];
    this.state = {
      extraField: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({extraField: value});

    }
  }
  componentDidMount(){

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

  renderExtraFieldControl = (field) =>{
    let type = field.type;
    let optionsStr = field.options || '[]';
    let options = JSON5.parse(optionsStr);
    let defaultValue = field.default_value || '';
    let fieldControl = null;

    switch(type){
      case 'input':
        fieldControl = (<Input value={defaultValue} onChange={e => {this.change(e.target.value, 'default_value', field)}} placeholder="请输入"/>);
        break;
      case 'textarea':
        fieldControl = (<TextArea rows="1" value={defaultValue} onChange={e => {this.change(e.target.value, 'default_value', field)}} placeholder="请输入"/>);
        break;
      case 'checkbox':
        try{
          defaultValue = JSON5.parse(defaultValue);
        }catch(e){

        }

        if(typeof defaultValue != 'array'){
          defaultValue = [defaultValue];
        }

        fieldControl = (<CheckboxGroup options={options} defaultValue={defaultValue} onChange={value => {this.change(CheckboxGroup, 'default_value', field)}} />);
        break;
      case 'radio':
        fieldControl = (<RadioGroup options={options} defaultValue={defaultValue} onChange={value => {this.change(CheckboxGroup, 'default_value', field)}}  />);
        break;
      case 'select':
        fieldControl = (
            <Select defaultValue={defaultValue} onChange={value => {this.change(value, 'default_value', field)}}>
              {options.map(item => {
                return (
                  <Option key={item} value={item}>{item}</Option>
                );
              })}
            </Select>
          );
        break;
      case 'date':
        fieldControl = (
          <DatePicker defaultValue={defaultValue} onChange={value => {this.change(value, 'default_value', field)}} />
        );
        break;
      default:
        fieldControl = (<Input value={defaultValue} onChange={e => {this.change(e.target.value, 'default_value', field)}} placeholder="请输入"/>);

    }

    return fieldControl;
  }

  renderExtraField = (extraField) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return extraField.map((item, index) => {
      return (
          <Row key={item.id} gutter={8}>
            <Col className="gutter-row" span={3} style={{textAlign: 'right'}}>
              {item.name + '(' + item.label + ')'}
            </Col>
            <Col className="gutter-row" span={8}>
              {this.renderExtraFieldControl(item)}
            </Col>
            <Col className="gutter-row" span={11}>
              {item.desc}
            </Col>
          </Row>
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
        {this.renderExtraField(extraField)}
      </span>
    );
  }
}
