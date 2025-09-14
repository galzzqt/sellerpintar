"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Props untuk komponen UserDropdown
 */
interface UserDropdownProps {
  username: string
  avatar: string
  className?: string
}

/**
 * Komponen dropdown untuk menu profil pengguna
 * Menampilkan opsi "Akun Saya" dan "Keluar"
 */
export function UserDropdown({ username, avatar, className }: UserDropdownProps) {
  const router = useRouter()
  const { logout } = useAuth()

  /**
   * Menangani proses logout pengguna
   */
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-3 hover:bg-transparent p-0 transition-colors ${className}`}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border border-gray-400">
            <span className="text-gray-600 font-medium text-sm">{avatar}</span>
          </div>
          <span className="font-medium text-white underline">{username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-white border-0 shadow-lg rounded-lg p-1"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuItem asChild>
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer rounded-sm text-sm"
          >
            Akun Saya
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-200 my-1" />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer rounded-sm text-sm"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
