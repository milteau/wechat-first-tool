import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, generateId } from '../utils/storage'

// 数据模型
export interface Note {
  id: string
  title: string
  content: string
  categoryId: string
  createdAt: number
  updatedAt: number
}

export interface Category {
  id: string
  name: string
  color: string
}

// 预设颜色
const CATEGORY_COLORS = ['#007aff', '#4cd964', '#ff2d55', '#ff9500', '#5856d6', '#00c7be']

export const useNoteStore = defineStore('note', () => {
  // 状态
  const notes = ref<Note[]>([])
  const categories = ref<Category[]>([])
  const searchKeyword = ref('')
  const selectedCategoryId = ref<string | null>(null)

  // 初始化
  function init() {
    notes.value = storage.getNotes<Note>()
    categories.value = storage.getCategories<Category>()

    // 如果没有分类，创建默认分类
    if (categories.value.length === 0) {
      const defaultCategory: Category = {
        id: generateId(),
        name: '默认',
        color: CATEGORY_COLORS[0]
      }
      categories.value.push(defaultCategory)
      storage.setCategories(categories.value)
    }
  }

  // 计算属性：过滤后的笔记
  const filteredNotes = computed(() => {
    let result = [...notes.value]

    // 按分类筛选
    if (selectedCategoryId.value) {
      result = result.filter(note => note.categoryId === selectedCategoryId.value)
    }

    // 按关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(note =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
      )
    }

    // 按更新时间倒序
    result.sort((a, b) => b.updatedAt - a.updatedAt)

    return result
  })

  // 笔记操作
  function addNote(title: string, content: string, categoryId: string): Note {
    const now = Date.now()
    const note: Note = {
      id: generateId(),
      title: title || '无标题',
      content,
      categoryId,
      createdAt: now,
      updatedAt: now
    }
    notes.value.unshift(note)
    storage.setNotes(notes.value)
    return note
  }

  function updateNote(id: string, title: string, content: string, categoryId: string): boolean {
    const index = notes.value.findIndex(n => n.id === id)
    if (index === -1) return false

    notes.value[index] = {
      ...notes.value[index],
      title: title || '无标题',
      content,
      categoryId,
      updatedAt: Date.now()
    }
    storage.setNotes(notes.value)
    return true
  }

  function deleteNote(id: string): boolean {
    const index = notes.value.findIndex(n => n.id === id)
    if (index === -1) return false

    notes.value.splice(index, 1)
    storage.setNotes(notes.value)
    return true
  }

  function getNoteById(id: string): Note | undefined {
    return notes.value.find(n => n.id === id)
  }

  // 分类操作
  function addCategory(name: string): Category {
    const colorIndex = categories.value.length % CATEGORY_COLORS.length
    const category: Category = {
      id: generateId(),
      name,
      color: CATEGORY_COLORS[colorIndex]
    }
    categories.value.push(category)
    storage.setCategories(categories.value)
    return category
  }

  function deleteCategory(id: string): boolean {
    // 默认分类不能删除
    if (categories.value.length <= 1) return false

    const index = categories.value.findIndex(c => c.id === id)
    if (index === -1) return false

    const category = categories.value[index]
    if (category.name === '默认') return false

    // 将该分类下的笔记移到默认分类
    const defaultCategory = categories.value.find(c => c.name === '默认')
    if (defaultCategory) {
      notes.value.forEach(note => {
        if (note.categoryId === id) {
          note.categoryId = defaultCategory.id
        }
      })
      storage.setNotes(notes.value)
    }

    categories.value.splice(index, 1)
    storage.setCategories(categories.value)
    return true
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.value.find(c => c.id === id)
  }

  return {
    notes,
    categories,
    searchKeyword,
    selectedCategoryId,
    filteredNotes,
    init,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    addCategory,
    deleteCategory,
    getCategoryById
  }
})
