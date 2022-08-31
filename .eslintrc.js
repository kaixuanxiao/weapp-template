module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    impliedStrict: true,
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getCurrentPages: true,
  },
  rules: {
    'prettier/prettier': 0,
    'no-var': 2, // http://eslint.org/docs/rules/no-var
    'one-var': 0, // 禁止连续声明
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量 http://eslint.org/docs/rules/prefer-const
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false,
      },
    ], // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
    'new-parens': 2, // new时必须加小括号
    'no-use-before-define': 2, // 先声明再使用 http://eslint.org/docs/rules/no-use-before-define
    'no-array-constructor': 2, // 禁止使用数组构造器
    'no-caller': 2, // 禁止使用arguments.caller或arguments.callee
    'no-empty-character-class': 0, // 正则表达式中的[]内容不能为空
    'no-empty-pattern': 0,
    'no-eval': 0, // 禁止使用eval
    'no-extend-native': 2, // 禁止扩展native对象
    'no-extra-bind': 2, // 禁止不必要的函数绑定
    'no-extra-parens': [2, 'functions'], // 禁止非必要的括号
    'no-floating-decimal': 2, // 禁止省略浮点数中的0 .5 3.
    'no-implied-eval': 2, // 禁止使用隐式eval
    'no-label-var': 2, // label名不能与var声明的变量名相同
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-multi-spaces': 2, // 不能用多余的空格
    'no-multi-str': 2, // 禁止使用多行字符串
    'no-multiple-empty-lines': [
      2,
      {
        max: 2,
      },
    ], // 空行最多不能超过2行
    'no-new-object': 2, // 禁止使用new Object()
    'no-new-require': 2, // 禁止使用new require
    'no-new-wrappers': 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-obj-calls': 0, // 不能调用内置的全局对象，比如Math() JSON()
    'no-return-assign': [2, 'except-parens'], // return 语句中不能有赋值表达式
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-sparse-arrays': 0, // 禁止稀疏数组， [1,,2]
    'no-trailing-spaces': 2, // 一行结束后面不要有空格
    'no-unexpected-multiline': 0, // 避免多行表达式
    'no-unmodified-loop-condition': 0, // 检查引用是否在循环中被修改
    'no-unneeded-ternary': 2, // 禁止不必要的三元表达式 var isYes = answer === 1 ? true : false;
    'no-unsafe-finally': 0, // 禁止在 finally 语句块中出现控制流语句
    'no-useless-call': 2, // 禁止不必要的call和apply
    'no-useless-computed-key': 0, // 禁止在对象中使用不必要的计算属性
    'no-useless-constructor': 2, // 可以在不改变类的工作方式的情况下安全地移除的类构造函数
    'no-whitespace-before-property': 0,

    // styles
    'accessor-pairs': 2, // 强制 getter 和 setter 在对象中成对出现
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ], // 强制箭头函数的箭头前后使用一致的空格
    'block-spacing': [2, 'always'], // 禁止或强制在代码块中开括号前和闭括号后有空格 （要求使用一个或多个空格）
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true,
      },
    ], // if while function 后面的{必须与if在同一行，java风格。
    camelcase: [
      2,
      {
        properties: 'always',
      },
    ], // 强制驼峰法命名
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    'comma-dangle': [2, 'always-multiline'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ], // 控制逗号前后的空格
    'comma-style': [2, 'last'], // 控制逗号在行尾出现还是在行首出现
    'dot-location': [2, 'property'],
    'eol-last': 2, // 文件末尾强制换行
    eqeqeq: [1, 'allow-null'], // 使用 === 替代 ==
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ], // 缩进风格
    'jsx-quotes': [2, 'prefer-single'], // JSX 属性中一致使用双引号或单引号
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ], // 对象字面量中冒号的前后空格
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ], // 强制在关键字前后使用一致的空格
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ], // 换行时运算符在行尾还是行首
    'padded-blocks': 0, // 块语句内行首行尾是否要空行
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ], // 强制使用一致的反勾号、双引号或单引号
    semi: [2, 'never'], // 语句强制分号结尾
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ], // 分号前后空格
    'space-before-blocks': [2, 'always'], // 不以新行开始的块{前面要不要有空格
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ], // 函数定义时括号前面要不要有空格
    'space-in-parens': [2, 'never'], // 小括号里面要不要有空格
    'space-infix-ops': 2, // 中缀操作符周围要不要有空格
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ], // 一元运算符的前/后要不要加空格
    'spaced-comment': [2, 'always'], // 强制在注释中 // 或 /* 使用一致的空格
    'template-curly-spacing': [2, 'never'], // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    yoda: [2, 'never'], // 禁止尤达条件
    'object-curly-spacing': [2, 'always'], // 大括号内是否允许不必要的空格
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
