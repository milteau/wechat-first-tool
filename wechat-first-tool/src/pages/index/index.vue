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
            全部
          </view>
          <view
            v-for="c in noteStore.categories"
            :key="c.id"
            class="category-item"
            :class="{ active: noteStore.selectedCategoryId === c.id }"
            :style="noteStore.selectedCategoryId === c.id ? { backgroundColor: c.color + '30', color: c.color } : {}"
            @click="noteStore.selectedCategoryId = c.id"
          >
            {{ c.name }}
          </view>
          <view class="category-item" @click="goToCategoryManage">管理</view>
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
          </view>
          <text class="note-content">{{ note.content || '暂无内容' }}</text>
          <view class="note-footer">
            <view class="note-meta">
              <text class="category-tag" :style="{ color: noteStore.getCategoryById(note.categoryId)?.color }">
                {{ noteStore.getCategoryById(note.categoryId)?.name }}
              </text>
              <text class="note-time">{{ formatDate(note.updatedAt) }}</text>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="noteStore.filteredNotes.length === 0" class="empty-state">
          <text class="empty-icon">📒</text>
          <text class="empty-text">暂无笔记</text>
          <text class="empty-hint">点击下方按钮创建</text>
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
  height: 100vh;
  background-color: $bg-color;
}

// 顶部标题栏
.header {
  padding: 100rpx 50rpx 40rpx;
  background-color: $bg-color;

  .header-title {
    font-size: 56rpx;
    font-weight: 300;
    color: $text-primary;
    letter-spacing: 2rpx;
  }

  .header-subtitle {
    display: block;
    font-size: 26rpx;
    color: $text-hint;
    margin-top: 12rpx;
  }
}

// 搜索栏
.search-wrapper {
  padding: 0 50rpx 30rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: $card-bg;
  border-radius: 16rpx;
  padding: 0 30rpx;
  height: 88rpx;
  border: 1rpx solid $border-color;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  font-size: 30rpx;
  color: $text-primary;
}

.clear-icon {
  font-size: 24rpx;
  color: $text-hint;
  padding: 10rpx;
}

// 分类筛选
.category-section {
  background-color: $card-bg;
  padding: 24rpx 0;
  border-top: 1rpx solid $border-color;
  border-bottom: 1rpx solid $border-color;
}

.category-scroll {
  padding: 0 40rpx;
}

.category-list {
  display: flex;
  gap: 16rpx;
}

.category-item {
  padding: 14rpx 32rpx;
  border-radius: 40rpx;
  font-size: 27rpx;
  color: $text-secondary;
  background-color: $bg-color;
  white-space: nowrap;

  &.active {
    background-color: $accent-color;
    color: #fff;
  }
}

// 笔记列表
.note-list {
  flex: 1;
}

.note-list-content {
  padding: 30rpx 50rpx;
}

.note-card {
  background-color: $card-bg;
  border-radius: 16rpx;
  padding: 36rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid $border-color;
}

.note-card-header {
  margin-bottom: 16rpx;
}

.note-title {
  font-size: 34rpx;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
}

.note-content {
  display: block;
  font-size: 28rpx;
  color: $text-secondary;
  line-height: 1.7;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 24rpx;
}

.note-footer {
  display: flex;
  justify-content: flex-end;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.category-tag {
  font-size: 24rpx;
  font-weight: 500;
}

.note-time {
  font-size: 24rpx;
  color: $text-hint;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 180rpx;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 32rpx;
    color: $text-secondary;
    margin-bottom: 12rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: $text-hint;
  }
}

// 新建按钮
.fab {
  position: fixed;
  right: 50rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: $accent-color;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(196, 165, 116, 0.3);

  .fab-icon {
    font-size: 56rpx;
    color: #fff;
    font-weight: 300;
  }
}
</style>
