export default {
  title: 'Alex小新',
  description: '物有本末，事有终始',

  themeConfig: {

    // 中文配置
    darkModeSwitchLabel: '模式',
    outlineTitle: '快速导航',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    logo: 'https://store.fastposter.net/assets/happy-boy.png',
    footer: {
      message: '人生感悟',
      copyright: 'Copyright © 2019~2023 由vitepress强力驱动'
    },
    nav: [
      {text: '技术', link: '/skill/'},
      {text: '记录', link: '/record/'},
      {text: '创业', link: '/startup/'},
      {text: '文学', link: '/culture/'},
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tangweixin/blog.psoho.cn' },
    ],

    outline: [2,3],

    sidebar: {

      '/skill/': [
        {
          text: 'Linux',
          items: [
            {text: '常用命令', link: '/skill/linux/shell.md'},
            {text: '运维小技巧', link: '/skill/linux/operation-tips.md'},
          ]
        },
        {
          text: '前端',
          items: [
            {text: 'CSS布局', link: '/skill/frontend/flex.md'},
          ]
        },
      ],

      '/record/': [
        {
          text: '记录',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],

      '/startup/': [
        {
          text: '创业',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],

      '/culture/': [
        {
          text: '文学',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],
    },

  }
}
