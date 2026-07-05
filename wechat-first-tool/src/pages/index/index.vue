<template>
  <view class="page">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">记事本</text>
      <text class="header-subtitle">{{ noteStore.filteredNotes.length }} 条笔记</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-wrapper">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          type="text"
          v-model="noteStore.searchKeyword"
          placeholder="搜索笔记..."
        />
        <text v-if="noteStore.searchKeyword" class="clear-icon" @click="noteStore.searchKeyword = ''">✕</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <view class="category-section">
      <scroll-view class="category-scroll" scroll-x>
        <view class="category-list">
          <view
            class="category-item"
            :class="{ active: !noteStore.selectedCategoryId }"
            @click="noteStore.selectedCategoryId = null"
          >
            <text class="category-icon">📋</text>
            <text>全部</text>
          </view>
          <view
            v-for="c in noteStore.categories"
            :key="c.id"
            class="category-item"
            :class="{ active: noteStore.selectedCategoryId === c.id }"
            :style="noteStore.selectedCategoryId === c.id ? { backgroundColor: c.color + '15', borderColor: c.color } : {}"
            @click="noteStore.selectedCategoryId = c.id"
          >
            <view class="category-dot" :style="{ backgroundColor: c.color }"></view>
            <text>{{ c.name }}</text>
          </view>
          <view class="category-item manage" @click="goToCategoryManage">
            <text class="category-icon">⚙️</text>
            <text>管理</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 笔记列表 -->
    <scroll-view class="note-list" scroll-y>
      <view class="note-list-content">
        <view
          v-for="note in noteStore.filteredNotes"
          :key="note.id"
          class="note-card"
          @click="goToDetail(note)"
        >
          <view class="note-card-header">
            <text class="note-title">{{ note.title }}</text>
            <view class="category-badge" :style="{ backgroundColor: noteStore.getCategoryById(note.categoryId)?.color + '20', color: noteStore.getCategoryById(note.categoryId)?.color }">
              {{ noteStore.getCategoryById(note.categoryId)?.name }}
            </view>
          </view>
          <text class="note-content">{{ note.content || '暂无内容' }}</text>
          <view class="note-footer">
            <text class="note-time">{{ formatDate(note.updatedAt) }}</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="noteStore.filteredNotes.length === 0" class="empty-state">
          <text class="empty-icon">📝</text>
          <text class="empty-text">暂无笔记</text>
          <text class="empty-hint">点击右下角按钮创建第一条笔记</text>
        </view>
      </view>
    </scroll-view>

    <!-- 新建按钮 -->
    <view class="fab" @click="goToDetail(null)">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNoteStore } from '../../stores/note'
import { formatDate } from '../../utils/storage'
import type { Note } from '../../stores/note'

const noteStore = useNoteStore()

onMounted(() => noteStore.init())

function goToDetail(note: Note | null) {
  if (note) {
    uni.navigateTo({ url: `/pages/detail/detail?id=${note.id}` })
  } else {
    uni.navigateTo({ url: '/pages/detail/detail' })
  }
}

function goToCategoryManage() {
  uni.navigateTo({ url: '/pages/category/category' })
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f6f7;
}

// 顶部标题栏
.header {
  padding: 60rpx 40rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .header-title {
    font-size: 48rpx;
    font-weight: 700;
    color: #ffffff;
  }

  .header-subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 8rpx;
  }
}

// 搜索栏
.search-wrapper {
  padding: 0 30rpx 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 50rpx;
  padding: 0 30rpx;
  height: 80rpx;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.2);
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.clear-icon {
  font-size: 24rpx;
  color: #999;
  padding: 10rpx;
}

// 分类筛选
.category-section {
  background-color: #ffffff;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-scroll {
  padding: 0 20rpx;
}

.category-list {
  display: flex;
  gap: 16rpx;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
  background-color: #f5f6f7;
  border: 2rpx solid transparent;
  white-space: nowrap;

  &.active {
    color: #667eea;
    background-color: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  }

  &.manage {
    color: #999;
  }
}

.category-icon {
  font-size: 24rpx;
}

.category-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

// 笔记列表
.note-list {
  flex: 1;
}

.note-list-content {
  padding: 24rpx 30rpx;
}

.note-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  &:active {
    transform: scale(0.98);
    transition: transform 0.2s;
  }
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.note-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
  margin-right: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-badge {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
  white-space: nowrap;
}

.note-content {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 20rpx;
}

.note-footer {
  display: flex;
  justify-content: flex-end;
}

.note-time {
  font-size: 24rpx;
  color: #999;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 34rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
  }
}

// 新建按钮
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 110rpx;
  height: 110rpx;
  border-radius: 55rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.5);

  &:active {
    transform: scale(0.95);
  }

  .fab-icon {
    font-size: 60rpx;
    color: #ffffff;
    font-weight: 300;
  }
}
</style>
