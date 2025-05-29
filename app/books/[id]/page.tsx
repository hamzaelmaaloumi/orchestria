'use client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'


interface Book{
    author: string,
    createdAt: string,
    id: string,
    isbn: string,
    publicationDate: string,
    publicationPlace: string,
    title: string
}


const page = ({params: {id}}: {params: {id: string}}) => {
    const {status, data: session} = useSession();
    const [booking, setBooking] = useState("");
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [cancel, setCancel] = useState(false)

    const [book, setBook] = useState<Book>({
        author: "",
        createdAt: "",
        id: "",
        isbn: "",
        publicationDate: "",
        publicationPlace: "",
        title: ""
    })

    useEffect(()=> {
        const check = async () => {
            setLoad(true)
            try{
                const data = {userId : session?.user?.id, bookId: book.id}
                const res = await axios.post(`http://localhost:3000/api/borrow/status/`, data)
                if(res.data.success){
                    if(res.data.success === "book already requested") { setBooking("request"); setCancel(true) }
                    if(res.data.success === "book already borrowed")   setBooking("borrow")
                    if(res.data.success === "book is fresh") setBooking("")
                      console.log(res.data.success)
                    }

            }catch(error: any){
                console.log("------------->: ", error.response.data)
                console.log("userId: ", session?.user?.id)
                console.log("bookId: ", book.id)
            }finally{
              setLoad(false);
            }
        }

        check()

    },[session?.user?.id, book.id])

    useEffect(()=> {
        const fetchData = async () =>{
          setLoad(true)
            try{
                const res = await axios.get(`http://localhost:3000/api/books/${id}`)
                setBook(res.data[0])
            }catch(error: any){
                console.log("this error happened ", error)
            }finally{
              setLoad(false)
            }
        }

        fetchData()

    }, [])

    if(load){
      return (
        <div className='fixed inset-0 flex justify-center items-center'>
            <svg fill="currentColor" viewBox="0 0 1792 1792" className="text-green-500 w-10 h-10 animate-spin"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
            </svg>
        </div>
    )
    }

    const borrowBook = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try{
            const Data = {userId : session?.user?.id, bookId: book.id}
            const res: any = await axios.post('http://localhost:3000/api/borrow', Data)
            if(res.data.success){
                if(res.data.success === "book requested successfully"){ 
                    setBooking("request"); 
                    setCancel(true);
                    setSuccessMessage("You have been added to the waiting list. The book is currently borrowed by someone else. We will notify you as soon as it becomes available.");
                }
                if (res.data.success === "book borrowed successfully") {
                    setBooking("borrow");
                    setSuccessMessage("You have successfully borrowed the book! Please visit the library to collect your copy.");
                }
            }
        } catch(error: any){
            setError("Failed to borrow book. Please try again.");
            console.log("borrowing error: ",error)
        } finally {
            setLoading(false);
        }
    }


    const cancelRequest = async () => {
        try{
            const Datas = {userId : session?.user?.id, bookId: book.id}
            const res = await axios.delete(`http://localhost:3000/api/borrow/cancel/`, {data: Datas})
            if(res.data.success){
                setCancel(false); 
            }
        }catch(error: any){
            console.log("cancelling error:  ", error)
        }
    }






return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Orchestria Library</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>
  
        {/* Book Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-start gap-6">
              {/* Book Icon/Placeholder */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-shrink-0">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              
              {/* Title and Author */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 leading-tight">{book.title}</h2>
                <p className="text-blue-100 text-lg font-medium">by {book.author}</p>
              </div>
            </div>
          </div>
  
          {/* Details Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Publication Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Publication Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center border border-blue-700">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Publication Date</p>
                      <p className="text-gray-100 font-semibold">{new Date(book.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-900/50 rounded-lg flex items-center justify-center border border-orange-700">
                      <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Publication Place</p>
                      <p className="text-gray-100 font-semibold">{book.publicationPlace}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Catalog Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  Catalog Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center border border-green-700">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">ISBN</p>
                      <p className="text-gray-100 font-semibold font-mono">{book.isbn}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-900/50 rounded-lg flex items-center justify-center border border-indigo-700">
                      <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Added to Library</p>
                      <p className="text-gray-100 font-semibold">{new Date(book.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-600">
              <div className="flex flex-wrap gap-4">
                <button
                    onClick={borrowBook}
                    disabled={loading || !session || booking === "request" || booking === "borrow"}
                    className={`${!loading && (booking === "request" || booking === "borrow") ? 'bg-slate-700 border-2 border-blue-600' : 'bg-blue-600 text-white'} hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                ${loading || !session ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading
                        ? 'Processing...'
                        : !session
                            ? 'Sign in to Borrow'
                            : booking === "request"
                                ? 'Book requested'
                                : booking === "borrow"
                                    ? 'Book borrowed'
                                    : 'Borrow Book'
                    }
                </button>
                <button className="bg-slate-700 border-2 border-blue-500/30 hover:border-blue-400/50 text-blue-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-600">
                  Add to Wishlist
                </button>
                <button className="bg-slate-700 border-2 border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-600">
                  Share
                </button>
                {cancel && <button onClick={()=> cancelRequest()} className='px-6 py-3 bg-red-500 hover:bg-red-700'>Cancel</button>}
              </div>
              {error && <div className="text-red-400 mt-4">{error}</div>}
              {successMessage && <div className="text-green-400 mt-4">{successMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page