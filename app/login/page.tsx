"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShipWheel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // All users go to /articles page, not admin-specific page
      router.push('/articles')
    }
  }, [isAuthenticated, user, router])

  // Handle redirect after successful login
  useEffect(() => {
    if (loginSuccess && user) {
      // All users go to /articles page
      router.push('/articles')
    }
  }, [loginSuccess, user, router])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      })
      
      if (result.success) {
        setLoginSuccess(true)
      } else {
        setErrors({ general: result.message || "Login failed. Please try again." })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
              <ShipWheel className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Logoipsum</h1>
          </div>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Input username"
                value={formData.username}
                onChange={handleInputChange}
                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Input password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
