"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserDropdown } from "@/components/UserDropdown"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, Article, formatApiDate } from "@/lib/api"

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const articleId = parseInt(params.id)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      if (!isAuthenticated) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const [articleResponse, relatedResponse] = await Promise.all([
          apiClient.getArticle(articleId),
          apiClient.getArticles({ limit: 3 })
        ])
        
        if (articleResponse.success) {
          setArticle(articleResponse.data)
        } else {
          setError("Article not found")
        }
        
        if (relatedResponse.success) {
          setRelatedArticles(relatedResponse.data.articles.filter(a => a.id !== articleId))
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        setError("Failed to load article")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [articleId, isAuthenticated])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Article Not Found"}</h1>
          <Link href="/articles">
            <Button>Back to Articles</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/articles">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                </div>
                <span className="font-bold text-blue-600">Logoipsum</span>
              </div>
            </div>
            <UserDropdown username="User" avatar="U" className="text-gray-700" />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Article Metadata */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {formatApiDate(article.published_at)} • Created by {article.author}
          </p>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {article.title}
        </h1>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">📄</span>
              </div>
              <p className="text-lg font-semibold">Hero Image</p>
              <p className="text-sm opacity-80">Designer working with Figma</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-none">
          {article.content ? (
            <div className="mb-8">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.description}
              </p>
              <p className="text-gray-500 mt-4">
                Full article content coming soon...
              </p>
            </div>
          )}
        </article>

        {/* Tags */}
        <div className="mb-12">
          <div className="flex gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <section className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Other articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {relatedArticle.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-2">{formatApiDate(relatedArticle.published_at)}</p>
                    <h4 className="font-bold text-lg mb-2 line-clamp-2">{relatedArticle.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{relatedArticle.description}</p>
                    <div className="flex gap-2">
                      {relatedArticle.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            </div>
            <span className="font-bold">Logoipsum</span>
          </div>
          <p className="text-blue-100">© 2025 Blog genzet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
