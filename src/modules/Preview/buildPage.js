/*
* @Author: daycool
* @Date:   2018-02-28 14:10:44
 * @Last Modified by: daycool
 * @Last Modified time: 2018-09-14 18:41:15
*/

const nunjucks = require('nunjucks');
const fs = require('fs');
const prettier = require('prettier');

nunjucks.configure({
  autoescape: false,
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  }
});

const componentList = [
  {
    templateName: '表单',
    name: 'input',
    label: '文本框',
    template: `
      <FormItem {...formItemLayout} label="<$ data.label $>：">
        {getFieldDecorator('<$ data.name $>', {
          initialValue: '<$ data.name $>',
          <% for item in data.rules %>
          rules: [{
            required: true, message: '请输入<$ item.errMsg $>',
          }],
          <% endfor %>
        })(
          <Input placeholder="请输入<$ data.label $>" />
        )}
      </FormItem>
    `,
    jsTemplate: '',
    cssTemplate: ''
  },
  {
    templateName: '表单',
    name: 'textarea',
    label: '多行',
    template: `
      <FormItem {...formItemLayout} label="<$ data.label $>：">
        {getFieldDecorator('<$ data.name $>', {
          initialValue: '<$ data.name $>',
          <% for item in data.rules %>
          rules: [{
            required: true, message: '请输入<$ item.errMsg $>',
          }],
          <% endfor %>
        })(
          <TextArea placeholder="请输入<$ data.label $>" />
        )}
      </FormItem>
    `,
    jsTemplate: '',
    cssTemplate: ''
  },
  {
    templateName: '表单',
    name: 'checkbox',
    label: '复选框',
    template: `<FormItem {...formItemLayout} label="<$ data.label $>：">
        {getFieldDecorator('<$ data.name $>', {
          initialValue: '<$ data.name $>',
          <% for item in data.rules %>
          rules: [{
            required: true, message: '请输入<$ item.errMsg $>',
          }],
          <% endfor %>
        })(
        <Checkbox >复选框</Checkbox>
        )}
      </FormItem>`,
    jsTemplate: '',
    cssTemplate: ''
  },
  {
    templateName: '表单',
    name: 'select',
    label: '下拉框',
    template: `<FormItem  label="<$ data.label $>：">
          <Select defaultValue="lucy" style={{ width: 120 }} >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
      </FormItem>`,
    jsTemplate: '',
    cssTemplate: ''
  }
];

function getFeildTemplate(str, data) {
  return nunjucks.renderString(str, { data: data });
}

var htmlTemplate = `
    <PageHeaderLayout title="页面模版编辑" content="用来编辑或创建页面模版">
      <Card bordered={false}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <$ getTemplate(data, componentList) $>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderLayout>
`;

var formFields = [
  {
    name: 'userName',
    label: '用户名',
    type: 'input'
  },
  {
    name: 'addr',
    label: '地址',
    type: 'textarea'
  },
  {
    name: 'sex',
    label: '性别',
    type: 'select'
  }
];

var data = {
  content: {
    title: '用户编辑',
    desc: '用来编辑或创建用户',
    isValid: true,
    validTipPos: '1',
    extraComponentData: [],
    fields: [
      {
        name: 'userName',
        label: '用户名',
        placeholder: '',
        type: 'input',
        defaultValue: '',
        rules: [
          {
            name: 'required',
            rule: '/.+/',
            success: '验证通过',
            errorMsg: '验证失败'
          },
          {
            name: 'email',
            rule:
              '/^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$/',
            success: '验证通过',
            errorMsg: '请输入email'
          }
        ]
      },
      {
        name: 'userName',
        label: '用户名',
        placeholder: '',
        type: 'input',
        defaultValue: '',
        rules: [
          {
            name: 'required',
            rule: '/.+/',
            success: '验证通过',
            errorMsg: '请选择性别'
          }
        ]
      }
    ],
    confirm: {
      text: '保存',
      before: `
          function(){
            alert('执行逻辑之前处理下')
          }
      `,
      cb: `
        function(){
          alert('执行逻辑比如保存数据')
        }
      `,
      after: `
        function(){
          alert('执行逻辑之后处理下')
        }
      `
    },
    cancel: {
      text: '取消',
      before: `
        alert('执行逻辑之前处理下')
      `,
      cb: `
        function(){
          alert('确认取消并返回')
        }
      `,
      after: `
        alert('执行逻辑之后处理下')
      `
    },
    customBtns: [
      {
        key: 'reset',
        text: '重置',
        before: `
          alert('执行逻辑之前处理下')
        `,
        cb: `
          alert('执行逻辑比如保存数据')
        `,
        after: `
          alert('执行逻辑之后处理下')
        `
      }
    ]
  }
};

function renderComponentByName(data) {
  let componentName = data.type;
  let component = getComponentByName(componentName);
  let template = nunjucks.renderString(component.template, { data: data });
  return template;
}

function getComponentByName(name) {
  let component = componentList.find(item => item.name == name);
  if (component) {
    return component;
  }

  console.error('没有此组件：', name);
  return {};
}

function getTemplate(formData, componentList) {
  var template = '';
  var appData = null;
  var pageData = null;
  var scaffoldData = null;
  var layoutData = null;
  var interData = null;
  var templateData = null;
  var componentData = null;
  var validData = null;

  formData.fields.forEach(itemData => {
    componentList.forEach(componentItem => {
      if (itemData.type == componentItem.name) {
        template += nunjucks.renderString(componentItem.htmlTemplate, {
          data: itemData
        });
      }
    });
  });
  return template;
}

// let template = getTemplate();
htmlTemplate = fs.readFileSync('./formTemplate.js').toString();
let template = nunjucks.renderString(htmlTemplate, {
  appData: null,
  pageData: data.content,
  scaffoldData: null,
  layoutData: null,
  interData: null,
  templateData: null,
  componentData: {
    components: componentList
  },
  validData: null,
  getFeildTemplate: getFeildTemplate,
  getTemplate: getTemplate,
  renderComponentByName: renderComponentByName
});

template = prettier.format(template, {
  semi: true,
  jsxBracketSameLine: true
});

fs.writeFileSync('./Preview.js', template);
