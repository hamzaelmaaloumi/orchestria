import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
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
    title: string
}

const page = async () => {
    const session = await getServerSession(authOptions)
    
    let BorrowRecord: BorrowRecord[] = [];
    let error = null;



    try {
        if (session?.user?.id) {
            const response = await axios.get(`http://localhost:3000/api/borrow/borrowed/${session.user.id}`)
            BorrowRecord = response.data;
        }
    } catch (err) {
        error = 'Failed to fetch borrowed books';
        console.error('Error fetching borrowed books:', err);
    }
        
    



    // Calculate library stats
    const now = new Date();
    const overdueBooks = BorrowRecord.filter(BorrowRecord => new Date(BorrowRecord.dueDate) < now);
    const dueSoonBooks = BorrowRecord.filter(BorrowRecord => {
        const daysLeft = Math.ceil((new Date(BorrowRecord.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3 && daysLeft >= 0;
    });

    // Helper function to calculate time remaining
    const getTimeRemaining = (dueDate: string) => {
        const due = new Date(dueDate);
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

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">📚 My Library</h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
                    <p className="text-gray-400 text-lg">Track your borrowed books and manage returns</p>
                </div>

                {/* Enhanced Stats Bar */}
                <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center border border-blue-700">
                                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{BorrowRecord.length}</p>
                                <p className="text-gray-400 text-sm">Books Borrowed</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-900/50 rounded-xl flex items-center justify-center border border-orange-700">
                                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{dueSoonBooks.length}</p>
                                <p className="text-gray-400 text-sm">Due Soon</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-900/50 rounded-xl flex items-center justify-center border border-red-700">
                                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{overdueBooks.length}</p>
                                <p className="text-gray-400 text-sm">Overdue</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center border border-emerald-700">
                                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">Active</p>
                                <p className="text-gray-400 text-sm">Library Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Books</h3>
                        <p className="text-gray-400">{error}</p>
                    </div>
                ) : BorrowRecord.length === 0 ? (
                    <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
                        <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-300 mb-3">No Borrowed Books</h3>
                        <p className="text-gray-400 mb-6">You haven't borrowed any books yet. Start exploring our collection!</p>
                        <a 
                            href="/books" 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            </svg>
                            Browse Books
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BorrowRecord.map((book) => {
                            const timeRemaining = getTimeRemaining(book.dueDate);
                            const cardBorderClass = timeRemaining.isOverdue 
                                ? 'border-red-500/50' 
                                : timeRemaining.isUrgent 
                                    ? 'border-orange-500/50' 
                                    : 'border-slate-700';
                            const headerGradientClass = timeRemaining.isOverdue
                                ? 'from-red-600 to-red-700'
                                : timeRemaining.isUrgent
                                    ? 'from-orange-600 to-yellow-600'
                                    : 'from-blue-600 to-cyan-600';

                            return (
                                <div key={book.id} className={`bg-slate-800 rounded-2xl border overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group relative ${cardBorderClass}`}>
                                    {/* Status Badge and Timer */}
                                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                        <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                            timeRemaining.isOverdue 
                                                ? 'bg-red-900/80 text-red-200 border border-red-500' 
                                                : timeRemaining.isUrgent 
                                                    ? 'bg-orange-900/80 text-orange-200 border border-orange-500'
                                                    : 'bg-blue-900/80 text-blue-200 border border-blue-500'
                                        }`}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                            </svg>
                                            {timeRemaining.text}
                                        </div>
                                        <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full text-center">
                                            {book.status.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Book Header */}
                                    <div className={`bg-gradient-to-r p-6 ${headerGradientClass}`}>
                                        <div className="flex items-start gap-4 pr-24">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex-shrink-0">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1">
                                                    {book.title}
                                                </h3>
                                                <p className="text-white/80 text-sm font-medium">
                                                    Borrowed on {new Date(book.borrowDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Details */}
                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                                    timeRemaining.isOverdue 
                                                        ? 'bg-red-900/50 border-red-700' 
                                                        : timeRemaining.isUrgent 
                                                            ? 'bg-orange-900/50 border-orange-700'
                                                            : 'bg-green-900/50 border-green-700'
                                                }`}>
                                                    <svg className={`w-4 h-4 ${
                                                        timeRemaining.isOverdue ? 'text-red-400' : timeRemaining.isUrgent ? 'text-orange-400' : 'text-green-400'
                                                    }`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400">Return Due</p>
                                                    <p className={`text-sm font-medium ${
                                                        timeRemaining.isOverdue ? 'text-red-300' : timeRemaining.isUrgent ? 'text-orange-300' : 'text-gray-100'
                                                    }`}>
                                                        {new Date(book.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-700">
                                                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-400">Loan Period</p>
                                                    <p className="text-gray-100 text-sm">
                                                        {Math.ceil((new Date(book.dueDate).getTime() - new Date(book.borrowDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Library Action Buttons */}
                                        <div className="flex gap-2">
                                            <a 
                                                href={`/books/${book.bookId}`}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-center py-2.5 px-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                                            >
                                                View Details
                                            </a>
                                            <Link href={`/borrowed/${book.bookId}`} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm">
                                                Renew
                                            </Link>
                                            <Link href={`/borrowed/return/${book.bookId}`} className="bg-slate-700 border border-red-500/30 hover:border-red-400/50 hover:bg-red-900/20 text-red-300 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm">
                                                Return
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default page