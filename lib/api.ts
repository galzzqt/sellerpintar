/**
 * Klien API untuk Sistem Artikel SellerPintar
 * 
 * Modul ini menyediakan klien API yang komprehensif yang mendukung panggilan API mock dan real.
 * Mengimplementasikan endpoint REST API standar seperti yang didokumentasikan:
 * 
 * Endpoint Artikel:
 * - GET /articles - Mendapatkan semua artikel (publik)
 * - POST /articles - Membuat artikel baru (memerlukan autentikasi)
 * - GET /articles/{id} - Mendapatkan artikel berdasarkan ID (publik)
 * - PUT /articles/{id} - Memperbarui artikel (memerlukan autentikasi)
 * - DELETE /articles/{id} - Menghapus artikel (memerlukan autentikasi)
 * 
 * Endpoint Kategori:
 * - GET /categories - Mendapatkan semua kategori (publik)
 * - POST /categories - Membuat kategori baru (memerlukan autentikasi admin)
 * - GET /categories/{id} - Mendapatkan kategori berdasarkan ID (publik)
 * - PUT /categories/{id} - Memperbarui kategori (memerlukan autentikasi admin)
 * - DELETE /categories/{id} - Menghapus kategori (memerlukan autentikasi admin)
 * 
 * Autentikasi:
 * - Semua endpoint yang dilindungi memerlukan autentikasi Bearer token
 * - Token otomatis disertakan dalam header permintaan jika tersedia
 * - Autentikasi divalidasi sebelum membuat permintaan yang dilindungi
 * 
 * Penanganan Error:
 * - Respons error terstruktur dengan flag success/error
 * - Penanganan kode status HTTP yang tepat
 * - Penanganan error jaringan dengan kemampuan retry
 */

import { articles as sampleArticles } from '@/lib/articles'

// Konfigurasi API
const API_BASE_URL = 'https://test-fe.mysellerpintar.com/api'

// Opsi konfigurasi API
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 detik
  retryAttempts: 3,
  retryDelay: 1000, // 1 detik
}

// Toggle API mock menggunakan env atau flag localStorage (di browser)
const USE_MOCK_API: boolean =
  (typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_USE_MOCK && process.env.NEXT_PUBLIC_USE_MOCK === 'true') ||
  (typeof window !== 'undefined' && localStorage.getItem('use_mock_api') === 'true')

// Selalu gunakan data dummy untuk artikel sesuai requirement
const USE_MOCK_ARTICLES = true

// Store berbasis LocalStorage untuk artikel dummy
type SampleArticle = typeof sampleArticles[number]
const MOCK_ARTICLES_KEY = 'mock_articles'

// Data dummy untuk kategori
const MOCK_CATEGORIES_KEY = 'mock_categories'
const defaultCategories: Category[] = [
  { id: 1, name: 'Technology', description: 'Artikel tentang teknologi dan inovasi', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Design', description: 'Artikel tentang desain dan UI/UX', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Development', description: 'Artikel tentang pengembangan aplikasi', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'AI', description: 'Artikel tentang kecerdasan buatan', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Web3', description: 'Artikel tentang teknologi blockchain dan Web3', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
]

const MockArticles = {
  load(): SampleArticle[] {
    if (typeof window === 'undefined') return sampleArticles
    const raw = localStorage.getItem(MOCK_ARTICLES_KEY)
    if (!raw) {
      localStorage.setItem(MOCK_ARTICLES_KEY, JSON.stringify(sampleArticles))
      return sampleArticles
    }
    try {
      return JSON.parse(raw)
    } catch {
      return sampleArticles
    }
  },
  save(list: SampleArticle[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_ARTICLES_KEY, JSON.stringify(list))
  },
  nextId(list: SampleArticle[]): number {
    return list.length ? Math.max(...list.map(a => a.id)) + 1 : 1
  }
}

const MockCategories = {
  load(): Category[] {
    if (typeof window === 'undefined') return defaultCategories
    const raw = localStorage.getItem(MOCK_CATEGORIES_KEY)
    if (!raw) {
      localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(defaultCategories))
      return defaultCategories
    }
    try {
      return JSON.parse(raw)
    } catch {
      return defaultCategories
    }
  },
  save(list: Category[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(list))
  },
  nextId(list: Category[]): number {
    return list.length ? Math.max(...list.map(c => c.id)) + 1 : 1
  }
}

// Tipe untuk respons API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    role: string
    email?: string
  }
}

export interface RegisterRequest {
  username: string
  password: string
  role: string
  email?: string
}

export interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
    role: string
    email?: string
  }
}

export interface Article {
  id: number
  title: string
  description: string
  content?: string
  author: string
  category: string
  tags: string[]
  published_at: string
  image_url?: string
  slug?: string
}

export interface UserProfile {
  id: number
  username: string
  email?: string
  role: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface CategoryRequest {
  name: string
  description?: string
}

// Kelas Klien API
class ApiClient {
  private baseURL: string
  private token: string | null = null
  private useMock: boolean

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.useMock = USE_MOCK_API
    // Muat token dari localStorage jika tersedia
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Tangani respons non-JSON
      let data: any
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = { message: await response.text() }
      }

      if (!response.ok) {
        // Kembalikan respons error terstruktur
        return {
          success: false,
          data: undefined as any,
          error: data.message || data.error || `Error HTTP! status: ${response.status}`,
          message: data.message || `Permintaan gagal dengan status ${response.status}`
        }
      }

      // Pastikan respons memiliki struktur yang diharapkan
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>
      }

      // Bungkus respons sukses dalam format standar
      return {
        success: true,
        data: data,
        message: data.message
      }
    } catch (error) {
      console.error('Permintaan API gagal:', error)
      
      // Kembalikan respons error terstruktur untuk error jaringan
      return {
        success: false,
        data: undefined as any,
        error: error instanceof Error ? error.message : 'Terjadi error jaringan',
        message: 'Gagal terhubung ke server'
      }
    }
  }

  // Metode autentikasi
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (this.useMock) {
      return MockAuth.login(credentials, this)
    }
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    if (this.useMock) {
      return MockAuth.register(userData, this)
    }
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<void> {
    if (this.useMock) {
      MockAuth.logout(this)
      return
    }
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Permintaan logout gagal:', error)
    } finally {
      this.clearToken()
    }
  }

  // Metode artikel
  async getArticles(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    from?: string
    sortBy?: 'publishedAt' | 'relevancy' | 'popularity'
  }): Promise<ApiResponse<{ articles: Article[]; total: number; page: number; limit: number }>> {
    if (USE_MOCK_ARTICLES) {
      const page = params?.page ?? 1
      const pageSize = params?.limit ?? 10
      const search = (params?.search || '').toLowerCase()

      const all = MockArticles.load()
      const filtered = search
        ? sampleArticles.filter(a =>
            a.title.toLowerCase().includes(search) ||
            a.description.toLowerCase().includes(search)
          )
        : all

      const start = (page - 1) * pageSize
      const items = filtered.slice(start, start + pageSize)

      const mapped: Article[] = items.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        content: a.content ? a.content.introduction : undefined,
        author: a.author,
        category: a.category,
        tags: a.tags,
        published_at: a.date,
        image_url: (a as any).heroImage,
        slug: a.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      }))

      return {
        success: true,
        data: {
          articles: mapped,
          total: filtered.length,
          page,
          limit: pageSize,
        }
      }
    }

    // Panggilan API real - GET /articles
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.from) queryParams.append('from', params.from)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)

    const endpoint = `/articles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async getArticle(id: number): Promise<ApiResponse<Article>> {
    if (USE_MOCK_ARTICLES) {
      const a = MockArticles.load().find(x => x.id === id)
      if (!a) return { success: false, data: undefined as any, message: 'Artikel tidak ditemukan' }
      const mapped: Article = {
        id: a.id,
        title: a.title,
        description: a.description,
        content: a.content ? a.content.introduction : undefined,
        author: a.author,
        category: a.category,
        tags: a.tags,
        published_at: a.date,
        image_url: (a as any).heroImage,
        slug: a.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      }
      return { success: true, data: mapped }
    }
    // Panggilan API real - GET /articles/{id}
    return this.request(`/articles/${id}`)
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    if (USE_MOCK_ARTICLES) {
      const a = MockArticles.load().find(x =>
        x.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-') === slug
      )
      if (!a) return { success: false, data: undefined as any, message: 'Artikel tidak ditemukan' }
      const mapped: Article = {
        id: a.id,
        title: a.title,
        description: a.description,
        content: a.content ? a.content.introduction : undefined,
        author: a.author,
        category: a.category,
        tags: a.tags,
        published_at: a.date,
        image_url: (a as any).heroImage,
        slug,
      }
      return { success: true, data: mapped }
    }
    return this.request(`/articles/slug/${slug}`)
  }

  // Buat artikel - POST /articles (memerlukan autentikasi)
  async createArticle(articleData: Omit<Article, 'id' | 'published_at'> & { published_at?: string }): Promise<ApiResponse<Article>> {
    // Validasi autentikasi untuk panggilan API real
    if (!USE_MOCK_ARTICLES) {
      this.validateAuth('membuat artikel')
    }
    
    if (USE_MOCK_ARTICLES) {
      const list = MockArticles.load()
      const now = new Date().toISOString().split('T')[0]
      const created: SampleArticle = {
        id: MockArticles.nextId(list),
        title: articleData.title,
        description: articleData.description,
        date: articleData.published_at || now,
        author: articleData.author,
        category: articleData.category,
        tags: articleData.tags || [],
        heroImage: articleData.image_url,
        content: articleData.content
          ? { introduction: String(articleData.content), sections: [], conclusion: '' }
          : undefined,
      }
      const newList = [created, ...list]
      MockArticles.save(newList)
      const mapped: Article = {
        id: created.id,
        title: created.title,
        description: created.description,
        content: created.content ? created.content.introduction : undefined,
        author: created.author,
        category: created.category,
        tags: created.tags,
        published_at: created.date,
        image_url: created.heroImage,
        slug: created.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      }
      return { success: true, data: mapped }
    }
    // Panggilan API real - POST /articles (memerlukan autentikasi)
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    })
  }

  // Perbarui artikel - PUT /articles/{id} (memerlukan autentikasi)
  async updateArticle(id: number, updates: Partial<Article>): Promise<ApiResponse<Article>> {
    // Validasi autentikasi untuk panggilan API real
    if (!USE_MOCK_ARTICLES) {
      this.validateAuth('memperbarui artikel')
    }
    
    if (USE_MOCK_ARTICLES) {
      const list = MockArticles.load()
      const idx = list.findIndex(a => a.id === id)
      if (idx === -1) return { success: false, data: undefined as any, message: 'Artikel tidak ditemukan' }
      const prev = list[idx]
      const updated: SampleArticle = {
        ...prev,
        title: updates.title ?? prev.title,
        description: updates.description ?? prev.description,
        date: updates.published_at ?? prev.date,
        author: updates.author ?? prev.author,
        category: updates.category ?? prev.category,
        tags: updates.tags ?? prev.tags,
        heroImage: updates.image_url ?? prev.heroImage,
        content: typeof updates.content === 'string'
          ? { introduction: updates.content, sections: prev.content?.sections || [], conclusion: prev.content?.conclusion || '' }
          : prev.content,
      }
      list[idx] = updated
      MockArticles.save(list)
      const mapped: Article = {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        content: updated.content ? updated.content.introduction : undefined,
        author: updated.author,
        category: updated.category,
        tags: updated.tags,
        published_at: updated.date,
        image_url: updated.heroImage,
        slug: updated.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      }
      return { success: true, data: mapped }
    }
    // Panggilan API real - PUT /articles/{id} (memerlukan autentikasi)
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Hapus artikel - DELETE /articles/{id} (memerlukan autentikasi)
  async deleteArticle(id: number): Promise<ApiResponse<{}>> {
    // Validasi autentikasi untuk panggilan API real
    if (!USE_MOCK_ARTICLES) {
      this.validateAuth('menghapus artikel')
    }
    
    if (USE_MOCK_ARTICLES) {
      const list = MockArticles.load()
      const next = list.filter(a => a.id !== id)
      if (next.length === list.length) return { success: false, data: {} as any, message: 'Artikel tidak ditemukan' }
      MockArticles.save(next)
      return { success: true, data: {} as any }
    }
    // Panggilan API real - DELETE /articles/{id} (memerlukan autentikasi)
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    })
  }

  // Metode profil pengguna
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    if (this.useMock) {
      return MockAuth.getUserProfile(this)
    }
    return this.request('/user/profile')
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    if (this.useMock) {
      return MockAuth.updateUserProfile(profileData, this)
    }
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Metode kategori
  async getCategories(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<{ categories: Category[]; total: number; page: number; limit: number }>> {
    if (this.useMock) {
      const page = params?.page ?? 1
      const pageSize = params?.limit ?? 10
      const search = (params?.search || '').toLowerCase()

      const all = MockCategories.load()
      const filtered = search
        ? all.filter(c => c.name.toLowerCase().includes(search))
        : all

      const start = (page - 1) * pageSize
      const items = filtered.slice(start, start + pageSize)

      return {
        success: true,
        data: {
          categories: items,
          total: filtered.length,
          page,
          limit: pageSize,
        }
      }
    }

    // Panggilan API real - GET /categories
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    const endpoint = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint)
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    if (this.useMock) {
      const category = MockCategories.load().find(c => c.id === id)
      if (!category) return { success: false, data: undefined as any, message: 'Kategori tidak ditemukan' }
      return { success: true, data: category }
    }
    // Panggilan API real - GET /categories/{id}
    return this.request(`/categories/${id}`)
  }

  // Buat kategori - POST /categories (memerlukan autentikasi admin)
  async createCategory(categoryData: CategoryRequest): Promise<ApiResponse<Category>> {
    // Validasi autentikasi untuk panggilan API real
    if (!this.useMock) {
      this.validateAuth('membuat kategori')
    }
    
    if (this.useMock) {
      const list = MockCategories.load()
      const now = new Date().toISOString()
      const created: Category = {
        id: MockCategories.nextId(list),
        name: categoryData.name,
        description: categoryData.description,
        created_at: now,
        updated_at: now,
      }
      const newList = [...list, created]
      MockCategories.save(newList)
      return { success: true, data: created }
    }
    // Panggilan API real - POST /categories (memerlukan autentikasi)
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  // Perbarui kategori - PUT /categories/{id} (memerlukan autentikasi admin)
  async updateCategory(id: number, updates: Partial<CategoryRequest>): Promise<ApiResponse<Category>> {
    // Validasi autentikasi untuk panggilan API real
    if (!this.useMock) {
      this.validateAuth('memperbarui kategori')
    }
    
    if (this.useMock) {
      const list = MockCategories.load()
      const idx = list.findIndex(c => c.id === id)
      if (idx === -1) return { success: false, data: undefined as any, message: 'Kategori tidak ditemukan' }
      const prev = list[idx]
      const updated: Category = {
        ...prev,
        name: updates.name ?? prev.name,
        description: updates.description ?? prev.description,
        updated_at: new Date().toISOString(),
      }
      list[idx] = updated
      MockCategories.save(list)
      return { success: true, data: updated }
    }
    // Panggilan API real - PUT /categories/{id} (memerlukan autentikasi)
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Hapus kategori - DELETE /categories/{id} (memerlukan autentikasi admin)
  async deleteCategory(id: number): Promise<ApiResponse<{}>> {
    // Validasi autentikasi untuk panggilan API real
    if (!this.useMock) {
      this.validateAuth('menghapus kategori')
    }
    
    if (this.useMock) {
      const list = MockCategories.load()
      const next = list.filter(c => c.id !== id)
      if (next.length === list.length) return { success: false, data: {} as any, message: 'Kategori tidak ditemukan' }
      MockCategories.save(next)
      return { success: true, data: {} as any }
    }
    // Panggilan API real - DELETE /categories/{id} (memerlukan autentikasi)
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Manajemen token
  setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  // Periksa apakah pengguna memiliki role yang diperlukan untuk operasi yang dilindungi
  hasRole(requiredRole: string): boolean {
    if (!this.isAuthenticated()) return false
    // Ini perlu diimplementasikan berdasarkan struktur token Anda
    // Untuk saat ini, kita asumsikan semua pengguna yang terautentikasi dapat melakukan operasi
    return true
  }

  // Validasi autentikasi sebelum operasi yang dilindungi
  private validateAuth(operation: string): void {
    if (!this.isAuthenticated()) {
      throw new Error(`Autentikasi diperlukan untuk ${operation}`)
    }
  }
}

// Buat dan ekspor instance klien API
export const apiClient = new ApiClient(API_BASE_URL)

// Fungsi utilitas
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Terjadi error yang tidak terduga'
}

export const formatApiDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Fungsi utilitas tambahan
export const isApiError = (response: any): response is ApiResponse<any> & { success: false } => {
  return response && typeof response === 'object' && response.success === false
}

export const isApiSuccess = (response: any): response is ApiResponse<any> & { success: true } => {
  return response && typeof response === 'object' && response.success === true
}

export const getApiErrorMessage = (response: any): string => {
  if (isApiError(response)) {
    return response.error || response.message || 'Terjadi error'
  }
  return 'Error tidak diketahui'
}

// Utilitas retry permintaan
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }
      
      // Tunggu sebelum mencoba lagi
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError!
}

// =====================
// Mock Auth (Data Dummy)
// =====================

type MockStoredUser = {
  id: number
  username: string
  password: string
  role: string
  email?: string
  created_at: string
  updated_at: string
}

const MOCK_USERS_KEY = 'mock_users'

const MockStore = {
  loadUsers(): MockStoredUser[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(MOCK_USERS_KEY)
    if (!raw) {
      const now = new Date().toISOString()
      const seed: MockStoredUser[] = [
        { id: 1, username: 'admin', password: 'password123', role: 'admin', email: 'admin@example.com', created_at: now, updated_at: now },
        { id: 2, username: 'user1', password: 'password123', role: 'user', email: 'user1@example.com', created_at: now, updated_at: now },
        { id: 3, username: 'user2', password: 'password123', role: 'user', email: 'user2@example.com', created_at: now, updated_at: now },
      ]
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(seed))
      return seed
    }
    try {
      const parsed: MockStoredUser[] = JSON.parse(raw)
      // Normalisasi role lama ke 'user' kecuali admin
      const normalized = parsed.map(u => ({
        ...u,
        role: u.role === 'admin' ? 'admin' : 'user',
      }))
      // Simpan kembali jika berubah
      const changed = JSON.stringify(parsed) !== JSON.stringify(normalized)
      if (changed) this.saveUsers(normalized)
      return normalized
    } catch {
      return []
    }
  },
  saveUsers(users: MockStoredUser[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
  },
  nextId(users: MockStoredUser[]): number {
    return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1
  }
}

const MockAuth = {
  buildToken(userId: number): string {
    return `mock-token-${userId}`
  },
  parseToken(token: string | null): number | null {
    if (!token) return null
    const prefix = 'mock-token-'
    if (!token.startsWith(prefix)) return null
    const idStr = token.slice(prefix.length)
    const id = Number(idStr)
    return Number.isFinite(id) ? id : null
  },
  toUserProfile(u: MockStoredUser): UserProfile {
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }
  },
  async login(credentials: LoginRequest, client: ApiClient): Promise<ApiResponse<LoginResponse>> {
    const users = MockStore.loadUsers()
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password)
    if (!user) {
      return { success: false, data: undefined as any, message: 'Username atau password tidak valid' }
    }
    const token = this.buildToken(user.id)
    client.setToken(token)
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        }
      }
    }
  },
  async register(userData: RegisterRequest, client: ApiClient): Promise<ApiResponse<RegisterResponse>> {
    const users = MockStore.loadUsers()
    const exists = users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())
    if (exists) {
      return { success: false, data: undefined as any, message: 'Username sudah ada' }
    }
    const now = new Date().toISOString()
    const newUser: MockStoredUser = {
      id: MockStore.nextId(users),
      username: userData.username,
      password: userData.password,
      role: userData.role === 'admin' ? 'admin' : 'user',
      email: userData.email,
      created_at: now,
      updated_at: now,
    }
    const updated = [...users, newUser]
    MockStore.saveUsers(updated)
    const token = this.buildToken(newUser.id)
    client.setToken(token)
    return {
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          email: newUser.email,
        }
      }
    }
  },
  logout(client: ApiClient) {
    client.clearToken()
  },
  async getUserProfile(client: ApiClient): Promise<ApiResponse<UserProfile>> {
    const userId = this.parseToken(client.getToken())
    if (!userId) {
      return { success: false, data: undefined as any, message: 'Tidak terautentikasi' }
    }
    const users = MockStore.loadUsers()
    const user = users.find(u => u.id === userId)
    if (!user) {
      return { success: false, data: undefined as any, message: 'Pengguna tidak ditemukan' }
    }
    return { success: true, data: this.toUserProfile(user) }
  },
  async updateUserProfile(profileData: Partial<UserProfile>, client: ApiClient): Promise<ApiResponse<UserProfile>> {
    const userId = this.parseToken(client.getToken())
    if (!userId) {
      return { success: false, data: undefined as any, message: 'Tidak terautentikasi' }
    }
    const users = MockStore.loadUsers()
    const index = users.findIndex(u => u.id === userId)
    if (index === -1) {
      return { success: false, data: undefined as any, message: 'Pengguna tidak ditemukan' }
    }
    const prev = users[index]
    const updated: MockStoredUser = {
      ...prev,
      username: profileData.username ?? prev.username,
      email: profileData.email ?? prev.email,
      role: profileData.role ?? prev.role,
      updated_at: new Date().toISOString(),
    }
    users[index] = updated
    MockStore.saveUsers(users)
    return { success: true, data: this.toUserProfile(updated) }
  }
}
