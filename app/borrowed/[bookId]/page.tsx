'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';



interface BorrowRecord {
    id: string,
    userId: string,
    bookId: string,
    requestDate: string,
    dueDate: string,
    returnDate: string | null,
    borrowingTimeExtended: string | null,
    status: string,
    borrowDate: string,
}



const page = ({params: {bookId}}: {params: {bookId: string}}) => {
    const {status, data: session} = useSession();
    const [alert, setAlert] = useState<string>("")
    const [pros, setPros] = useState<string>("")
    const [borrowRecord, setBorrowRecord] = useState<BorrowRecord | null>(null);
    const [bookDetails, setBookDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [extending, setExtending] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    // Fetch borrow record
                    const borrowRes = await axios.post(`http://localhost:3000/api/borrow/borrowed/fgdf`, {
                        userId: session.user.id, 
                        bookId: bookId
                    });
                    setBorrowRecord(borrowRes.data[0]);

                    // Fetch book details
                    const bookRes = await axios.get(`http://localhost:3000/api/books/${bookId}`);
                    console.log("---------------------->", bookRes.data)
                    setBookDetails(bookRes.data[0]);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setPros('Failed to load book details');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [session, bookId]);

    const Extend = async (days: number) => {
        setExtending(true);
        try{
            const data = {userId: session?.user?.id, bookId: bookId, extendDays: days}
            const res = await axios.post(`http://localhost:3000/api/borrow/extend`, data);
            if(res.data.success === "book extended successfully") {
                setAlert("Book loan period extended successfully!");
                // Refresh borrow record
                const borrowRes = await axios.post(`http://localhost:3000/api/borrow/borrowed/fgdf`, {
                    userId: session?.user?.id, 
                    bookId: bookId
                });
                setBorrowRecord(borrowRes.data[0]);
            }
        }catch(error:any){
            if(error.response?.data?.message === 'book loan period had been already renewed') {
                setPros("This book's loan period has already been renewed once");
            } else {
                setPros("Failed to extend loan period. Please try again.");
            }
            console.log(error)
        } finally {
            setExtending(false);
            setShowConfirmDialog(false);
        }
    }

    const handleExtendRequest = (days: number) => {
        setSelectedDays(days);
        setShowConfirmDialog(true);
    };

    const getTimeRemaining = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const difference = due.getTime() - now.getTime();
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (days > 0) {
                return { text: `${days}d ${hours}h left`, isOverdue: false, isUrgent: days <= 3 };
            } else if (hours > 0) {
                return { text: `${hours}h left`, isOverdue: false, isUrgent: true };
            } else {
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                return { text: `${minutes}m left`, isOverdue: false, isUrgent: true };
            }
        } else {
            const overdueDays = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));
            return { text: `${overdueDays} days overdue`, isOverdue: true, isUrgent: false };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-pulse mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!borrowRecord || !bookDetails) {
        return (
            <div className="min-h-screen bg-black p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Book Not Found</h3>
                        <p className="text-gray-400 mb-6">The requested book or borrow record could not be found.</p>
                        <Link href="/borrowed" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200">
                            ← Back to My Library
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const timeRemaining = getTimeRemaining(borrowRecord.dueDate);

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/borrowed" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                        </svg>
                        Back to My Library
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2">📖 Extend Loan Period</h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
                    <p className="text-gray-400 text-lg">Extend your borrowing time for this book</p>
                </div>

                {/* Alert Messages */}
                {alert && (
                    <div className="bg-emerald-900/20 border border-emerald-500 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <p className="text-emerald-300 font-medium">{alert}</p>
                        </div>
                    </div>
                )}

                {pros && (
                    <div className="bg-orange-900/20 border border-orange-500 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            <p className="text-orange-300 font-medium">{pros}</p>
                        </div>
                    </div>
                )}

                {/* Book Details Card */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-8">
                    {/* Book Header */}
                    <div className={`bg-gradient-to-r p-6 ${
                        timeRemaining.isOverdue 
                            ? 'from-red-600 to-red-700' 
                            : timeRemaining.isUrgent 
                                ? 'from-orange-600 to-yellow-600'
                                : 'from-blue-600 to-cyan-600'
                    }`}>
                        <div className="flex items-start gap-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-shrink-0">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{bookDetails.title}</h2>
                                <p className="text-white/80 text-lg mb-2">by {bookDetails.author}</p>
                                <div className="flex items-center gap-4">
                                    <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                                        {bookDetails.genre}
                                    </span>
                                    <span className="text-white/70 text-sm">
                                        ISBN: {bookDetails.isbn}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                                timeRemaining.isOverdue 
                                    ? 'bg-red-900/80 text-red-200 border border-red-400' 
                                    : timeRemaining.isUrgent 
                                        ? 'bg-orange-900/80 text-orange-200 border border-orange-400'
                                        : 'bg-blue-900/80 text-blue-200 border border-blue-400'
                            }`}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                                {timeRemaining.text}
                            </div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center border border-blue-700">
                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Borrowed Date</p>
                                    <p className="text-white font-medium">{new Date(borrowRecord.borrowDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                                    timeRemaining.isOverdue 
                                        ? 'bg-red-900/50 border-red-700' 
                                        : timeRemaining.isUrgent 
                                            ? 'bg-orange-900/50 border-orange-700'
                                            : 'bg-emerald-900/50 border-emerald-700'
                                }`}>
                                    <svg className={`w-6 h-6 ${
                                        timeRemaining.isOverdue ? 'text-red-400' : timeRemaining.isUrgent ? 'text-orange-400' : 'text-emerald-400'
                                    }`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Due Date</p>
                                    <p className={`font-medium ${
                                        timeRemaining.isOverdue ? 'text-red-300' : timeRemaining.isUrgent ? 'text-orange-300' : 'text-white'
                                    }`}>
                                        {new Date(borrowRecord.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center border border-purple-700">
                                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Status</p>
                                    <p className="text-emerald-300 font-medium">{borrowRecord.status.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extension Options */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        Extend Loan Period
                    </h3>
                    
                    <p className="text-gray-400 mb-8">Choose how many additional days you'd like to extend your loan period. Extensions are subject to library policy.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[3, 7, 10].map((days) => (
                            <div key={days} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 group">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <span className="text-2xl font-bold text-white">{days}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">{days} Days</h4>
                                    <p className="text-gray-400 text-sm">
                                        New due date: {new Date(new Date(borrowRecord.dueDate).getTime() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleExtendRequest(days)}
                                    disabled={extending || !!borrowRecord.borrowingTimeExtended}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {extending ? 'Processing...' : `Extend ${days} Days`}
                                </button>
                            </div>
                        ))}
                    </div>

                    {borrowRecord.borrowingTimeExtended && (
                        <div className="mt-6 bg-orange-900/20 border border-orange-500 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-orange-300 text-sm">
                                    <strong>Note:</strong> This loan has already been extended once. Further extensions may not be available.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Confirm Extension</h3>
                                <p className="text-gray-400">
                                    Are you sure you want to extend your loan period by <strong className="text-cyan-400">{selectedDays} days</strong>?
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    New due date will be: <strong>{new Date(new Date(borrowRecord.dueDate).getTime() + selectedDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => Extend(selectedDays)}
                                    disabled={extending}
                                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {extending ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page