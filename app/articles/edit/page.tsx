"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Upload, Eye, X, Bold, Italic, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserDropdown } from "@/components/UserDropdown"
import { AdminSidebar } from "@/components/AdminSidebar"
import { UserSidebar } from "@/components/UserSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, Article } from "@/lib/api"

const categories = ["Technology", "Design", "Development", "AI", "Web3"]

function EditArticleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const articleId = searchParams.get('id')

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditArticleForm articleId={articleId} />
    </Suspense>
  )
}

function EditArticleForm({ articleId }: { articleId: string | null }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [hasExistingImage, setHasExistingImage] = useState(false)
  const [errors, setErrors] = useState({
    thumbnail: "",
    title: "",
    category: "",
    content: ""
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Load article data based on ID
  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        router.push('/articles')
        return
      }

      try {
        setIsLoading(true)
        const response = await apiClient.getArticle(parseInt(articleId))
        
        if (response.success && response.data) {
          const article = response.data
          setTitle(article.title)
          setCategory(article.category)
          
          // Get full content from articles.ts
          const fullContent = await getFullArticleContent(parseInt(articleId))
          setContent(fullContent)
          setWordCount(fullContent.trim().split(/\s+/).filter(word => word.length > 0).length)
          setHasExistingImage(!!article.image_url)
        } else {
          router.push('/articles')
        }
      } catch (error) {
        console.error('Error loading article:', error)
        router.push('/articles')
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [articleId, router])

  // Helper function to get full article content
  const getFullArticleContent = async (id: number): Promise<string> => {
    try {
      // Import the articles data dynamically
      const { articles } = await import('@/lib/articles')
      const article = articles.find(a => a.id === id)
      
      if (article && article.content) {
        // Combine introduction, sections, and conclusion
        let fullContent = article.content.introduction + '\n\n'
        
        article.content.sections.forEach(section => {
          fullContent += `## ${section.title}\n\n${section.content}\n\n`
        })
        
        if (article.content.conclusion) {
          fullContent += article.content.conclusion
        }
        
        return fullContent
      }
      
      return article?.description || ''
    } catch (error) {
      console.error('Error getting full content:', error)
      return ''
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setHasExistingImage(false)
      setErrors(prev => ({ ...prev, thumbnail: "" }))
    }
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setContent(text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
    setErrors(prev => ({ ...prev, content: "" }))
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setErrors(prev => ({ ...prev, title: "" }))
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setErrors(prev => ({ ...prev, category: "" }))
  }

  const handleDeleteImage = () => {
    setHasExistingImage(false)
    setSelectedFile(null)
  }

  const validateForm = () => {
    const newErrors = {
      thumbnail: (!selectedFile && !hasExistingImage) ? "Please enter picture" : "",
      title: !title.trim() ? "Please enter title" : "",
      category: !category ? "Please select category" : "",
      content: !content.trim() ? "Content field cannot be empty" : ""
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  const handlePreview = () => {
    if (title.trim() && content.trim()) {
      setShowPreview(true)
    } else {
      // Show validation errors if trying to preview without content
      validateForm()
    }
  }

  const handleUpload = async () => {
    if (validateForm() && articleId) {
      try {
        setIsSubmitting(true)
        
        // Prepare update data
        const updateData = {
          title,
          category,
          content,
          // Add other fields as needed
        }
        
        // Update article via API
        const response = await apiClient.updateArticle(parseInt(articleId), updateData)
        
        if (response.success) {
          alert("Article updated successfully!")
          router.push('/articles')
        } else {
          alert("Failed to update article. Please try again.")
        }
      } catch (error) {
        console.error('Error updating article:', error)
        alert("Failed to update article. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
            <UserDropdown username={user?.username || "James Dean"} avatar={user?.username?.charAt(0).toUpperCase() || "J"} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Navigation */}
          <div className="mb-6">
            <Link href="/articles" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-lg font-medium">Edit Articles</span>
            </Link>
          </div>

          {/* Form */}
          <div className="max-w-4xl">
            {/* Thumbnail Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnails</label>
              
              {hasExistingImage ? (
                <div className="space-y-4">
                  {/* Existing Image Preview */}
                  <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        Person working on computer
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                      Changes
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleDeleteImage}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
                  errors.thumbnail ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">Click to select files</p>
                      <p className="text-gray-500 text-sm">Support File Type: jpg or png</p>
                    </div>
                  </label>
                  {selectedFile && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>
              )}
            </div>

            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                type="text"
                placeholder="Input title"
                value={title}
                onChange={handleTitleChange}
                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className={`w-full ${errors.category ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                The existing category list can be seen in the{" "}
                <Link href="/category" className="text-blue-600 hover:underline">
                  category menu
                </Link>
              </p>
              {errors.category && (
                <p className="text-red-500 text-sm mt-2">{errors.category}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              
              {/* Toolbar */}
              <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-2 flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Undo className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Redo className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <AlignRight className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Text Area */}
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Type a content..."
                className={`w-full h-64 p-4 border border-t-0 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.content ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              
              {/* Word Count */}
              <div className="mt-2 text-sm text-gray-500">
                {wordCount} Words
              </div>
              
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleUpload}
                disabled={isSubmitting}
              >
                <Upload className="w-4 h-4" />
                {isSubmitting ? "Updating..." : "Upload"}
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Article Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Thumbnail Preview */}
              {(selectedFile || hasExistingImage) && (
                <div className="mb-6">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Article thumbnail"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-center px-4">
                        Person working on computer
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Article Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

              {/* Category */}
              {category && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {category}
                  </span>
                </div>
              )}

              {/* Article Content */}
              <div className="prose max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: content.replace(/\n/g, '<br>') 
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setShowPreview(false)
                  handleUpload()
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Update Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EditArticlePage() {
  return (
    <Suspense fallback={<div>Loading article editor...</div>}>
      <EditArticleContent />
    </Suspense>
  )
}
