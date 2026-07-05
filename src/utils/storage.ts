// 本地存储工具类
const NOTES_KEY = 'notes'
const CATEGORIES_KEY = 'categories'

export const storage = {
  // 笔记操作
  getNotes<T>(): T[] {
    const data = uni.getStorageSync(NOTES_KEY)
    return data ? JSON.parse(data) : []
  },

  setNotes<T>(notes: T[]): void {
    uni.setStorageSync(NOTES_KEY, JSON.stringify(notes))
  },

  // 分类操作
  getCategories<T>(): T[] {
    const data = uni.getStorageSync(CATEGORIES_KEY)
    return data ? JSON.parse(data) : []
  },

  setCategories<T>(categories: T[]): void {
    uni.setStorageSync(CATEGORIES_KEY, JSON.stringify(categories))
  }
}

// 生成 UUID
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 格式化日期
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}
