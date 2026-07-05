<template>
  <view class="page">
    <input class="title-input" type="text" v-model="title" placeholder="标题" maxlength="100" />
    <view class="category-section">
      <text class="section-label">分类</text>
      <scroll-view class="category-scroll" scroll-x>
        <view class="category-list">
          <view v-for="c in noteStore.categories" :key="c.id" class="category-item" :class="{ active: categoryId === c.id }" :style="categoryId === c.id ? { backgroundColor: c.color, color: '#fff' } : {}" @click="categoryId = c.id">{{ c.name }}</view>
        </view>
      </scroll-view>
    </view>
    <textarea class="content-input" v-model="content" placeholder="开始记录..." maxlength="10000" />
    <view class="bottom-bar">
      <view v-if="noteId" class="delete-btn" @click="onDelete">删除</view>
      <view class="save-btn" @click="onSave">保存</view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNoteStore } from '../../stores/note'
const noteStore = useNoteStore()
const noteId = ref<string | null>(null)
const title = ref('')
const content = ref('')
const categoryId = ref('')
onMounted(() => {
  noteStore.init()
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const options = (current as any).$page?.options || {}
  if (options.id) {
    noteId.value = options.id
    const note = noteStore.getNoteById(options.id)
    if (note) { title.value = note.title; content.value = note.content; categoryId.value = note.categoryId }
  }
  if (!categoryId.value && noteStore.categories.length > 0) categoryId.value = noteStore.categories[0].id
})
function onSave() {
  if (!content.value.trim() && !title.value.trim()) { uni.showToast({ title: '请输入内容', icon: 'none' }); return }
  if (noteId.value) { noteStore.updateNote(noteId.value, title.value, content.value, categoryId.value); uni.showToast({ title: '保存成功', icon: 'success' }) }
  else { noteStore.addNote(title.value, content.value, categoryId.value); uni.showToast({ title: '创建成功', icon: 'success' }) }
  setTimeout(() => uni.navigateBack(), 1000)
}
function onDelete() {
  uni.showModal({ title: '确认删除', content: '确定要删除这条笔记吗？', success: (res) => {
    if (res.confirm && noteId.value) { noteStore.deleteNote(noteId.value); uni.showToast({ title: '已删除', icon: 'success' }); setTimeout(() => uni.navigateBack(), 1000) }
  }})
}
</script>
<style lang="scss" scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; padding: 30rpx; padding-bottom: 140rpx; }
.title-input { width: 100%; height: 88rpx; font-size: 36rpx; font-weight: 600; border-bottom: 1rpx solid #e5e5e5; padding: 0 0 20rpx 0; }
.category-section { margin-top: 30rpx; }
.section-label { font-size: 28rpx; color: #999; margin-bottom: 16rpx; display: block; }
.category-scroll { white-space: nowrap; }
.category-list { display: inline-flex; gap: 16rpx; }
.category-item { display: inline-block; padding: 12rpx 28rpx; border-radius: 28rpx; font-size: 26rpx; background-color: #f0f0f0; color: #666; &.active { background-color: #007aff; color: #fff; } }
.content-input { flex: 1; width: 100%; min-height: 400rpx; margin-top: 30rpx; font-size: 30rpx; line-height: 1.8; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 20rpx 30rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); background-color: #fff; border-top: 1rpx solid #e5e5e5; }
.delete-btn { font-size: 30rpx; color: #ff3b30; padding: 20rpx 40rpx; }
.save-btn { font-size: 30rpx; color: #fff; background-color: #007aff; padding: 20rpx 60rpx; border-radius: 44rpx; }
</style>
