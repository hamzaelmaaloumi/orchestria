'use client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


interface formData{
    isbn: string,
    title: string,
    author: string,
    publicationPlace?: string,
    publicationDate?: Date
}


const page = () => {    
    const [addSuccess, setAddSuccess] = useState(false)
    const [addFail, setAddFail] = useState('')
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateFail, setUpdateFail] = useState('')
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteFail, setDeleteFail] = useState('')

    const {register: registerAdd, handleSubmit: handleSubmitAdd, formState:{errors: errorsAdd}, reset: resetAdd} = useForm<formData>()
    const addBook = async (data: formData)=> {
        try{
            const res = await axios.post('/api/books/', data);
            if(res.data.success) setAddSuccess(true)
        }catch(error: any){
            if (error.response) {
                if (error.response.status === 400) {
                    setAddFail('ISBN already used, please choose another');
                } else {
                    setAddFail('Internal server error');
                }
            } else {
                setAddFail('Network error or no response from the server');
            }
        }
    }


    const {register: registerUpdate, handleSubmit: handleSubmitUpdate, formState:{errors: errorsUpdate}, reset: resetUpdate} = useForm<formData>()
    const updateBook = async (data: formData)=> {
        try{
            const res = await axios.put('/api/books/', data);
            if(res.data.success) setUpdateSuccess(true)
        }catch(error: any){
            if (error.response) {
                if (error.response.status === 404) {
                    setUpdateFail('Book with provided ISBN not found');
                } else {
                    setUpdateFail('Internal server error');
                }
            } else {
                setUpdateFail('Network error or no response from the server');
            }
        }
    }


    const {register: registerDelete, handleSubmit: handleSubmitDelete, formState:{errors: errorsDelete}, reset: resetDelete} = useForm<{isbn: string}>()
    const deleteBook = async (data: {isbn: string})=> {
        try{
            const res = await axios.delete(`/api/books/${data.isbn}`);
            if(res.data.success) setDeleteSuccess(true)
        }catch(error: any){
            if (error.response) {
                if (error.response.status === 404) {
                    setDeleteFail('Book with provided ISBN not found');
                } else {
                    setDeleteFail('Internal server error');
                }
            } else {
                setDeleteFail('Network error or no response from the server');
            }
        }
    }

    // Dismiss functions for alerts
    const dismissAddSuccess = () => setAddSuccess(false)
    const dismissAddFail = () => setAddFail('')
    const dismissUpdateSuccess = () => setUpdateSuccess(false)
    const dismissUpdateFail = () => setUpdateFail('')
    const dismissDeleteSuccess = () => setDeleteSuccess(false)
    const dismissDeleteFail = () => setDeleteFail('')

  return (
    <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4'>
                    📚 Orchestria Library Management
                </h1>
                <p className="text-gray-300 text-lg">Manage your literary collection with elegance</p>
                <div className="h-1 w-48 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Add Book Section */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl">📖</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Add New Book</h2>
                    </div>
                    
                    <form onSubmit={handleSubmitAdd(addBook)} className='space-y-4'>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">ISBN</label>
                            <input 
                                {...registerAdd('isbn', {required:true})} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter ISBN number"
                            />
                            {errorsAdd?.isbn?.type==='required' && <p className="text-red-400 text-sm">📌 ISBN is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Title</label>
                            <input 
                                {...registerAdd('title', {required:true})} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter book title"
                            />
                            {errorsAdd?.title?.type==='required' && <p className="text-red-400 text-sm">📌 Title is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Author</label>
                            <input 
                                {...registerAdd('author', {required:true})} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter author name"
                            />
                            {errorsAdd?.author?.type==='required' && <p className="text-red-400 text-sm">📌 Author is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Publication Place</label>
                            <input 
                                {...registerAdd('publicationPlace')} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter publication place"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Publication Date</label>
                            <input 
                                {...registerAdd('publicationDate')} 
                                type="date" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200'
                            />
                        </div>

                        <button 
                            type="submit" 
                            className='w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 mt-6'
                        >
                            ✨ Add Book to Library
                        </button>
                    </form>
                </div>

                {/* Update Book Section */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl">✏️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Update Book</h2>
                    </div>
                    
                    <form onSubmit={handleSubmitUpdate(updateBook)} className='space-y-4'>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">ISBN</label>
                            <input 
                                {...registerUpdate('isbn', {required:true})} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter ISBN to update"
                            />
                            {errorsUpdate?.isbn?.type==='required' && <p className="text-red-400 text-sm">📌 ISBN is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Title</label>
                            <input 
                                {...registerUpdate('title')} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter new title"
                            />
                            {errorsUpdate?.title?.type==='required' && <p className="text-red-400 text-sm">📌 Title is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Author</label>
                            <input 
                                {...registerUpdate('author')} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter new author"
                            />
                            {errorsUpdate?.author?.type==='required' && <p className="text-red-400 text-sm">📌 Author is required</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Publication Place</label>
                            <input 
                                {...registerUpdate('publicationPlace')} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter new publication place"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Publication Date</label>
                            <input 
                                {...registerUpdate('publicationDate')} 
                                type="date" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200'
                            />
                        </div>

                        <button 
                            type="submit" 
                            className='w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 mt-6'
                        >
                            🔄 Update Book Information
                        </button>
                    </form>
                </div>

                {/* Delete Book Section */}
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 hover:shadow-red-500/20 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl">🗑️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Remove Book</h2>
                    </div>
                    
                    <form onSubmit={handleSubmitDelete(deleteBook)} className='space-y-4'>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">ISBN</label>
                            <input 
                                {...registerDelete('isbn', {required:true})} 
                                type="text" 
                                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 text-white rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-200 placeholder-gray-400'
                                placeholder="Enter ISBN to delete"
                            />
                            {errorsDelete?.isbn?.type==='required' && <p className="text-red-400 text-sm">📌 ISBN is required</p>}
                        </div>

                        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mt-4">
                            <p className="text-red-300 text-sm">⚠️ This action cannot be undone. Please ensure you have the correct ISBN.</p>
                        </div>

                        <button 
                            type="submit" 
                            className='w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1 transition-all duration-300 mt-6'
                        >
                            🗑️ Remove from Library
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {/* Success/Error Modals */}
        {addSuccess && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-bounce">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-900/50 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                        <p className="text-gray-300 mb-6">Book has been successfully added to the library.</p>
                        <button 
                            onClick={dismissAddSuccess}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            Perfect! 👍
                        </button>
                    </div>
                </div>
            </div>
        )}

        {addFail && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">❌</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
                        <p className="text-gray-300 mb-6">{addFail}</p>
                        <button 
                            onClick={dismissAddFail}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            Got it 👌
                        </button>
                    </div>
                </div>
            </div>
        )}

        {updateSuccess && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-900/50 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🔄</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Updated!</h3>
                        <p className="text-gray-300 mb-6">Book information has been successfully updated.</p>
                        <button 
                            onClick={dismissUpdateSuccess}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            Excellent! ✨
                        </button>
                    </div>
                </div>
            </div>
        )}

        {updateFail !== '' && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Update Failed</h3>
                        <p className="text-gray-300 mb-6">{updateFail}</p>
                        <button 
                            onClick={dismissUpdateFail}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            Understood 📝
                        </button>
                    </div>
                </div>
            </div>
        )}

        {deleteSuccess && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-900/50 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🗑️</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Removed!</h3>
                        <p className="text-gray-300 mb-6">Book has been successfully removed from the library.</p>
                        <button 
                            onClick={dismissDeleteSuccess}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            Confirmed! 🎯
                        </button>
                    </div>
                </div>
            </div>
        )}

        {deleteFail !== '' && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50'>
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-900/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🚫</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Deletion Failed</h3>
                        <p className="text-gray-300 mb-6">{deleteFail}</p>
                        <button 
                            onClick={dismissDeleteFail}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
                        >
                            I see 👀
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default page


