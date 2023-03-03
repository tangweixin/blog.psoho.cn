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
      {text: '文学', link: '/culture/'},
      {text: '技术', link: '/skill/'},
      {text: '创业', link: '/startup/'},
    ],
    sidebar: {
      '/culture/': [
        {
          text: '文学',
          items: [
            {text: '简介', link: '/startup/index.md'},
          ]
        },
      ],

      '/skill/': [
        {
          text: 'Linux',
          items: [
            {text: 'Linux', link: '/skill/linux/index.md'},
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
      ]
    },


  }
}
