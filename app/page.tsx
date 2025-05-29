import { getServerSession } from "next-auth";
import Link from "next/link";
import { resolve } from "path";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                Orchestria
              </h1>
              <div className="h-1.5 w-80 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full mx-auto mb-8"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Your Digital Library Symphony
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Experience the harmony of knowledge and technology. Discover, manage, and explore 
              your literary collection in a beautifully orchestrated digital environment.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/books" 
                className="group relative overflow-hidden px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-lg font-semibold tracking-wide border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-3"
              >
                <span className="relative z-10">Explore Library</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {session?.user?.email === 'admin@orchestria.com' && (
                <Link 
                  href="/admin/managebook" 
                  className="group relative overflow-hidden px-10 py-4 rounded-xl bg-gray-800/80 text-white text-lg font-semibold tracking-wide border border-gray-600/50 hover:border-gray-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/25 flex items-center gap-3"
                >
                  <span className="relative z-10">Admin Panel</span>
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Library Features</h3>
          <p className="text-gray-400 text-lg">Everything you need for your digital library management</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Browse Books */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(59,130,246,0.15)] hover:scale-105">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Browse Collection</h4>
              <p className="text-gray-400 leading-relaxed">Explore our vast digital library with beautiful, organized book displays and detailed information.</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(139,92,246,0.15)] hover:scale-105">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-400/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔍</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart Search</h4>
              <p className="text-gray-400 leading-relaxed">Find exactly what you're looking for with intelligent search and filtering capabilities.</p>
            </div>
          </div>

          {/* Book Details & Reading */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 hover:border-green-400/50 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(34,197,94,0.15)] hover:scale-105">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📖</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Rich Book Details</h4>
              <p className="text-gray-400 leading-relaxed">Dive deep into comprehensive book information with publication details, author insights, and more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-y border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Digital
              </div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Library Experience</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Modern
              </div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Interface Design</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Seamless
              </div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Book Management</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-8 py-16 text-center">
        <div className="mb-8">
          <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome to Orchestria
          </h4>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Where every book finds its perfect note in your personal library symphony.
          </p>
        </div>
        
        {!session && (
          <div className="text-gray-500 text-sm">
            Please sign in to access the full library features
          </div>
        )}
      </div>
    </div>
  );
}
