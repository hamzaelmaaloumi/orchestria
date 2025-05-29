'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Book{
    author: string,
    createdAt: string,
    id: string,
    isbn: string,
    publicationDate: string,
    publicationPlace: string,
    title: string,
}

const Book = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [query, setQuery] = useState('');

    useEffect(()=> {
        const fetchData = async () =>{
            try{
                const res = await axios.get('http://localhost:3000/api/books')
                console.log(res.data);
                setBooks(res.data)
                setFilteredBooks(res.data)
            }catch(error: any){
                console.log("this error happened ", error)
            }
        }

        fetchData()

    }, [])

    useEffect(()=> {{
            setFilteredBooks(books.filter(book => 
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase()) ||
                book.isbn.toLowerCase().includes(query.toLowerCase())
            ))
        }
    }, [query, books])

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Library Header Section */}
      <div className="relative overflow-hidden backdrop-blur-xl border-b border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                📚 Orchestria Digital Library
              </h1>
              <div className="h-1 w-64 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover your next literary adventure in our curated collection of digital treasures
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-600/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">{books.length} Books Available</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-600/50">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Digital Collection</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📖</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Browse Collection</h2>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="Search books by title, author, or ISBN..."
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>
      </div>
  
      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(139,92,246,0.15)] hover:scale-[1.03] hover:-translate-y-2"
            >
              {/* Decorative book spine effect */}
              <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-purple-500 via-blue-500 to-indigo-500 group-hover:w-3 transition-all duration-300 rounded-r-full"></div>
              
              {/* Ambient glow effects */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-400/10 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-all duration-700"></div>
              
              {/* Book icon */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 shadow-2xl border-2 border-purple-500/30 relative overflow-hidden group-hover:shadow-purple-500/30 transition-all duration-300 transform group-hover:rotate-3">
                    {/* Book details */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-purple-300/60"></div>
                    {/* Book lines */}
                    <div className="absolute top-6 left-2 right-2 space-y-1">
                      <div className="h-px bg-white/20"></div>
                      <div className="h-px bg-white/15 w-3/4"></div>
                      <div className="h-px bg-white/10 w-1/2"></div>
                    </div>
                  </div>
                  {/* Book shadow */}
                  <div className="absolute -bottom-2 left-1 right-1 h-3 bg-black/20 rounded-full blur-sm"></div>
                </div>
              </div>
              
              {/* Title */}
              <div className="mb-8 text-center">
                <h3 className="text-xl font-bold leading-tight text-gray-100 group-hover:text-white transition-all duration-300 min-h-[3rem] flex items-center justify-center">
                  {book.title}
                </h3>
                <div className="mt-3 w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto group-hover:w-24 group-hover:via-blue-400 transition-all duration-300"></div>
              </div>
              
              {/* Book details */}
              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1.5 rounded-full bg-purple-900/40 text-[10px] uppercase tracking-widest text-purple-300 font-semibold border border-purple-700/40">
                      Author
                    </span>
                  </div>
                  <span className="font-medium text-gray-200 text-sm leading-relaxed">{book.author}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                  </div>
                  <span className="font-mono text-xs text-gray-400 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-600/30">
                    {book.isbn}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="flex items-center gap-3 text-xs bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300 font-medium">
                      {new Date(book.publicationDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs bg-gray-800/30 rounded-lg p-3 border border-gray-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-300 font-medium truncate">{book.publicationPlace}</span>
                  </div>
                </div>
              </div>
              
              {/* Action button */}
              <div className="mt-8 flex justify-center">
                <Link 
                  href={`/books/${book.id}`} 
                  className="group/btn relative overflow-hidden px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-sm font-semibold tracking-wide border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-3 w-full justify-center"
                >
                  <span className="relative z-10">Explore Book</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  {/* Button glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredBooks.length === 0 && books.length > 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Books Found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse all books.</p>
            <button
              onClick={() => setQuery('')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}

        {filteredBooks.length === 0 && books.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Books Available</h3>
            <p className="text-gray-500">The library collection is currently being updated.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Book