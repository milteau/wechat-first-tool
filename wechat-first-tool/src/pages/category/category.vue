<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">分类管理</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- 新增分类 -->
    <view class="add-section">
      <view class="add-card">
        <input
          class="add-input"
          type="text"
          v-model="newCategoryName"
          placeholder="输入新分类名称..."
          maxlength="20"
        />
        <view class="add-btn" @click="onAddCategory">
          <text class="add-icon">+</text>
          <text>添加</text>
        </view>
      </view>
    </view>

    <!-- 分类列表 -->
    <view class="category-section">
      <text class="section-title">📂 我的分类</text>
      <view class="category-list">
        <view
          v-for="(c, index) in noteStore.categories"
          :key="c.id"
          class="category-item"
          :style="{ animationDelay: index * 0.05 + 's' }"
        >
          <view class="category-info">
            <view class="category-icon-wrapper" :style="{ backgroundColor: c.color + '20' }">
              <view class="category-dot" :style="{ backgroundColor: c.color }"></view>
            </view>
            <view class="category-text">
              <text class="category-name">{{ c.name }}</text>
              <text class="category-count">{{ getNoteCount(c.id) }} 条笔记</text>
            </view>
          </view>
          <view v-if="c.name !== '默认'" class="delete-btn" @click="onDeleteCategory(c.id)">
            <text>删除</text>
          </view>
          <view v-else class="default-badge">
            <text>默认</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 提示 -->
    <view class="tip-section">
      <text class="tip-icon">💡</text>
      <text class="tip-text">删除分类后，该分类下的笔记将自动移至「默认」分类</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNoteStore } from '../../stores/note'

const noteStore = useNoteStore()
const newCategoryName = ref('')

function goBack() {
  uni.navigateBack()
}

function getNoteCount(categoryId: string): number {
  return noteStore.notes.filter(n => n.categoryId === categoryId).length
}

function onAddCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }

  if (noteStore.categories.some(c => c.name === name)) {
    uni.showToast({ title: '分类已存在', icon: 'none' })
    return
  }

  noteStore.addCategory(name)
  newCategoryName.value = ''
  uni.showToast({ title: '添加成功 ✓', icon: 'success' })
}

function onDeleteCategory(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '删除后，该分类下的笔记将移至「默认」分类',
    confirmColor: '#667eea',
    success: (res) => {
      if (res.confirm) {
        const ok = noteStore.deleteCategory(id)
        uni.showToast({ title: ok ? '已删除' : '删除失败', icon: 'none' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f6f7;
}

// 导航栏
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60rpx 30rpx 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .back-icon {
    font-size: 40rpx;
    color: #ffffff;
  }
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
}

.nav-spacer {
  width: 64rpx;
}

// 新增分类
.add-section {
  padding: 30rpx;
}

.add-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.add-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;

  .add-icon {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 300;
  }

  text {
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 500;
  }
}

// 分类列表
.category-section {
  padding: 0 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.category-list {
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f6f7;
  animation: fadeIn 0.3s ease-out both;

  &:last-child {
    border-bottom: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.category-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-dot {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
}

.category-text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.category-name {
  font-size: 32rpx;
  color: #1a1a1a;
  font-weight: 500;
}

.category-count {
  font-size: 24rpx;
  color: #999;
}

.delete-btn {
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  background-color: #fff0f0;

  text {
    font-size: 26rpx;
    color: #ff3b30;
  }
}

.default-badge {
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  background-color: #f5f6f7;

  text {
    font-size: 26rpx;
    color: #999;
  }
}

// 提示
.tip-section {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 30rpx 40rpx;
  margin-top: auto;

  .tip-icon {
    font-size: 28rpx;
  }

  .tip-text {
    font-size: 24rpx;
    color: #999;
    line-height: 1.5;
  }
}
</style>
