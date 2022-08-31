weapp-template

## 项目信息
### 相关负责人
| 内容 | 负责人 |
| --- | --- |
| 前端 | xxx |
| 后端 | xxx |
| 微信开放平台管理员 | xxx |
| 产品经理 | xxx |
| 设计师 | xxx |

### 其他信息
- 需求文档：[https://xxx.yyy.com](https://xxx.yyy.com)
- 设计文档：[https://xxx.yyy.com](https://xxx.yyy.com)
- 接口文档：[https://xxx.yyy.com](https://xxx.yyy.com)

## 注意事项
### 小程序SDK最低版本
使用 `2.5.0`| `2.6.0`| `2.7.0`| `2.9.2` ?

本模板基本兼容最低版本 `2.5.0` 。

### 组件库使用
优先使用`WeUI`组件库，其次使用`vant`组件库。vant组件库目前设置了不打包一些不太常用的组件，如果需要使用，请在project.config.json中去除。

### Behavior的使用
推荐使用 `Behavior` 来实现组件或者页面之间的代码复用。

但是如果要在 `Page` 中使用 `Behavior` ，小程序SDK版本需要不低于 `2.9.2` 。好在我们可以使用 `Component` 代替 `Page` ，以达到在较低版本可以使用Behavior的目的，使用时与 `Page` 的不同点仅仅在于生命同期函数需要写到 `lifetimes` 中，方法写到 `methods` 中。[相关文档请查看这个链接](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html)

使用示例请查看各个demo页面。

### computed 计算属性的使用
可以在计算属性页面查看示例，更多用法查看 [https://www.npmjs.com/package/miniprogram-computed](https://www.npmjs.com/package/miniprogram-computed)

### store的使用

#### store的创建
```javascript
// createStore会自动把其中的方法转为mobx的action
import createStore from '../utils/createStore'
export default createStore({
  propName: 'default value',
  actionName() {
    // action content
  },
})
```
#### store的使用
通过 `createStoreBehavior` 来将 `store` 注入到组件或者页面中。基本使用方法：
```javascript
// 简易版本
Component({
  behaviors: [createStoreBehavior(userStore)],
})

// 也可以将createStoreBehavior这一步放到单独的文件中。
const userStoreBehavior = createStoreBehavior(userStore)
Component({
  behaviors: [userStoreBehavior],
})

// 防止多个store命名冲突及明确指明数据来源时
Component({
  behaviors[
    createStoreBehavior(userStore, { key: 'user' }),
    createStoreBehavior(orderStore, { key: 'order' }),
  ],
})
// wxml中
// <text>{{user.id}}</text>
// <text>{{order.id}}</text>

// 当需要考虑性能优化时，未列出的属性或者action不会被注入
// 因为deep为false，propsA中的某个属性变化了是不会更新的
Component({
  behaviors: [
    createStoreBehavior(userStore, {
      props: ['propsA'],
      actions: ['actionA'],
      deep: false,
    })
  ],
})
```

另外，注入的 `store` 建议只提供给 `wxml` 文件使用。在 `js` 文件中依然通过 `import` 引入具体的 `store` 对象的方式来使用。如：
```javascript
import userStore from '../../store/userStore'
Component({
  methods: {
    someMethod() {
      console.log(userStore.isLogin)
      userStore.someAction()
    },
  },
})
```

#### 监听store变化
```javascript
import { autorun, reaction, toJS } from 'mobx-miniprogram'
import disposeBehavior from '../../behaviors/disposeBehavior'
Component({
  // disposeBehavior最后会自动调用disposes数组中的dispose函数并清除掉
  behaviors: [disposeBehavior],
  lifetimes: {
    attached() {
      // 使用autorun，会立即执行一次（相当于immediator）并自动收集依赖
      this.disposes.push(autorun(() => {
        if (userStore.isLogin) {
          // TODO
        }
      }))
      // 使用reaction
      this.disposes.push(reaction(
        () => userStore.isLogin,
        (isLogin) => {
          // TODO
        }
      ))
      // 使用reaction进行深度监听
      this.disposes.push(reaction(
        () => toJs(userStore.userInfo),
        (userInfo) => {
          // TODO
        },
      ))
    },
  },
})
```

## 目录说明
```
├── app.js          // 入口文件
├── app.json
├── app.wxss
├── behaviors       // behaviors
├── common          // 业务相关公共逻辑，包括常量等
├── components      // 组件库
│   ├── stateful    // 有状态组件 
│   └── ...         // 其他公共组件 
├── docs            // 文档目录
├── images          // 图片文件
├── miniprogram_npm // 构建npm生成的文件目录
├── models          // 数据模型层，数据结构定义
├── packages        // 子包目录
├── pages           // 主包页面
├── service         // 网络请求、API接口相关
├── store          // 全局状态管理
├── styles          // 公共样式文件
└── utils           // 工具文件（业务无关）
├── package.json
├── project.config.json
├── README.md
```

## 命名规范
### 目录及文件名
|  规范 | 目录 | 文件 |
| --- | --- | --- |
| camelCase | --- | 一般js文件 |
| kebab-case | 一般目录名 | 页面文件some-page.wxml, 资源文件(some-icon.png, element-ui.wxss, ...) |

### 其他命名
查看前端命名规范

## 开发环境配置
如果使用`vscode`编码，支持微信相关API提示。
### 全局依赖
```bash
npm i -g eslint prettier
```

vscode插件：<br/>
`ESLint` 代码检查提醒<br/>
`Prettier` 代码格式化（可设置保存自动格式化）<br/>

## 项目测试账号
| 环境 | 账号 | 密码 |
| ---- | ---- | ---- |
| 开发 | xxx | xxx |
| 测试 | xxx | xxx |
