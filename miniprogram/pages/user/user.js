Page({
  data: {
    menus: [
      { name: '帮助中心' },
      { name: '咨询客服' },
      { name: '清除缓存' },
      { name: '推荐给朋友' },
      { name: '添加到我的小程序' },
      { name: '公众号如何接入签到' }
    ]
  },
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  onMenuTap(e) {
    const menuName = e.currentTarget.dataset.name;
    console.log('点击了菜单:', menuName);
    
    // 显示点击反馈
    wx.showToast({
      title: `点击了${menuName}`,
      icon: 'none',
      duration: 1500
    });
    
    // 根据菜单类型执行不同操作
    switch(menuName) {
      case '清除缓存':
        wx.showModal({
          title: '提示',
          content: '确定要清除缓存吗？',
          success: (res) => {
            if (res.confirm) {
              wx.clearStorage({
                success: () => {
                  wx.showToast({
                    title: '缓存已清除',
                    icon: 'success'
                  });
                }
              });
            }
          }
        });
        break;
      case '推荐给朋友':
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
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
