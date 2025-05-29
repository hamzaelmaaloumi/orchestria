'use client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Link from 'next/link'

const page = ({params: {bookId}}: {params: {bookId: string}}) => {
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isReturned, setIsReturned] = useState(false);
    const {status, data: session} = useSession();

    const Return = async () => {
        setIsLoading(true);
        setError("");
        try{
            const res = await axios.put('/api/borrow/return', {userId: session?.user.id, bookId: bookId});
            if(res.data.success) {
                setAlert('Book returned successfully! Please bring the physical copy to the library within 24 hours.');
                setIsReturned(true);
                setShowConfirmation(false);
            }
        }catch(error: any){
            console.log(" ---------->", error.response?.data?.message || error.message);
            setError("Internal server error, please try again later");
        } finally {
            setIsLoading(false);
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link 
                            href="/borrowed"
                            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-all duration-200 border border-slate-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">📚 Return Book</h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-gray-400 text-lg">Complete your book return process</p>
                </div>

                {/* Success State */}
                {isReturned ? (
                    <div className="bg-slate-800 rounded-2xl p-8 border border-green-500/50">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500">
                                <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-green-400 mb-4">Return Successful!</h2>
                            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
                                <p className="text-green-300 text-lg font-medium">{alert}</p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Link 
                                    href="/borrowed"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                                >
                                    View My Books
                                </Link>
                                <Link 
                                    href="/books"
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600"
                                >
                                    Browse Library
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Warning Card */}
                        <div className="bg-slate-800 rounded-2xl border border-red-500/50 overflow-hidden mb-6">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">⚠️ Important Notice</h2>
                                        <p className="text-white/90 font-medium">Please read carefully before proceeding</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
                                    <h3 className="text-red-300 font-bold text-lg mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                        Physical Return Required
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        By clicking the return button, you acknowledge that you understand the following requirements:
                                    </p>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">•</span>
                                            You must bring the physical book copy to the library within <strong className="text-red-300">24 hours</strong>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">•</span>
                                            Failure to return the physical copy may result in <strong className="text-red-300">legal action</strong>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">•</span>
                                            The book must be returned in the same condition as borrowed
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center border border-blue-700">
                                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Book ID: #{bookId.slice(-8)}</p>
                                            <p className="text-gray-400 text-sm">This action will mark this book as returned in our system</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                            </svg>
                                            <p className="text-red-300 font-medium">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Link 
                                        href="/borrowed"
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 text-center border border-slate-600"
                                    >
                                        Cancel & Go Back
                                    </Link>
                                    <button 
                                        onClick={() => setShowConfirmation(true)}
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none"
                                    >
                                        {isLoading ? 'Processing...' : 'I Acknowledge & Return Book'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-red-500/50 max-w-md w-full">
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-2xl">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    Final Confirmation
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-300 mb-6">
                                    Are you absolutely sure you want to return this book? This action cannot be undone, and you must bring the physical copy to the library within 24 hours.
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowConfirmation(false)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                                                                onClick={Return}
                                                                                disabled={isLoading}
                                                                                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200"
                                                                            >
                                                                                {isLoading ? 'Processing...' : 'Yes, Return Book'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        
                                        export default page;