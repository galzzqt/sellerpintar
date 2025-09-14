"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserDropdown } from "@/components/UserDropdown"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email || "",
        role: user.role
      })
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await updateProfile({
        username: formData.username,
        email: formData.email,
        role: formData.role
      })
      
      if (result.success) {
        setIsEditing(false)
      } else {
        setError(result.message || "Failed to update profile")
      }
    } catch (error) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email || "",
      role: user.role
    })
    setIsEditing(false)
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">Logoipsum</span>
            </div>
            <UserDropdown username={user.username} avatar={user.username.charAt(0).toUpperCase()} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
          
          {/* Avatar */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">{user.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* User Information Card */}
          <Card className="max-w-md mx-auto shadow-lg">
            <CardContent className="p-6 space-y-4">
              {/* Edit Button */}
              <div className="flex justify-end">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Username :</Label>
                {isEditing ? (
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-md px-3 py-2">
                    <span className="text-gray-800">{formData.username}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Email :</Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-md px-3 py-2">
                    <span className="text-gray-800">{formData.email || "No email provided"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Role :</Label>
                {isEditing ? (
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-md px-3 py-2">
                    <span className="text-gray-800">{formData.role}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <div className="mt-8">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
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
