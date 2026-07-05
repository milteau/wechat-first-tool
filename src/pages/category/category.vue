<template>
  <view class="page">
    <!-- 新增分类 -->
    <view class="add-section">
      <input
        class="add-input"
        type="text"
        v-model="newCategoryName"
        placeholder="输入新分类名称"
        maxlength="20"
      />
      <view class="add-btn" @click="onAddCategory">添加</view>
    </view>

    <!-- 分类列表 -->
    <view class="category-list">
      <view
        v-for="category in noteStore.categories"
        :key="category.id"
        class="category-item"
      >
        <view class="category-info">
          <view class="color-dot" :style="{ backgroundColor: category.color }"></view>
          <text class="category-name">{{ category.name }}</text>
        </view>
        <view
          v-if="category.name !== '默认'"
          class="delete-btn"
          @click="onDeleteCategory(category.id)"
        >
          删除
        </view>
        <text v-else class="default-tag">默认</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNoteStore } from '../../stores/note'

const noteStore = useNoteStore()

const newCategoryName = ref('')

function onAddCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }

  // 检查是否已存在
  const exists = noteStore.categories.some(c => c.name === name)
  if (exists) {
    uni.showToast({ title: '分类已存在', icon: 'none' })
    return
  }

  noteStore.addCategory(name)
  newCategoryName.value = ''
  uni.showToast({ title: '添加成功', icon: 'success' })
}

function onDeleteCategory(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '删除后，该分类下的笔记将移至「默认」分类',
    success: (res) => {
      if (res.confirm) {
        const success = noteStore.deleteCategory(id)
        if (success) {
          uni.showToast({ title: '已删除', icon: 'success' })
        } else {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 30rpx;
}

.add-section {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.add-input {
  flex: 1;
  height: 80rpx;
  padding: 0 30rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.add-btn {
  width: 140rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.category-list {
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.category-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.color-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 12rpx;
}

.category-name {
  font-size: 30rpx;
  color: #333333;
}

.delete-btn {
  font-size: 28rpx;
  color: #ff3b30;
}

.default-tag {
  font-size: 24rpx;
  color: #999999;
  background-color: #f0f0f0;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}
</style>
