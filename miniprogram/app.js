// 小程序全局逻辑
App({
  globalData: {
    apiBase: 'http://localhost:3000/api',
    userInfo: null
  },
  onLaunch() {
    // 本地存储获取用户信息
    const user = wx.getStorageSync('user')
    if (user) this.globalData.userInfo = user
  }
})