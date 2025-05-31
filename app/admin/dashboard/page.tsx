import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ClientRedirect from '@/app/ClientRedirect/page';
import axios from 'axios'
import { getServerSession } from 'next-auth';
import React, { useEffect } from 'react'

interface BorrowRecord {
    id: string;
    userId: string;
    bookId: string;
    requestDate: string;
    dueDate: string;
    returnDate: string | null;
    borrowingTimeExtended: string | null;
    status: string;
    borrowDate: string;
    name: string;
    email: string;
    title: string;
    author: string;
    isbn: string;
}

const page = async () => {
    const session = await getServerSession(authOptions)


    try {
        const res: any = await axios.get('http://localhost:3000/api/users/history');
        const borrowRecords: BorrowRecord[] = res.data || [];

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'borrowed':
                    return 'bg-blue-900/30 text-blue-300 border-blue-500/50';
                case 'returned':
                    return 'bg-emerald-900/30 text-emerald-300 border-emerald-500/50';
                case 'overdue':
                    return 'bg-red-900/30 text-red-300 border-red-500/50';
                case 'extended':
                    return 'bg-orange-900/30 text-orange-300 border-orange-500/50';
                default:
                    return 'bg-gray-900/30 text-gray-300 border-gray-500/50';
            }
        };

        const getTimeRemaining = (dueDate: string, status: string) => {
            if (status.toLowerCase() === 'returned') return null;
            
            const due = new Date(dueDate);
            const now = new Date();
            const difference = due.getTime() - now.getTime();
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                return { text: `${days} days left`, isOverdue: false, isUrgent: days <= 3 };
            } else {
                const overdueDays = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));
                return { text: `${overdueDays} days overdue`, isOverdue: true, isUrgent: false };
            }
        };

        // Statistics
        const totalBorrows = borrowRecords.length;
        const activeBorrows = borrowRecords.filter(record => record.status.toLowerCase() === 'borrowed').length;
        const overdueBorrows = borrowRecords.filter(record => {
            const timeInfo = getTimeRemaining(record.dueDate, record.status);
            return timeInfo?.isOverdue;
        }).length;
        const returnedBooks = borrowRecords.filter(record => record.status.toLowerCase() === 'returned').length;

        return (
            <div className="min-h-screen bg-black p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">📚 Orchestria Admin</h1>
                                <p className="text-gray-400 text-lg">Library Management Dashboard</p>
                            </div>
                        </div>
                        <div className="h-1 w-40 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-900/50 border border-blue-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Borrows</p>
                                    <p className="text-2xl font-bold text-white">{totalBorrows}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-900/50 border border-emerald-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Active Borrows</p>
                                    <p className="text-2xl font-bold text-white">{activeBorrows}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-900/50 border border-red-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Overdue</p>
                                    <p className="text-2xl font-bold text-white">{overdueBorrows}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-900/50 border border-cyan-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Returned</p>
                                    <p className="text-2xl font-bold text-white">{returnedBooks}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Borrow Records Table */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                                </svg>
                                Borrowing History Records
                            </h2>
                            <p className="text-blue-100 mt-2">Complete overview of all library borrowing activities</p>
                        </div>

                        {borrowRecords.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700/50 border-b border-slate-600">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Book Details</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Dates</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Time Info</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {borrowRecords.map((record) => {
                                            const timeInfo = getTimeRemaining(record.dueDate, record.status);
                                            return (
                                                <tr key={record.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">{record.title || 'Book Title'}</p>
                                                                <p className="text-gray-400 text-sm">{record.author || 'Author Name'}</p>
                                                                <p className="text-gray-500 text-xs">ID: {record.bookId}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-white font-medium">{record.name || 'User Name'}</p>
                                                            <p className="text-gray-400 text-sm">{record.email || 'user@email.com'}</p>
                                                            <p className="text-gray-500 text-xs">ID: {record.userId}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                                                </svg>
                                                                <span className="text-gray-300 text-sm">{new Date(record.borrowDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                                                </svg>
                                                                <span className="text-gray-300 text-sm">{new Date(record.dueDate).toLocaleDateString()}</span>
                                                            </div>
                                                            {record.returnDate && (
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                                    </svg>
                                                                    <span className="text-gray-300 text-sm">{new Date(record.returnDate).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                                                {record.status.toUpperCase()}
                                                            </span>
                                                            {record.borrowingTimeExtended && (
                                                                <div className="flex items-center gap-1">
                                                                    <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                                                    </svg>
                                                                    <span className="text-orange-300 text-xs">Extended</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {timeInfo && (
                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                                                                timeInfo.isOverdue 
                                                                    ? 'bg-red-900/30 text-red-300' 
                                                                    : timeInfo.isUrgent 
                                                                        ? 'bg-orange-900/30 text-orange-300'
                                                                        : 'bg-emerald-900/30 text-emerald-300'
                                                            }`}>
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                                                </svg>
                                                                {timeInfo.text}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Borrowing Records</h3>
                                <p className="text-gray-500">No books have been borrowed yet. Records will appear here once users start borrowing books.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching borrow history:', error);
        return (
            <div className="min-h-screen bg-black p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h3>
                        <p className="text-gray-400">Failed to load borrowing history. Please try again later.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default page