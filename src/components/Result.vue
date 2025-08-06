<template>
  <div class="result-container">
    <h2>抽奖结果</h2>
    <div v-if="winningPrize" class="prize-info">
      <div class="user-info">
        <p><strong>用户手机号：</strong>{{ userPhone }}</p>
      </div>
      <div v-if="winningPrize.name === '谢谢参与'">
        <p class="prize-name">{{ winningPrize.name }}</p>
      </div>
      <div v-else>
        <p>恭喜您获得奖品：</p>
        <div class="prize-display">
          <img 
            :src="prizeImage" 
            :alt="winningPrize.name"
            class="prize-image"
            @error="onImageError"
          />
          <p class="prize-name">{{ winningPrize.name }}</p>
        </div>
      </div>
    </div>
    <div v-else class="no-prize">
      <p>您尚未抽奖，请返回抽奖页面。</p>
      <button @click="goToLottery">去抽奖</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultDisplay',
  computed: {
    winningPrize() {
      return this.$store.state.winningPrize || JSON.parse(localStorage.getItem(`winningPrize_${this.$store.state.user.phone}`))
    },
    userPhone() {
      return this.$store.state.user?.phone || '未登录'
    },
    prizeImage() {
      if (!this.winningPrize?.name) return ''
      try {
        return require(`@/assets/${this.winningPrize.name}.jpg`)
      } catch (error) {
        return require('@/assets/logo.png') // 默认图片
      }
    }
  },
  methods: { 
    goToLottery() { 
      this.$router.push('/lottery') 
    },
    onImageError(event) {
      event.target.src = require('@/assets/logo.png')
    }
  }
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.result-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
}

h2 {
  color: #2c3e50;
  font-size: 36px;
  margin-bottom: 40px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
  animation: fadeInDown 0.8s ease-out;
}

.user-info {
  margin-bottom: 30px;
  padding: 20px 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.user-info p {
  margin: 0;
  font-size: 18px;
  color: #34495e;
  font-weight: 500;
}

.user-info strong {
  color: #2c3e50;
  font-weight: 700;
}

.prize-info {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.prize-info > p {
  color: #34495e;
  font-size: 20px;
  margin-bottom: 25px;
  font-weight: 500;
}

.prize-display {
  margin: 30px 0;
  animation: bounceIn 1s ease-out 0.6s both;
}

.prize-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 0 3px rgba(52, 152, 219, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid #f8f9fa;
}

.prize-image:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.2),
    0 0 0 3px rgba(52, 152, 219, 0.2);
}

.prize-name {
  font-size: 32px;
  font-weight: bold;
  color: #e74c3c;
  margin: 15px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

.no-prize {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

.no-prize p {
  font-size: 20px;
  color: #34495e;
  margin-bottom: 30px;
  font-weight: 500;
}

button {
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

button:hover::before {
  left: 100%;
}

button:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* 动画效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-180deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) rotate(-5deg);
  }
  70% {
    transform: scale(0.9) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .result-container {
    padding: 15px;
  }
  
  h2 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .prize-image {
    width: 200px;
    height: 200px;
  }
  
  .prize-name {
    font-size: 24px;
  }
  
  .user-info {
    padding: 15px 20px;
    margin-bottom: 20px;
  }
  
  .no-prize {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .prize-image {
    width: 180px;
    height: 180px;
  }
  
  .prize-name {
    font-size: 22px;
  }
}
</style>