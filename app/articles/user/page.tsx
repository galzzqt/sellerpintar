"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserSidebar } from "@/components/UserSidebar"
import { UserDropdown } from "@/components/UserDropdown"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, Article, formatApiDate } from "@/lib/api"

// Kategori yang tersedia untuk filter
const categories = ["All", "Technology", "Design", "Development", "AI", "Web3"]

/**
 * Halaman artikel untuk pengguna biasa
 * Menampilkan daftar artikel dalam format blog dengan layout card
 */
export default function UserArticlesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState<Article[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const articlesPerPage = 9

  // Redirect jika tidak terautentikasi atau jika admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role === 'admin') {
        router.push('/articles')
      }
    }
  }, [isAuthenticated, authLoading, user, router])

  // Ambil artikel dari API
  useEffect(() => {
    const fetchArticles = async () => {
      if (!isAuthenticated || user?.role === 'admin') return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await apiClient.getArticles({
          page: currentPage,
          limit: articlesPerPage,
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchTerm || undefined
        })
        
        if (response.success) {
          setArticles(response.data.articles)
          setTotalArticles(response.data.total)
        } else {
          setError("Gagal mengambil artikel")
        }
      } catch (error) {
        console.error("Error mengambil artikel:", error)
        setError("Gagal mengambil artikel")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [currentPage, selectedCategory, searchTerm, isAuthenticated, user])

  // Handle pencarian dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const totalPages = Math.ceil(totalArticles / articlesPerPage)

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role === 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bar Navigasi Atas */}
      <nav className="bg-blue-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-900 transform rotate-45"></div>
            </div>
            <span className="text-white font-semibold">Logoipsum</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-white" />
            <UserDropdown 
              username={user?.username || "James Dean"} 
              avatar={user?.username?.charAt(0).toUpperCase() || "J"} 
            />
          </div>
        </div>
      </nav>

      {/* Header Utama */}
      <header className="hero-background px-6 py-12 relative min-h-[500px] flex items-center">
        {/* Overlay Background */}
        <div className="absolute inset-0 bg-blue-600 bg-opacity-80"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-blue-200 text-sm mb-2">Blog genzet</p>
              <h1 className="text-4xl font-bold text-white mb-2">
                The Journal : Design Resources, Interviews, and Industry News
              </h1>
              <p className="text-blue-200 text-lg mb-8">
                Your daily dose of design insights!
              </p>
              
              {/* Bar Pencarian dan Filter */}
              <div className="flex gap-4 max-w-2xl">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-white border-0">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari artikel"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
            
            {/* Foto Profil */}
            <div className="ml-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Jumlah Artikel */}
        <p className="text-gray-600 mb-8">Menampilkan: {articles.length} dari {totalArticles} artikel</p>

        {/* Pesan Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Tidak Ada Gambar</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{formatApiDate(article.published_at)}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex gap-2 mb-4">
                  {article.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => {
                    // Implementasi fungsi melihat artikel di sini
                    console.log('Lihat artikel:', article.id)
                  }}
                >
                  Baca Selengkapnya
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Paginasi */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt; Sebelumnya
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )
            })}
            
            {totalPages > 5 && (
              <span className="text-gray-500">...</span>
            )}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya &gt;
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 px-6 py-4 mt-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-900 transform rotate-45"></div>
            </div>
            <span className="text-white font-semibold">Logoipsum</span>
          </div>
          <p className="text-white text-sm">© 2005 Blog genzet. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
