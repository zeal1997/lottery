<template>
  <div class="login-page">
    <div class="login-container">
      <h2>mobile校园回馈</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>手机号：</label>
          <input 
            type="text" 
            v-model="phone" 
            placeholder="请输入你申请的手机号"
            pattern="^1[3-9]\d{9}$"
            required
          >
        </div>
        <div class="form-group">
          <label>密码：</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="默认密码为手机号后六位"
            pattern="^\d{6}$"
            required
          >
        </div>
        <button type="submit" class="login-btn">登录</button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() { return { phone: '', password: '', error: '' }},
  methods: {
    async handleLogin() {
      // 前端验证
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        this.error = '请输入有效的手机号'
        return
      }
      if (this.password !== this.phone.slice(-6)) {
        this.error = '密码必须是手机号后六位'
        return
      }

      try {
        const response = await fetch('http://124.223.168.21:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: this.phone, password: this.password })
        })
        
        const data = await response.json()
        
        if (data.success) {
          this.$store.commit('setUser', data.user)
          this.$store.commit('setHasDrawn', data.user.hasDrawn)
          if (data.user.winningPrize) {
            this.$store.commit('setWinningPrize', data.user.winningPrize)
          }
          this.$router.push(data.user.hasDrawn ? '/result' : '/lottery')
        } else {
          this.error = data.error
        }
      } catch (error) {
        this.error = '网络错误，请稍后重试'
        console.error('登录错误:', error)
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/gift.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  /* 添加渐变背景作为备用 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%), url('@/assets/gift.png');
  background-blend-mode: overlay;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  margin: 20px;
  padding: 50px 40px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h2 {
  color: #2c3e50;
  margin-bottom: 40px;
  font-weight: 700;
  font-size: 28px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e8f4f8;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  transform: translateY(-2px);
}

input:hover {
  border-color: #bdc3c7;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  margin-top: 10px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
}

.error-message {
  color: #e74c3c;
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    margin: 10px;
    padding: 30px 25px;
    border-radius: 15px;
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  input {
    padding: 14px 16px;
    font-size: 16px;
  }
  
  .login-btn {
    padding: 14px;
    font-size: 16px;
  }
}

/* 动画效果 */
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

.login-container {
  animation: fadeInUp 0.6s ease-out;
}
</style>