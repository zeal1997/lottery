import { createStore } from 'vuex'

export default createStore({  
  state: {
    user: null,
    prizes: [
      { id: 1, name: '360话费', count: 5, probability: 5 },
      { id: 2, name: '咖啡券', count: 100, probability: 15 },
      { id: 3, name: '充电宝', count: 30, probability: 10 },
      { id: 4, name: '卡套插线板', count: 50, probability: 10 }, 
      { id: 5, name: '网红小夜灯', count: 50, probability: 10 },
      { id: 6, name: '小风扇', count: 80, probability: 15 },
      { id: 7, name: '泡面碗', count: 30, probability: 10 },
      { id: 8, name: '轻奢水杯', count: 50, probability: 10 },
      { id: 9, name: '炫彩雨伞', count: 50, probability: 15 },
      { id: 10, name:'谢谢参与',count: 2500 ,probability: 100 }
    ],
    hasDrawn: false,
    winningPrize: null
  },
  mutations: {
    setUser(state, user) { state.user = user },
    setHasDrawn(state, status) { state.hasDrawn = status },
    setWinningPrize(state, prize) { state.winningPrize = prize },
    decreasePrizeCount(state, prizeId) {
      const prize = state.prizes.find(p => p.id === prizeId)
      if (prize && prize.count > 0) prize.count--
    }
  },
  actions: {
    // 登录验证 - 现在使用后端API
    async login({ commit }, { phone, password }) {
      try {
        const response = await fetch('http://124.223.168.21:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone, password })
        })
        
        const data = await response.json()
        
        if (data.success) {
          commit('setUser', data.user)
          commit('setHasDrawn', data.user.hasDrawn)
          return true
        }
        return false
      } catch (error) {
        console.error('登录错误:', error)
        return false
      }
    },
    
    // 抽奖逻辑
    async drawPrize({ state, commit }) {
      if (state.hasDrawn) return null
    
      // 计算所有可用奖品（包括谢谢参与）
      const availablePrizes = state.prizes.filter(p => p.count > 0)
      
      if (availablePrizes.length === 0) return null
      
      // 计算总权重 - 改为基于count而非probability
      const totalWeight = availablePrizes.reduce((sum, p) => sum + p.count, 0)
      
      let winningPrize = null
      const random = Math.random() * totalWeight
      let cumulativeWeight = 0
      
      // 根据count权重选择奖品
      for (const prize of availablePrizes) {
        cumulativeWeight += prize.count  // 改为使用count作为权重
        if (random <= cumulativeWeight) {
          winningPrize = prize
          break
        }
      }
    
      if (winningPrize) {
        // 只有非谢谢参与的奖品才减少数量
        commit('decreasePrizeCount', winningPrize.id)
        commit('setWinningPrize', winningPrize)
        commit('setHasDrawn', true)
        
        // 保存到数据库
        try {
          await fetch('http://124.223.168.21:3001/api/update-draw-result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone: state.user.phone, // 添加用户手机号
              winningPrize: {
                id: winningPrize.id,
                count: winningPrize.count,
                name: winningPrize.name,
                timestamp: new Date().toISOString()
              }
            })
          })
        } catch (error) {
          console.error('保存抽奖结果失败:', error)
        }
      }
      
      return winningPrize
    }
  }
})