import React, { PureComponent } from "react"
import { connect } from "dva"
import { routerRedux } from "dva/router"
import {
  message,
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
} from "antd"
import PageHeaderLayout from "../../layouts/PageHeaderLayout"
import styles from "./preview.less"

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

@connect(({ valid, loading }) => ({
  valid: valid,
  submitting: loading.effects["valid/add"]
}))
@Form.create()
export default class BasicForms extends PureComponent {
  componentDidMount() {
    let id = 123
    if (id) {
      this.props.dispatch({
        type: "valid/info",
        payload: {
          id: id
        }
      })
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "valid/add",
          payload: values,
          callback: () => {
            message.success("����ɹ�")

            this.props.dispatch(routerRedux.push("/valid/list"))
          }
        })
      }
    })
  }
  render() {
    const { valid: { info }, submitting } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    }

    return (
      <PageHeaderLayout title="用户编辑" content="用来编辑或创建用户">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="用户名：">
              {getFieldDecorator("userName", {
                initialValue: "userName",

                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ],

                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ]
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="用户名：">
              {getFieldDecorator("userName", {
                initialValue: "userName",

                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ]
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                ����
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
