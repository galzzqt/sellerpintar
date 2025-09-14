"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, FolderOpen, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Props untuk komponen AdminSidebar
 */
interface AdminSidebarProps {
  className?: string
}

/**
 * Komponen sidebar untuk admin
 * Menampilkan navigasi ke halaman artikel dan kategori
 */
export function AdminSidebar({ className = "" }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  // Item navigasi untuk sidebar admin
  const navigationItems = [
    {
      name: "Artikel",
      href: "/articles",
      icon: FileText,
      isActive: pathname.startsWith("/articles")
    },
    {
      name: "Kategori",
      href: "/category",
      icon: FolderOpen,
      isActive: pathname === "/category"
    }
  ]

  return (
    <div className={`bg-blue-600 text-white h-screen w-64 flex flex-col ${className}`}>
      {/* Logo */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold">Logoipsum</span>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.isActive
                      ? "bg-blue-500 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Tombol Keluar */}
      <div className="p-4 border-t border-blue-500">
        <button 
          onClick={() => {
            logout()
            router.push('/login')
          }}
          className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  )
}
