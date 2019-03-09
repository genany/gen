import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card } from 'antd';

@connect(({ user, loading }) => ({
  user
}))
@Form.create()
export default class About extends PureComponent {
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {
    //默认登录
    if (this.props.user.userInfo.name !== 'ok') {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          user_name: 'yanshi',
          user_pass: '123456',
          type: 'account'
        }
      });
    }
  }

  render() {
    return (
      <Card bordered={false}>
        <div className="preview markdown-body">
          <p>
            如果您对此项目感兴趣欢迎{' '}
            <a href="https://github.com/daycool/gen">star</a>
            ，如果您对有问题和建议欢迎{' '}
            <a href="https://github.com/daycool/gen/issues/new">issues</a>
          </p>
          <h1>通过接口生成一切</h1>
          <p>
            我们程序员每天都跟代码打交道，前端程序员coding, 后端程序员coding。
            <br />
            然而我们经常做重复性工作或者复制粘贴，或者前后端因为接口变动扯皮。
            <br />
            为了解决这些问题我打算通过接口生成代码。
          </p>
          <h2>为什么通过接口生成一切</h2>
          <h3>任何语言都是在跟数据打交道</h3>
          <ol>
            <li>在web前端html用来展现数据，javascript处理数据</li>
            <li>
              go、java、php、nodejs等后端语言都在处理适合前端和数据库的数据
            </li>
            <li>mysql、oracle、mongodb、postsql等数据库用来存储数据</li>
          </ol>
          <h3>接口是前后端通讯的桥梁</h3>
          <h3>接口可以约定json格式</h3>
          <ol>
            <li>json易于人阅读和编写</li>
            <li>json易于机器解析和生成</li>
            <li>
              基于json可以生成页面中的表单，后端语言中的实体类，数据库中的表
            </li>
          </ol>
          <h2>我理想的目标</h2>
          <ol>
            <li>根据接口一键生成一套前可运行后端接口方案</li>
            <li>不改变我的开发方式</li>
            <li>低门槛轻松上手</li>
            <li>可视化配置</li>
            <li>如果是web页面所见即所得</li>
            <li>有丰富的项目脚手架方便二次开发</li>
            <li>生成接口文档</li>
          </ol>
          <h2>如何实现这些目标</h2>
          <ol>
            <li>
              我们把每个文件都看做一个大模版，而这个大模版又有多个小模版组成，小模版我们把它叫做组件，组件又有组件属性，这样就组成了一个component
              tree，而接口本省又是个data tree,
              两者渲染成最终我们想要的文件，这里模版引擎我们用了unjuncks
            </li>
            <li>
              接口使用hjson我通过注释表明这个字段对应的组件类型mock数据。
              <br />>
              hjson和jsonSchema相互转换，这样我就可以使用jsonSchema进行可视化配置
            </li>
            <li>通过jsonSchema配置字段对应的组件和定制组件扩展信息</li>
            <li>
              配置完即可动态渲染实时得到渲染结果,
              如果是web页面我们可以iframe在区块内实时预览
            </li>
            <li>定制可服用模版和组件， 这样我们就可以定制各种页面</li>
            <li>
              通过把组件生成可动态配置的组件文件，然后把配置组件属性通过postMessage传递给iframe页进行实时修改
            </li>
            <li>
              把我们最佳项目实践直接做为脚手架，通用的文件设置为模版，或分隔多个小组件
            </li>
          </ol>
          <h2>在线运行太慢，或者网上代码不安全</h2>
          <ol>
            <li>
              使用electon辅助工具，直接把渲染结果输出到本地预览,
              同时调用git命令保存修改文件，方便查看修改记录或回滚
            </li>
          </ol>
          <h2>演示</h2>
          <p>
            <img src="http://gen.sdemo.cn/gen.gif" alt="扩展字段" />
          </p>
        </div>
      </Card>
    );
  }
}
