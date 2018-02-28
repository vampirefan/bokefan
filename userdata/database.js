/* DO NOT CHANGE THE GLOBAL VARIABLE NAME */

window.VUELOG_DATABASE = {
  config: {
    // The name of your site, will be displayed in browser tab and site header.
    brand: {
      'en-US': 'Vampirefan\'s Harbor',
      'zh-CN': '弯排帆之港',
    },

    // Put the site brand behind current page in `document.title`.
    brandTrailing: false,

    // The image displayed in site header right beside the brand.
    logo: './static/logo.png',

    // Path to the domain root that serves your site, starts and ends with slash (`/`).
    // Set to `'/'` if your site is under domain root.
    base: '/',

    // The path to route to when you visit `/`.
    // Set to `/home`, `/blog` or a valid path at your need.
    homePath: '/blog',

    // Whether footer is visible on `homePath` or not.
    homeFooter: true,

    // Vuelog interface language. Currently only support 'zh-CN' and 'en-US'.
    defaultLang: 'zh-CN',

    // Allow/disallow visitors to switch interface language.
    switchLang: false,

    // Available languages for switching. Must be a subset of supported languages, or leave empty.
    selectedLangs: [],

    // Number of posts listed in a blog/category view.
    postsCount: 6,

    // Fill in the shortname to integrate Disqus with your blog.
    disqusShortname: 'vampirefanblog',

    // Fill in the uid to integrate LiveRe with your blog.
    livereUid: '',

    // Options for marked, see https://github.com/chjj/marked#options-1 for detail
    markedOptions: {}
  },

  navigation: [
    {
      label: '平淡生活',
      type: 'category',
      path: '/blog/life'
    },
    {
      label: '大学拾光',
      type: 'category',
      path: '/blog/college'
    },
    {
      label: '归档',
      type: 'archive',
      path: '/archive'
    },
    {
      label: '关于',
      type: 'page',
      path: '/page/about'
    },
    {
      label: '链接',
      type: 'dropdown',
      path: '', // (OPTIONAL) dropdown can be routable too if you set a valid route path
      children: [
        {
          label: 'GitHub',
          type: 'outgoing',
          link: 'https://github.com/vampirefan'
        }
      ]
    }
  ],

  pages: [
    {
      title: '关于这个地方',
      slug: 'about',
      exclude: false, // (OPTIONAL) `true` to exclude the page from archive view
      titleless: false, // (OPTIONAL) `true` to hide the title in page view
      commentless: false, // (OPTIONAL) `true` to disable comments for the page
      draft: false // (OPTIONAL) `true` to make the page temporarily inaccessible
    }
  ],

  categories: [
    {
      title: '大学拾光',
      slug: 'college'
    },
    {
      title: '平淡生活',
      slug: 'life'
    }
  ],

  posts: [
    /* 2018 */
    {
      title: '为了生活',
      slug: '2018-02-12-to-live',
      category: 'life',
      date: '2018-02-12'
    },
    /* 2013 */
    {
      title: '什么是快乐',
      slug: '2013-01-13-about-happiness',
      category: 'college',
      date: '2013-01-13'
    },
    {
      title: '又是雨天',
      slug: '2013-01-31-hate-rainning',
      category: 'college',
      date: '2013-01-31'
    },
    {
      title: '旅途',
      slug: '2013-04-28-on-the-road',
      category: 'college',
      date: '2013-04-28'
    },
    /* 2012 */
    {
      title: 'Another New Year',
      slug: '2012-01-22-another-new-year',
      category: 'college',
      date: '2012-01-22'
    }, {
      title: 'Dragon New Year',
      slug: '2012-02-01-dragon-new-year',
      category: 'college',
      date: '2012-02-01'
    }, {
      title: '你说 因为我哭 阴雨才连绵',
      slug: '2012-03-06-another-sad-happiness',
      category: 'college',
      date: '2012-03-06'
    }, {
      title: 'Life, Always to Be Continued',
      slug: '2012-05-12-life-always-to-be-continued',
      category: 'college',
      date: '2012-05-12'
    }, {
      title: '生活心情',
      slug: '2012-06-07-think-about-life',
      category: 'college',
      date: '2012-06-07'
    }, {
      title: 'Happy birthday to you, my love-Guagua',
      slug: '2012-07-22-happy-birthday-to-youmy-love-guagua',
      category: 'college',
      date: '2012-07-22'
    }, {
      title: '厌遥遥无期的感觉，恋归期不远的悸动',
      slug: '2012-09-09-what-a-day',
      category: 'college',
      date: '2012-09-09'
    }, {
      title: 'About Macbook Pro',
      slug: '2012-09-13-about-macbook-pro',
      category: 'college',
      date: '2012-09-13'
    }, {
      title: '不拖沓',
      slug: '2012-09-18-be-efficient',
      category: 'college',
      date: '2012-09-18'
    }, {
      title: 'Hacker~ Howto',
      slug: '2012-09-19-hacker-howto',
      category: 'college',
      date: '2012-09-19'
    }, {
      title: 'Borderlands',
      slug: '2012-09-21-borderlands',
      category: 'college',
      date: '2012-09-21'
    }, {
      title: 'Back to Work',
      slug: '2012-10-07-back-to-work',
      category: 'college',
      date: '2012-10-07'
    }, {
      title: 'So Call Me',
      slug: '2012-10-10-so-call-me',
      category: 'college',
      date: '2012-10-10'
    }, {
      title: '关注内容',
      slug: '2012-10-15-content-oriented',
      category: 'college',
      date: '2012-10-15'
    }, {
      title: 'Persentation with Browser',
      slug: '2012-10-20-presentation-with-browser',
      category: 'college',
      date: '2012-10-20'
    }, {
      title: '将来的打算',
      slug: '2012-11-09-a-plan-to-the-future',
      category: 'college',
      date: '2012-11-09'
    }, {
      title: '自信的生活',
      slug: '2012-11-23-be-confident',
      category: 'college',
      date: '2012-11-23'
    }, {
      title: 'Happy New Year',
      slug: '2012-12-30-happy-new-year',
      category: 'college',
      date: '2012-12-30'
    },
    /* 2011 */
    {
      title: '开学第四周了',
      slug: '2011-03-17-four-weeks',
      category: 'college',
      date: '2011-03-17'
    },
    {
      title: 'Happy birthday to me!',
      slug: '2011-12-23-happy-birthday-to-me',
      category: 'college',
      date: '2011-12-23'
    },
    {
      title: '瓜瓜最讨厌了',
      slug: '2011-12-22-sad-happiness',
      category: 'college',
      date: '2011-12-22'
    },
    {
      title: 'Bla Bla Bla',
      slug: '2011-10-21-la-la-la',
      category: 'college',
      date: '2011-10-21'
    },
    {
      title: '流水账',
      slug: '2011-10-17-what-a-day',
      category: 'college',
      date: '2011-10-17'
    },
    {
      title: '随笔',
      slug: '2011-10-15-sui-bi',
      category: 'college',
      date: '2011-10-15'
    },
    {
      title: 'First Stage',
      slug: '2011-10-13-first-stage',
      category: 'college',
      date: '2011-10-13'
    },
    {
      title: '呱呱',
      slug: '2011-05-09-gu-gu',
      category: 'college',
      date: '2011-05-09'
    },
    {
      title: '牛仔裤',
      slug: '2011-03-28-jeans',
      category: 'college',
      date: '2011-03-28'
    },
    {
      title: 'Be Happy',
      slug: '2011-03-22-be-happy',
      category: 'college',
      date: '2011-03-22'
    },
    {
      title: '嗯嗯',
      slug: '2011-03-19-ng-ng',
      category: 'college',
      date: '2011-03-19'
    },
    {
      title: 'The End Of the Weekend',
      slug: '2011-03-06-the-end-of-the-weekend',
      category: 'college',
      date: '2011-03-06'
    },
    {
      title: 'The Phone',
      slug: '2011-03-04-the-phone',
      category: 'college',
      date: '2011-03-04'
    },
    {
      title: 'Keep Fit',
      slug: '2011-02-28-keep-fit',
      category: 'college',
      date: '2011-02-28'
    },
    {
      title: '本科最后一个学期开学啦',
      slug: '2011-02-23-last-term-on-undergraduate',
      category: 'college',
      date: '2011-02-23'
    },
    {
      title: 'Young For You',
      slug: '2011-02-14-young-for-you',
      category: 'college',
      date: '2011-02-14'
    },
    {
      title: 'The New Year',
      slug: '2011-01-31-the-new-year',
      category: 'college',
      date: '2011-01-31'
    }
  ]
}
