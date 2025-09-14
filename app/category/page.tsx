"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDropdown } from "@/components/UserDropdown"
import { AdminSidebar } from "@/components/AdminSidebar"
import { UserSidebar } from "@/components/UserSidebar"
import { useAuth } from "@/contexts/AuthContext"

interface Category {
  id: string
  name: string
  created_at: string
}

export default function CategoryPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [totalCategories, setTotalCategories] = useState(25)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const categoriesPerPage = 10

  // Mock data for demonstration
  const mockCategories: Category[] = [
    { id: "1", name: "Technology", created_at: "April 13, 2025 10:56:12" },
    { id: "2", name: "Design", created_at: "April 13, 2025 10:56:12" },
    { id: "3", name: "Development", created_at: "April 13, 2025 10:56:12" },
    { id: "4", name: "AI", created_at: "April 13, 2025 10:56:12" },
    { id: "5", name: "Web3", created_at: "April 13, 2025 10:56:12" },
    { id: "6", name: "Technology", created_at: "April 13, 2025 10:56:12" },
    { id: "7", name: "Technology", created_at: "April 13, 2025 10:56:12" },
    { id: "8", name: "Technology", created_at: "April 13, 2025 10:56:12" },
    { id: "9", name: "Technology", created_at: "April 13, 2025 10:56:12" },
    { id: "10", name: "Technology", created_at: "April 13, 2025 10:56:12" },
  ]

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role !== 'admin') {
        router.push('/articles')
      }
    }
  }, [isAuthenticated, authLoading, user, router])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const filteredCategories = mockCategories.filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        
        setCategories(filteredCategories)
        setTotalCategories(filteredCategories.length)
      } catch (error) {
        console.error("Error loading categories:", error)
        setError("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadCategories()
    }
  }, [searchTerm, isAuthenticated])

  const totalPages = Math.ceil(totalCategories / categoriesPerPage)

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCategoryData: Category = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        created_at: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
      
      setCategories(prev => [newCategoryData, ...prev])
      setTotalCategories(prev => prev + 1)
      setNewCategory("")
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setEditCategoryName(category.name)
    setShowEditModal(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return
    
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: editCategoryName.trim() }
          : cat
      ))
      
      setShowEditModal(false)
      setEditingCategory(null)
      setEditCategoryName("")
    } catch (error) {
      console.error("Error updating category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category)
    setShowDeleteModal(true)
  }

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return
    
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id))
      setTotalCategories(prev => prev - 1)
      setShowDeleteModal(false)
      setDeletingCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {user?.role === 'admin' ? <AdminSidebar /> : <UserSidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Category</h1>
            <UserDropdown username={user?.username || "James Dean"} avatar={user?.username?.charAt(0).toUpperCase() || "J"} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Summary */}
          <div className="mb-6">
            <p className="text-gray-600">Total Category : {totalCategories}</p>
          </div>

          {/* Search and Add */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search Category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Categories Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            title="Edit"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900" 
                            title="Delete"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
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
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Category</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Input
                type="text"
                placeholder="Input Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddModal(false)
                  setNewCategory("")
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Category</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Input
                type="text"
                placeholder="Input Category"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingCategory(null)
                  setEditCategoryName("")
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleUpdateCategory}
                disabled={!editCategoryName.trim() || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Category</h2>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Delete category "{deletingCategory.name}"? This will remove it from master data permanently.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingCategory(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteCategory}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
