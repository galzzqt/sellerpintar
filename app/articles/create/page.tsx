"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Eye, X, Bold, Italic, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo } from "lucide-react"
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

const categories = ["Technology", "Design", "Development", "AI", "Web3"]

export default function CreateArticlePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState({
    thumbnail: "",
    title: "",
    category: "",
    content: ""
  })
  const [showPreview, setShowPreview] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
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

  const validateForm = () => {
    const newErrors = {
      thumbnail: !selectedFile ? "Please enter picture" : "",
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

  const handleUpload = () => {
    if (validateForm()) {
      // Handle article upload logic here
      console.log("Uploading article:", { title, category, content, selectedFile })
      
      // Simulate upload process
      setTimeout(() => {
        alert("Article uploaded successfully!")
        router.push('/articles')
      }, 1000)
    }
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
              <span className="text-lg font-medium">Create Articles</span>
            </Link>
          </div>

          {/* Form */}
          <div className="max-w-4xl">
            {/* Thumbnail Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnails</label>
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
                The existing category list can be seen in the category menu
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
              >
                <Upload className="w-4 h-4" />
                Upload
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
              {selectedFile && (
                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Article thumbnail"
                    className="w-full h-64 object-cover rounded-lg"
                  />
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
                Upload Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
