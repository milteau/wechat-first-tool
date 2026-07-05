<template>
  <view class="note-card" @click="onClick">
    <view class="note-card-header">
      <text class="note-title">{{ note.title }}</text>
      <view
        class="category-badge"
        :style="{
          backgroundColor: category?.color + '20',
          color: category?.color
        }"
      >
        {{ category?.name || '默认' }}
      </view>
    </view>
    <text class="note-content">{{ note.content || '暂无内容' }}</text>
    <view class="note-footer">
      <text class="note-time">🕐 {{ formatDate(note.updatedAt) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Note, Category } from '../stores/note'
import { formatDate } from '../utils/storage'

const props = defineProps<{
  note: Note
  category?: Category
}>()

const emit = defineEmits<{
  (e: 'click', note: Note): void
}>()

function onClick() {
  emit('click', props.note)
}
</script>

<style lang="scss" scoped>
.note-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.06);
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
</style>
