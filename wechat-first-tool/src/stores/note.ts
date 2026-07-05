import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, generateId } from '../utils/storage'

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

const CATEGORY_COLORS = ['#007aff', '#4cd964', '#ff2d55', '#ff9500', '#5856d6', '#00c7be']

export const useNoteStore = defineStore('note', () => {
  const notes = ref<Note[]>([])
  const categories = ref<Category[]>([])
  const searchKeyword = ref('')
  const selectedCategoryId = ref<string | null>(null)

  function init() {
    notes.value = storage.getNotes<Note>()
    categories.value = storage.getCategories<Category>()
    if (categories.value.length === 0) {
      categories.value.push({ id: generateId(), name: '默认', color: CATEGORY_COLORS[0] })
      storage.setCategories(categories.value)
    }
  }

  const filteredNotes = computed(() => {
    let result = [...notes.value]
    if (selectedCategoryId.value) {
      result = result.filter(n => n.categoryId === selectedCategoryId.value)
    }
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      result = result.filter(n => n.title.toLowerCase().includes(kw) || n.content.toLowerCase().includes(kw))
    }
    result.sort((a, b) => b.updatedAt - a.updatedAt)
    return result
  })

  function addNote(title: string, content: string, categoryId: string): Note {
    const now = Date.now()
    const note: Note = { id: generateId(), title: title || '无标题', content, categoryId, createdAt: now, updatedAt: now }
    notes.value.unshift(note)
    storage.setNotes(notes.value)
    return note
  }

  function updateNote(id: string, title: string, content: string, categoryId: string): boolean {
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx === -1) return false
    notes.value[idx] = { ...notes.value[idx], title: title || '无标题', content, categoryId, updatedAt: Date.now() }
    storage.setNotes(notes.value)
    return true
  }

  function deleteNote(id: string): boolean {
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx === -1) return false
    notes.value.splice(idx, 1)
    storage.setNotes(notes.value)
    return true
  }

  function getNoteById(id: string): Note | undefined {
    return notes.value.find(n => n.id === id)
  }

  function addCategory(name: string): Category {
    const colorIndex = categories.value.length % CATEGORY_COLORS.length
    const category: Category = { id: generateId(), name, color: CATEGORY_COLORS[colorIndex] }
    categories.value.push(category)
    storage.setCategories(categories.value)
    return category
  }

  function deleteCategory(id: string): boolean {
    if (categories.value.length <= 1) return false
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx === -1) return false
    if (categories.value[idx].name === '默认') return false
    const defaultCat = categories.value.find(c => c.name === '默认')
    if (defaultCat) {
      notes.value.forEach(n => { if (n.categoryId === id) n.categoryId = defaultCat.id })
      storage.setNotes(notes.value)
    }
    categories.value.splice(idx, 1)
    storage.setCategories(categories.value)
    return true
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.value.find(c => c.id === id)
  }

  return { notes, categories, searchKeyword, selectedCategoryId, filteredNotes, init, addNote, updateNote, deleteNote, getNoteById, addCategory, deleteCategory, getCategoryById }
})
