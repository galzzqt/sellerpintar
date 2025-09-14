"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, type Article as ApiArticle, type Category } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function AdminArticlesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Role guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login")
      } else if (user?.role !== "admin") {
        router.replace("/articles")
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [items, setItems] = useState<ApiArticle[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
    image_url: "",
    tags: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await apiClient.getArticles({ page, limit, search })
      if (res.success) {
        setItems(res.data.articles)
        setTotal(res.data.total)
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load articles")
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await apiClient.getCategories()
      if (res.success) {
        setCategories(res.data.categories)
      }
    } catch (e: any) {
      console.error("Failed to load categories:", e)
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      load()
      loadCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, user?.role])

  // Update form category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(prev => ({ ...prev, category: categories[0].name }))
    }
  }, [categories, form.category])

  const resetForm = () => {
    setForm({
      id: 0,
      title: "",
      description: "",
      content: "",
      author: user?.username || "Admin",
      category: categories.length > 0 ? categories[0].name : "Technology",
      image_url: "",
      tags: "",
    })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(null)
      setLoading(true)
      const tags = form.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)

      if (editingId) {
        const res = await apiClient.updateArticle(editingId, {
          title: form.title,
          description: form.description,
          content: form.content,
          author: form.author,
          category: form.category,
          image_url: form.image_url,
          tags,
        })
        if (!res.success) throw new Error(res.message || "Update failed")
        setSuccess("Article updated")
      } else {
        const res = await apiClient.createArticle({
          title: form.title,
          description: form.description,
          content: form.content,
          author: form.author,
          category: form.category,
          image_url: form.image_url,
          tags,
        })
        if (!res.success) throw new Error(res.message || "Create failed")
        setSuccess("Article created")
      }
      resetForm()
      await load()
    } catch (e: any) {
      setError(e?.message || "Submit failed")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (a: ApiArticle) => {
    setEditingId(a.id)
    setForm({
      id: a.id,
      title: a.title,
      description: a.description,
      content: String(a.content || ""),
      author: a.author,
      category: a.category,
      image_url: a.image_url || "",
      tags: (a.tags || []).join(", "),
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this article?")) return
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteArticle(id)
      await load()
    } catch (e: any) {
      setError(e?.message || "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || user?.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/articles')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Admin - Manage Articles</h1>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">{editingId ? "Edit Article" : "Create Article"}</h2>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-3 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-3 text-sm text-green-600">{success}</div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="content">Content (intro)</Label>
                <Input id="content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={loading}>{editingId ? "Update" : "Create"}</Button>
                {editingId && (
                  <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Articles</h2>
              <div className="flex gap-2">
                <Input placeholder="Search title/description" value={search} onChange={e => { setPage(1); setSearch(e.target.value) }} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Author</th>
                    <th className="py-2">Published</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(a => (
                    <tr key={a.id} className="border-b">
                      <td className="py-2 pr-3">{a.title}</td>
                      <td className="py-2 pr-3">{a.category}</td>
                      <td className="py-2 pr-3">{a.author}</td>
                      <td className="py-2 pr-3">{a.published_at}</td>
                      <td className="py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="secondary" onClick={() => handleEdit(a)}>Edit</Button>
                          <Button variant="destructive" onClick={() => handleDelete(a.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">Page {page} / {pages}</span>
              <div className="flex gap-2">
                <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                <Button variant="secondary" disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


