import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Halaman beranda aplikasi SellerPintar
 * Menampilkan opsi navigasi ke login, registrasi, artikel, dan profil
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="M4.93 4.93l2.12 2.12"/><path d="M16.95 16.95l2.12 2.12"/><path d="M16.95 7.05l2.12-2.12"/><path d="M4.93 19.07l2.12-2.12"/><circle cx="12" cy="12" r="5"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Logoipsum</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Selamat Datang di SellerPintar</h2>
          <p className="text-gray-600">Pilih opsi untuk memulai</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5">
              Masuk
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button 
              variant="outline" 
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5"
            >
              Daftar
            </Button>
          </Link>
          <Link href="/articles" className="block">
            <Button 
              variant="outline" 
              className="w-full border-green-600 text-green-600 hover:bg-green-50 font-medium py-2.5"
            >
              Lihat Artikel
            </Button>
          </Link>
          <Link href="/user" className="block">
            <Button 
              variant="outline" 
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2.5"
            >
              Halaman User (Layout Blog)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
