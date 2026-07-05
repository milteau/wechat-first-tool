<template>
  <view class="category-tag" :style="{ backgroundColor: color + '20', color: color }">{{ name }}</view>
</template>
<script setup lang="ts">
defineProps<{ name: string; color: string }>()
</script>
<style lang="scss" scoped>
.category-tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 20rpx; font-size: 24rpx; }
</style>
