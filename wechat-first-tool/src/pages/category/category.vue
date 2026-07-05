<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">分类</text>
      <view class="nav-spacer"></view>
    </view>

    <!-- 新增分类 -->
    <view class="add-section">
      <view class="add-card">
        <input
          class="add-input"
          type="text"
          v-model="newCategoryName"
          placeholder="新分类名称"
          placeholder-class="placeholder"
          maxlength="20"
        />
        <view class="add-btn" @click="onAddCategory">添加</view>
      </view>
    </view>

    <!-- 分类列表 -->
    <view class="category-section">
      <view class="category-list">
        <view
          v-for="c in noteStore.categories"
          :key="c.id"
          class="category-item"
        >
          <view class="category-info">
            <view class="category-dot" :style="{ backgroundColor: c.color }"></view>
            <view class="category-text">
              <text class="category-name">{{ c.name }}</text>
              <text class="category-count">{{ getNoteCount(c.id) }} 条</text>
            </view>
          </view>
          <view v-if="c.name !== '默认'" class="delete-btn" @click="onDeleteCategory(c.id)">
            <text>删除</text>
          </view>
          <text v-else class="default-tag">默认</text>
        </view>
      </view>
    </view>

    <!-- 提示 -->
    <view class="tip-section">
      <text>删除分类后，笔记将移至默认分类</text>
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
    uni.showToast({ title: '请输入名称', icon: 'none' })
    return
  }

  if (noteStore.categories.some(c => c.name === name)) {
    uni.showToast({ title: '分类已存在', icon: 'none' })
    return
  }

  noteStore.addCategory(name)
  newCategoryName.value = ''
  uni.showToast({ title: '已添加', icon: 'success' })
}

function onDeleteCategory(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '删除后笔记将移至默认分类',
    confirmColor: '#c4a574',
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
$bg-color: #faf8f5;
$card-bg: #ffffff;
$text-primary: #3d3d3d;
$text-secondary: #8a8a8a;
$text-hint: #b5b5b5;
$accent-color: #c4a574;
$border-color: #f0ebe5;

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $bg-color;
}

// 导航栏
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 100rpx 50rpx 30rpx;
  background-color: $bg-color;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .back-icon {
    font-size: 40rpx;
    color: $text-primary;
  }
}

.nav-title {
  font-size: 34rpx;
  font-weight: 400;
  color: $text-primary;
  letter-spacing: 2rpx;
}

.nav-spacer {
  width: 60rpx;
}

// 新增分类
.add-section {
  padding: 30rpx 50rpx;
}

.add-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background-color: $card-bg;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  border: 1rpx solid $border-color;
}

.add-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-hint;
}

.add-btn {
  padding: 16rpx 32rpx;
  background-color: $accent-color;
  border-radius: 12rpx;

  text {
    font-size: 28rpx;
    color: #fff;
    font-weight: 500;
  }
}

// 分类列表
.category-section {
  padding: 0 50rpx;
}

.category-list {
  background-color: $card-bg;
  border-radius: 16rpx;
  border: 1rpx solid $border-color;
  overflow: hidden;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.category-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.category-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
}

.category-text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.category-name {
  font-size: 32rpx;
  color: $text-primary;
}

.category-count {
  font-size: 24rpx;
  color: $text-hint;
}

.delete-btn {
  padding: 12rpx 24rpx;
  border-radius: 10rpx;
  background-color: $bg-color;

  text {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.default-tag {
  font-size: 24rpx;
  color: $text-hint;
}

// 提示
.tip-section {
  padding: 40rpx 50rpx;
  margin-top: auto;

  text {
    font-size: 24rpx;
    color: $text-hint;
  }
}
</style>
