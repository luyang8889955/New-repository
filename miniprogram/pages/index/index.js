Page({
  data: {
    buttons: [
      { name: '临时签到', icon: '/images/temp.png', desc: '签到一次有效', bgColor: '#2ea7ff' },
      { name: '长期签到', icon: '/images/long.png', desc: '每日多区间签到', bgColor: '#1ec6b6' },
      { name: '自由签到', icon: '/images/free.png', desc: '不限次数签到', bgColor: '#7c4dff' },
      { name: '考勤签到', icon: '/images/kaoqin.png', desc: '每日多区间签到', bgColor: '#ff4081' },
      { name: '名单签到', icon: '/images/list.png', desc: '设置白名单签到', bgColor: '#a67c52' },
      { name: '图文签到', icon: '/images/pictext.png', desc: '图片文字打卡签到', bgColor: '#0066cc' },
      { name: '登记预约', icon: '/images/appoint.png', desc: '快捷登记预约', bgColor: '#8e24aa' },
      { name: '报名工具', icon: '/images/signup.png', desc: '快捷扫码报名', bgColor: '#a67c52' }
    ]
  },
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  onButtonTap(e) {
    const buttonName = e.currentTarget.dataset.name;
    console.log('点击了按钮:', buttonName);
    
    // 显示点击反馈
    wx.showToast({
      title: `点击了${buttonName}`,
      icon: 'none',
      duration: 1500
    });
    
    // 根据按钮类型跳转到不同页面
    switch(buttonName) {
      case '临时签到':
      case '长期签到':
      case '自由签到':
      case '考勤签到':
      case '名单签到':
      case '图文签到':
        // 跳转到签到列表页面
        wx.switchTab({
          url: '/pages/list/list'
        });
        break;
      case '登记预约':
      case '报名工具':
        // 跳转到用户中心页面
        wx.switchTab({
          url: '/pages/user/user'
        });
        break;
      default:
        wx.showToast({
          title: '功能开发中...',
          icon: 'none'
        });
    }
  }
})
