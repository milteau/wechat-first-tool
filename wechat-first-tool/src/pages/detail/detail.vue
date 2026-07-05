<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">{{ noteId ? '编辑笔记' : '新建笔记' }}</text>
      <view class="nav-action" @click="onSave">
        <text class="save-text">保存</text>
      </view>
    </view>

    <!-- 标题输入 -->
    <view class="title-section">
      <input
        class="title-input"
        type="text"
        v-model="title"
        placeholder="标题"
        placeholder-class="title-placeholder"
        maxlength="100"
      />
    </view>

    <!-- 分类选择 -->
    <view class="category-section">
      <text class="section-label">📁 分类</text>
      <scroll-view class="category-scroll" scroll-x>
        <view class="category-list">
          <view
            v-for="c in noteStore.categories"
            :key="c.id"
            class="category-item"
            :class="{ active: categoryId === c.id }"
            :style="categoryId === c.id ? { backgroundColor: c.color + '20', borderColor: c.color, color: c.color } : {}"
            @click="categoryId = c.id"
          >
            <view class="category-dot" :style="{ backgroundColor: c.color }"></view>
            <text>{{ c.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容输入 -->
    <view class="content-section">
      <textarea
        class="content-input"
        v-model="content"
        placeholder="开始记录你的想法..."
        placeholder-class="content-placeholder"
        maxlength="10000"
      />
    </view>

    <!-- 底部操作栏 -->
    <view v-if="noteId" class="bottom-bar">
      <view class="delete-btn" @click="onDelete">
        <text class="delete-icon">🗑️</text>
        <text>删除笔记</text>
      </view>
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
    if (note) {
      title.value = note.title
      content.value = note.content
      categoryId.value = note.categoryId
    }
  }

  if (!categoryId.value && noteStore.categories.length > 0) {
    categoryId.value = noteStore.categories[0].id
  }
})

function goBack() {
  uni.navigateBack()
}

function onSave() {
  if (!content.value.trim() && !title.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }

  if (noteId.value) {
    noteStore.updateNote(noteId.value, title.value, content.value, categoryId.value)
    uni.showToast({ title: '保存成功 ✓', icon: 'success' })
  } else {
    noteStore.addNote(title.value, content.value, categoryId.value)
    uni.showToast({ title: '创建成功 ✓', icon: 'success' })
  }

  setTimeout(() => uni.navigateBack(), 1000)
}

function onDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条笔记吗？删除后无法恢复。',
    confirmColor: '#ff3b30',
    success: (res) => {
      if (res.confirm && noteId.value) {
        noteStore.deleteNote(noteId.value)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
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

.nav-action {
  .save-text {
    font-size: 30rpx;
    color: #ffffff;
    font-weight: 500;
  }
}

// 标题输入
.title-section {
  background-color: #ffffff;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.title-input {
  width: 100%;
  font-size: 40rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.title-placeholder {
  color: #ccc;
}

// 分类选择
.category-section {
  background-color: #ffffff;
  padding: 24rpx 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  gap: 16rpx;
}

.category-item {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 28rpx;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
  background-color: #f5f6f7;
  border: 2rpx solid transparent;

  &.active {
    font-weight: 500;
  }
}

.category-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

// 内容输入
.content-section {
  flex: 1;
  background-color: #ffffff;
  margin: 24rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.content-input {
  width: 100%;
  min-height: 400rpx;
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
}

.content-placeholder {
  color: #ccc;
}

// 底部操作栏
.bottom-bar {
  padding: 20rpx 40rpx calc(20rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 24rpx;
  border-radius: 50rpx;
  background-color: #fff0f0;

  .delete-icon {
    font-size: 32rpx;
  }

  text {
    font-size: 30rpx;
    color: #ff3b30;
    font-weight: 500;
  }
}
</style>
