<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-wrapper">
      <SearchBar v-model="noteStore.searchKeyword" />
    </view>

    <!-- 分类筛选 -->
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
          v-for="category in noteStore.categories"
          :key="category.id"
          class="category-item"
          :class="{ active: noteStore.selectedCategoryId === category.id }"
          :style="noteStore.selectedCategoryId === category.id ? { backgroundColor: category.color, color: '#fff' } : {}"
          @click="noteStore.selectedCategoryId = category.id"
        >
          {{ category.name }}
        </view>
        <view class="category-item manage" @click="goToCategoryManage">
          管理
        </view>
      </view>
    </scroll-view>

    <!-- 笔记列表 -->
    <scroll-view class="note-list" scroll-y>
      <view class="note-list-content">
        <NoteCard
          v-for="note in noteStore.filteredNotes"
          :key="note.id"
          :note="note"
          :category="noteStore.getCategoryById(note.categoryId)"
          @click="goToDetail"
        />
        <view v-if="noteStore.filteredNotes.length === 0" class="empty-state">
          <text class="empty-text">暂无笔记</text>
          <text class="empty-hint">点击下方按钮新建笔记</text>
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
import SearchBar from '../../components/SearchBar.vue'
import CategoryTag from '../../components/CategoryTag.vue'
import NoteCard from '../../components/NoteCard.vue'
import type { Note } from '../../stores/note'

const noteStore = useNoteStore()

onMounted(() => {
  noteStore.init()
})

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
}

.search-wrapper {
  padding: 20rpx 30rpx;
  background-color: #f8f8f8;
}

.category-scroll {
  background-color: #ffffff;
  white-space: nowrap;
  padding: 0 20rpx 20rpx;
}

.category-list {
  display: inline-flex;
  gap: 16rpx;
}

.category-item {
  display: inline-block;
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  font-size: 26rpx;
  background-color: #f0f0f0;
  color: #666666;

  &.active {
    background-color: #007aff;
    color: #ffffff;
  }

  &.manage {
    background-color: #f0f0f0;
    color: #999999;
  }
}

.note-list {
  flex: 1;
  padding: 20rpx 30rpx;
}

.note-list-content {
  padding-bottom: 160rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-text {
    font-size: 32rpx;
    color: #999999;
    margin-bottom: 16rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #cccccc;
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #007aff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.4);

  .fab-icon {
    font-size: 56rpx;
    color: #ffffff;
    font-weight: 300;
  }
}
</style>
