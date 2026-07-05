<template>
  <view class="note-card" @click="onClick">
    <view class="note-card-header">
      <text class="note-title">{{ note.title }}</text>
    </view>
    <text class="note-content">{{ note.content || '暂无内容' }}</text>
    <view class="note-footer">
      <text class="category-tag" :style="{ color: category?.color }">{{ category?.name }}</text>
      <text class="note-time">{{ formatDate(note.updatedAt) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
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
$card-bg: #ffffff;
$text-primary: #3d3d3d;
$text-secondary: #8a8a8a;
$text-hint: #b5b5b5;
$border-color: #f0ebe5;

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
</style>
