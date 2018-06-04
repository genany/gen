import {
  Select,
  Card,
 } from 'antd';
import Attr from '../../components/Attr';
import {uuid} from '../../utils/utils';

const { Option } = Select;

export default class ComponentExtraField extends React.Component {
  state = {
    extra_field_value: undefined,
    component: {
      name: '',
      label: '',
      extra_field: [],
      origin_extra_field: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('component' in nextProps) {
      let component = nextProps.component;
      if(component && component.extra_field && component.origin_extra_field){
        this.setState({
          component: component,
        });
      }
    }
  }
  addExtraField = (extraFieldKey) => {
    let component = this.state.component;
    let currExtraField = component.origin_extra_field.find(item => item.key == extraFieldKey);
    if(currExtraField){
      component.extra_field.push(currExtraField);
      this.setState({component}, () => {
        this.props.onChange(this.state.component);
      });
    }else{
      console.error(component, extraFieldKey, '不存在怎么可能')
    }
  }

  changeExtraField = (extraField) => {
    let component = this.state.component;
    component.extra_field = extraField;
    this.setState({component}, () => {
      this.props.onChange(this.state.component);
    });
  }
  render() {
    const component = this.state.component;
    const extraField = component.extra_field;
    const originExtraField = component.origin_extra_field;
    originExtraField.forEach(item => item.key = item.key || uuid());
    originExtraField.forEach(item => {
      if(item.required && !extraField.find(item2 => item.name === item2.name)){
        extraField.push(item);
      }
    });
    const filterExtraField = originExtraField.filter(item => {
      return !extraField.filter(item2 => item.key == item2.key).length;
    })

    // if(!component.name){
    //   return (
    //     <Card title={'扩展字段'} style={{marginTop: 6}}>

    //     </Card>
    //   );
    // }
    const componentName = (component.fieldName ? `字段"${component.fieldName}"` : '') || component.label || component.name;

    return (
      <Card title={componentName + '扩展字段'} style={{marginTop: 6}}>
        <Select
        value={this.state.extra_field_value}
        placeholder="添加扩展字段"
        onChange={value => this.addExtraField(value)}
        style={{width: '100%'}}>
          {filterExtraField.map(item => {
            return (
              <Option value={item.key} key={item.key}>{item.label || item.name}</Option>
            )
          })}
        </Select>
        {component && component.extra_field.length ?
          (
            <Attr value={component.extra_field} onChange={(value) => this.changeExtraField(value)} placeholder="配置扩展字段" />
          )
          : ''
        }
      </Card>
    );
  }
}
