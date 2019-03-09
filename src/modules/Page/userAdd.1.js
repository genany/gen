const userAdd = {
  id: 8,
  inter_app_id: 1,
  name: null,
  label: '用户添加',
  desc: null,
  cate_id: 1,
  method: 'POST',
  url: '/user/add',
  header: '{\n\n}',
  req: `/*
    ui|form|type:{
        title: blog
        submitBtn: {
            label: 提交
            click: () => {}
        }

    }
*/
{
  /*
  type: array
  required: true
  */
    arr: [
      /*
      type: object

      required: true
      */
      {
      /*
      type: string
      required: true
      */
        a: 111,
        b: 333
      },
      {
        a:5555,
        b: 6666
      }
    ]
    /*
        type: string
        alias: user_name
        required: true

        valid: [
            {
              required: true, message: '请输入姓名', whitespace: true
            },
        ]

        ui|input: {
            placeholder: 请输入姓名
            label: 姓名
            value: 默认值
            disabled: true
            prefix: <Icon type="user" />
            size: large
        }
        ui|input|textarea: {
            placeholder: 请输入姓名
            label: 姓名
            value: 默认值
            disabled: true
            prefix: <Icon type="user" />
            size: large
        }
        sql: {
            type: varchar
            length: 255
            isNull: true
            isPrimary: true
        }
        go: {

        }
    */
    name: daycool
    /*
        type: string
        required: true
        valid: [
            { required: true, message: '请输入姓名', whitespace: true },
        ]
        ui|input: {
            placeholder: 请输入邮箱
            label: 邮箱
            value: qmw920@163.com
            size: small
        }
        sql: {
            type: varchar
            length: 255
            isNull: true
            isPrimary: true
        }
        go: {

        }
    */
    password: 123456
    confirmPassword: 123456
    /*
        type: number
        required: true
        enum: [
            {
              label: 女, value: 0
            }
            {
              label: 男, value: 1
            }
        ],
    */
    sex: 1
    /*
        type: string
        required: true
        enum: [
          运行中, 关闭, 暂停
        ]
    */
    status: 运行中
    /*
        type: string
        required: true
        ui|Cascader: {
            data: [
                {
                    label: 河北省
                    value: hebei
                    children: [
                        {
                            label: 保定市
                            value: baoding
                            children: [
                                {
                                    label: 定州市
                                    value: dingzhou
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    */
    addr: 河北省保定市定州市
    /*
        type: string
        required: true
        ui|Cascader: {
            ajax: {
                url: /city/get

            }
        }

    */
    currAddr: 北京市朝阳区姚家园
    /*
        data: 有效吗
        type: object
        required: true
    */
    data:
    {
        /*
            type: string
            required: true
        */
        title: '发了个帖子'
        time: '20181026'
        info: {
             /*
                type: string
                required: true
            */
            a: 234
            b: 555
        }
        /*
            type: array
            required: true
        */
        array: [
          /*
            type: object
            required: true
        */
          { api: 123, url: '/xxx/ggg' }
        ]
    }


}`,
  res_header: '{\n\n}',
  res:
    "{\n    code: 200,\n    msg: '',\n    data: {\n        /* \n            type: string\n            required: true\n        */\n        id: 123456\n    }\n}",
  user_id: 1,
  source: null,
  created_at: '2018-10-25 11:58:26',
  updated_at: '2018-10-25 12:13:53'
};

export default userAdd;
