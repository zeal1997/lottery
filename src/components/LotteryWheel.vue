<template>
  <div class="lottery-container">
    <h2>幸运大转盘</h2>
    
    <!-- 原有的转盘部分保持不变 -->
    <div class="wheel-wrapper">
      <img 
        :src="require('@/assets/wheel.png')" 
        class="wheel" 
        :style="wheelStyle" 
        :class="{ spinning: isSpinning }"
        alt="转盘"
      />
      <div class="wheel-pointer"></div>
    </div>
    <button class="draw-btn" @click="startDraw" :disabled="isSpinning || hasDrawn">
      {{ isSpinning ? '抽奖中...' : '开始抽奖' }}
    </button>
     <!-- 抽奖说明 -->
    <div class="lottery-description">
      <p><strong>说明：</strong>限时抽奖活动，必须是2025年线上办理移动校园卡用户可参与。奖品有价值360元的移动话费卡，3用PAD1台，瑞幸咖啡券，网红充电宝，卡通插线板，网红小夜灯，小风扇，泡面碗，轻奢水杯，泡泡玛特盲盒，炫彩雨伞等等。</p>
    </div>
    <!-- 奖品预览轮播 -->
    <div class="prize-preview">
      <h3>奖品预览</h3>
      <div class="preview-container">
        <img 
          :src="currentPreviewImage" 
          class="preview-image" 
          alt="奖品预览"
        />
        <div class="preview-dots">
          <span 
            v-for="(img, index) in previewImages" 
            :key="index"
            :class="['dot', { active: index === currentPreviewIndex }]"
            @click="currentPreviewIndex = index"
          ></span>
        </div>
      </div>
    </div>
    
    <!-- 中奖弹窗 -->
    <div v-if="showResultModal" class="result-modal">
      <div class="modal-content">
        <h3 v-if="winningPrize && winningPrize.name !== '谢谢参与'">你的抽奖结果为:</h3>
        <h3 v-else>抽奖结果</h3>
        <p>{{ winningPrize.name }}</p>
        <button @click="closeResult">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { 
    return { 
      rotateDegree: 0, 
      isSpinning: false, 
      spinningTime: 5000,
      currentPreviewIndex: 0,
      previewImages: [
        require('@/assets/round/360话费.jpg'),
        require('@/assets/round/pad.jpg'),
        require('@/assets/round/咖啡券.jpg'),
        require('@/assets/round/泡面碗.jpg'),
        require('@/assets/round/炫彩雨伞.jpg'),
        require('@/assets/round/网红小夜灯.jpg'),
        require('@/assets/round/轻奢水杯.jpg'),
        require('@/assets/round/卡套插线板.jpg'),
        require('@/assets/round/充电宝.jpg'),
        require('@/assets/round/labubu.jpg')
      ],
      previewInterval: null,
      showResultModal: false  // 新增：控制中奖弹窗显示
    }
  },
  computed: {
    currentPreviewImage() {
      return this.previewImages[this.currentPreviewIndex]
    },
    availablePrizes() { 
      return this.$store.state.prizes.filter(p => p.count > 0) 
    },
    hasDrawn() { 
      return this.$store.state.hasDrawn 
    },
    winningPrize() { 
      return this.$store.state.winningPrize 
    },
    wheelStyle() {
      return {
        transform: `rotate(${this.rotateDegree}deg)`
      }
    }
  },
  methods: {
    startPreviewRotation() {
      this.previewInterval = setInterval(() => {
        this.currentPreviewIndex = (this.currentPreviewIndex + 1) % this.previewImages.length
      }, 3000)
    },
    
    startDraw() {
      this.isSpinning = true
      this.rotateDegree += 360 * 5 + Math.random() * 360

      setTimeout(() => {
        this.isSpinning = false
        this.$store.dispatch('drawPrize').then(() => {
          // 抽奖完成后显示弹窗
          this.showResultModal = true
        })
      }, this.spinningTime)
    },
    
    closeResult() { 
      this.showResultModal = false  // 关闭弹窗
      this.$router.push('/result') 
    }
  },
  mounted() {
    // 启动自动轮播
    this.startPreviewRotation()
  },
  
  beforeUnmount() {
    // 清除定时器
    if (this.previewInterval) {
      clearInterval(this.previewInterval)
    }
  }
}
</script>

<style scoped>
.lottery-container {
  text-align: center;
  padding: 20px;
}

.wheel-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.wheel-pointer {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background-color: #ff4d4f;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: 10;
}

.draw-btn {
  margin-top: 30px;
  padding: 10px 30px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
}

.draw-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.modal-content button {
  margin-top: 20px;
  padding: 8px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.lottery-description {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  line-height: 1.6;
  color: #666;
  font-size: 14px;
}

.lottery-description p {
  margin: 0;
}

/* 奖品预览样式 */
.prize-preview {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.prize-preview h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.preview-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
}

.preview-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #fff;
}

.dot:hover {
  background-color: rgba(255,255,255,0.8);
}
</style>