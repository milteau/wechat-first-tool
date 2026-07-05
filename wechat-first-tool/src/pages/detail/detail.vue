<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">{{ noteId ? '编辑' : '新建' }}</text>
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
        placeholder-class="placeholder"
        maxlength="100"
      />
    </view>

    <!-- 分类选择 -->
    <view class="category-section">
      <scroll-view class="category-scroll" scroll-x>
        <view class="category-list">
          <view
            v-for="c in noteStore.categories"
            :key="c.id"
            class="category-item"
            :class="{ active: categoryId === c.id }"
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
        placeholder="开始记录..."
        placeholder-class="placeholder"
        maxlength="10000"
      />
    </view>

    <!-- 底部操作栏 -->
    <view v-if="noteId" class="bottom-bar">
      <view class="delete-btn" @click="onDelete">
        <text>删除</text>
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
    uni.showToast({ title: '已保存', icon: 'success' })
  } else {
    noteStore.addNote(title.value, content.value, categoryId.value)
    uni.showToast({ title: '已创建', icon: 'success' })
  }

  setTimeout(() => uni.navigateBack(), 800)
}

function onDelete() {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复',
    confirmColor: '#c4a574',
    success: (res) => {
      if (res.confirm && noteId.value) {
        noteStore.deleteNote(noteId.value)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
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

.nav-action {
  .save-text {
    font-size: 30rpx;
    color: $accent-color;
    font-weight: 500;
  }
}

// 标题输入
.title-section {
  background-color: $card-bg;
  padding: 30rpx 50rpx;
  border-top: 1rpx solid $border-color;
  border-bottom: 1rpx solid $border-color;
}

.title-input {
  width: 100%;
  font-size: 40rpx;
  font-weight: 500;
  color: $text-primary;
}

.placeholder {
  color: $text-hint;
}

// 分类选择
.category-section {
  background-color: $card-bg;
  padding: 24rpx 50rpx;
  border-bottom: 1rpx solid $border-color;
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
  padding: 14rpx 28rpx;
  border-radius: 40rpx;
  font-size: 27rpx;
  color: $text-secondary;
  background-color: $bg-color;

  &.active {
    background-color: $accent-color;
    color: #fff;
  }
}

.category-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

// 内容输入
.content-section {
  flex: 1;
  background-color: $card-bg;
  margin: 30rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  border: 1rpx solid $border-color;
}

.content-input {
  width: 100%;
  min-height: 500rpx;
  font-size: 30rpx;
  line-height: 1.9;
  color: $text-primary;
}

// 底部操作栏
.bottom-bar {
  padding: 20rpx 50rpx calc(30rpx + env(safe-area-inset-bottom));
  background-color: $card-bg;
  border-top: 1rpx solid $border-color;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-radius: 16rpx;
  background-color: $bg-color;

  text {
    font-size: 30rpx;
    color: $text-secondary;
  }
}
</style>
