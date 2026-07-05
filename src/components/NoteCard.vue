<template>
  <view class="note-card" @click="onClick">
    <view class="note-header">
      <text class="note-title">{{ title }}</text>
      <CategoryTag v-if="category" :name="category.name" :color="category.color" />
    </view>
    <text class="note-content">{{ content }}</text>
    <text class="note-time">{{ formattedTime }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CategoryTag from './CategoryTag.vue'
import type { Note, Category } from '../stores/note'
import { formatDate } from '../utils/storage'

const props = defineProps<{
  note: Note
  category?: Category
}>()

const emit = defineEmits<{
  (e: 'click', note: Note): void
}>()

const formattedTime = computed(() => formatDate(props.note.updatedAt))

function onClick() {
  emit('click', props.note)
}
</script>

<style lang="scss" scoped>
.note-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.note-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-content {
  display: block;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 20rpx;
}

.note-time {
  font-size: 24rpx;
  color: #999999;
}
</style>
