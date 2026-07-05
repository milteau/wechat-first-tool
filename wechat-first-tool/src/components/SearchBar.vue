<template>
  <view class="search-bar">
    <input class="search-input" type="text" v-model="keyword" placeholder="搜索笔记" @input="onSearch" />
    <text v-if="keyword" class="clear-icon" @click="clearSearch">✕</text>
  </view>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const keyword = ref(props.modelValue)
watch(() => props.modelValue, val => keyword.value = val)
function onSearch() { emit('update:modelValue', keyword.value) }
function clearSearch() { keyword.value = ''; emit('update:modelValue', '') }
</script>
<style lang="scss" scoped>
.search-bar { position: relative; display: flex; align-items: center; }
.search-input { flex: 1; height: 72rpx; padding: 0 60rpx 0 30rpx; background-color: #fff; border-radius: 36rpx; font-size: 28rpx; }
.clear-icon { position: absolute; right: 24rpx; color: #999; font-size: 28rpx; }
</style>
