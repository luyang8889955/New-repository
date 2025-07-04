Page({
  data: {
    tabs: [
      { name: '我创建的' },
      { name: '我管理的' },
      { name: '我签到的' }
    ],
    currentTab: 0
  },
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.index });
  }
})
