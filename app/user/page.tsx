import { Bell, Search, User } from 'lucide-react'

export default function UserPage() {
  const articles = [
    {
      id: 1,
      title: "Cybersecurity Essentials Every Developer Should Know",
      date: "April 13, 2025",
      description: "Learn the fundamental security practices that every developer should implement to protect their applications and data from cyber threats.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 2,
      title: "The Future of Work: Remote-First Teams and Digital Tools",
      date: "April 10, 2005",
      description: "Explore how remote work is reshaping the modern workplace and the digital tools that are making distributed teams more effective than ever.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 3,
      title: "Design Systems: Why Your Team Needs One in 2025",
      date: "April 9, 2005",
      description: "Discover the benefits of implementing a comprehensive design system and how it can streamline your team's workflow and improve consistency.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 4,
      title: "Web3 and the Decentralized Internet: What You Need to Know",
      date: "April 7, 2005",
      description: "Get up to speed with Web3 technologies and understand how the decentralized internet is changing the way we interact with digital services.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 5,
      title: "Debugging Like a Pro: Tools & Techniques for Faster Fixes",
      date: "April 4, 2005",
      description: "Master the art of debugging with proven techniques and modern tools that will help you identify and fix issues more efficiently.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 6,
      title: "Accessibility in Design: More Than Just Compliance",
      date: "April 2, 2005",
      description: "Learn why accessibility should be a core consideration in your design process, not just a compliance requirement.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 7,
      title: "Figma's New Dev Mode: A Game-Changer for Designers & Developers",
      date: "April 21, 2005",
      description: "Explore how Figma's new Dev Mode is bridging the gap between design and development, making collaboration more seamless.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 8,
      title: "How AI Is Changing the Game in Front-End Development",
      date: "April 18, 2005",
      description: "Discover how artificial intelligence is revolutionizing front-end development and what it means for developers.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    },
    {
      id: 9,
      title: "10 UI Trends Dominating 2025",
      date: "April 15, 2005",
      description: "Stay ahead of the curve with these emerging UI trends that are shaping the future of user interface design.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
      tags: ["Technology", "Design"]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-900 transform rotate-45"></div>
            </div>
            <span className="text-white font-semibold">Logoipsum</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-white" />
            <span className="text-white">James Dean</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Header */}
      <header className="bg-blue-600 px-6 py-12 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-blue-200 text-sm mb-2">Blog genzet</p>
              <h1 className="text-4xl font-bold text-white mb-2">
                The Journal : Design Resources, Interviews, and Industry News
              </h1>
              <p className="text-blue-200 text-lg mb-8">
                Your daily dose of design insights!
              </p>
              
              {/* Search and Filter Bar */}
              <div className="flex gap-4 max-w-2xl">
                <select className="px-4 py-3 rounded-lg border-0 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option>Select category</option>
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Development</option>
                </select>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
            
            {/* Profile Picture */}
            <div className="ml-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Article Count */}
        <p className="text-gray-600 mb-8">Showing: 20 of 240 articles</p>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            &lt; Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            2
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            Next &gt;
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 px-6 py-4 mt-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-900 transform rotate-45"></div>
            </div>
            <span className="text-white font-semibold">Logoipsum</span>
          </div>
          <p className="text-white text-sm">© 2005 Blog genzet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
