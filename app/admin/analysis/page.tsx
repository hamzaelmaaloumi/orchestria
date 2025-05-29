'use client'
import axios from 'axios'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

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

interface BookStats {
    title: string;
    author: string;
    borrowCount: number;
    percentage: number;
}

interface AuthorStats {
    author: string;
    bookCount: number;
    totalBorrows: number;
    percentage: number;
}

interface StatusStats {
    status: string;
    count: number;
    percentage: number;
    color: string;
}

interface MonthlyStats {
    month: string;
    borrows: number;
    returns: number;
}

const AnalysisPage = () => {
    const {status, data: session}  = useSession()
    const router = useRouter()
    useEffect(() => {
        if (status === "authenticated" && session?.user.role === "user") {
          router.push("/books");
        }
      }, [status, session, router]);

    const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [mostBorrowedBooks, setMostBorrowedBooks] = useState<BookStats[]>([]);
    const [topAuthors, setTopAuthors] = useState<AuthorStats[]>([]);
    const [statusDistribution, setStatusDistribution] = useState<StatusStats[]>([]);
    const [monthlyTrends, setMonthlyTrends] = useState<MonthlyStats[]>([]);
    const [activeUsers, setActiveUsers] = useState<{name: string, email: string, borrowCount: number}[]>([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/users/history');
            const records: BorrowRecord[] = res.data || [];
            setBorrowRecords(records);
            
            // Process analytics data
            processMostBorrowedBooks(records);
            processTopAuthors(records);
            processStatusDistribution(records);
            processMonthlyTrends(records);
            processActiveUsers(records);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const processMostBorrowedBooks = (records: BorrowRecord[]) => {
        const bookCounts = records.reduce((acc, record) => {
            const bookKey = `${record.title}|||${record.author}`;
            acc[bookKey] = (acc[bookKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalBorrows = records.length;
        const bookStats: BookStats[] = Object.entries(bookCounts)
            .map(([bookKey, count]) => {
                const [title, author] = bookKey.split('|||');
                return {
                    title,
                    author,
                    borrowCount: count,
                    percentage: (count / totalBorrows) * 100
                };
            })
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, 10);

        setMostBorrowedBooks(bookStats);
    };

    const processTopAuthors = (records: BorrowRecord[]) => {
        const authorStats = records.reduce((acc, record) => {
            if (!acc[record.author]) {
                acc[record.author] = {
                    author: record.author,
                    books: new Set(),
                    totalBorrows: 0
                };
            }
            acc[record.author].books.add(record.title);
            acc[record.author].totalBorrows++;
            return acc;
        }, {} as Record<string, {author: string, books: Set<string>, totalBorrows: number}>);

        const totalBorrows = records.length;
        const authorList: AuthorStats[] = Object.values(authorStats)
            .map(stat => ({
                author: stat.author,
                bookCount: stat.books.size,
                totalBorrows: stat.totalBorrows,
                percentage: (stat.totalBorrows / totalBorrows) * 100
            }))
            .sort((a, b) => b.totalBorrows - a.totalBorrows)
            .slice(0, 8);

        setTopAuthors(authorList);
    };

    const processStatusDistribution = (records: BorrowRecord[]) => {
        const statusCounts = records.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalRecords = records.length;
        const statusColors = {
            'borrowed': '#3B82F6',
            'returned': '#10B981',
            'overdue': '#EF4444',
            'extended': '#F59E0B'
        };

        const statusStats: StatusStats[] = Object.entries(statusCounts)
            .map(([status, count]) => ({
                status,
                count,
                percentage: (count / totalRecords) * 100,
                color: statusColors[status as keyof typeof statusColors] || '#6B7280'
            }))
            .sort((a, b) => b.count - a.count);

        setStatusDistribution(statusStats);
    };

    const processMonthlyTrends = (records: BorrowRecord[]) => {
        const monthlyData = records.reduce((acc, record) => {
            const borrowMonth = new Date(record.borrowDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (!acc[borrowMonth]) {
                acc[borrowMonth] = { borrows: 0, returns: 0 };
            }
            
            acc[borrowMonth].borrows++;
            
            if (record.returnDate) {
                const returnMonth = new Date(record.returnDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (!acc[returnMonth]) {
                    acc[returnMonth] = { borrows: 0, returns: 0 };
                }
                acc[returnMonth].returns++;
            }
            
            return acc;
        }, {} as Record<string, {borrows: number, returns: number}>);

        const monthlyStats: MonthlyStats[] = Object.entries(monthlyData)
            .map(([month, data]) => ({
                month,
                borrows: data.borrows,
                returns: data.returns
            }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
            .slice(-6); // Last 6 months

        setMonthlyTrends(monthlyStats);
    };

    const processActiveUsers = (records: BorrowRecord[]) => {
        const userStats = records.reduce((acc, record) => {
            const userKey = `${record.name}|||${record.email}`;
            acc[userKey] = (acc[userKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const activeUsersList = Object.entries(userStats)
            .map(([userKey, borrowCount]) => {
                const [name, email] = userKey.split('|||');
                return { name, email, borrowCount };
            })
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, 8);

        setActiveUsers(activeUsersList);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Analytics</h3>
                        <p className="text-gray-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate key metrics
    const totalBorrows = borrowRecords.length;
    const activeBorrows = borrowRecords.filter(r => r.status.toLowerCase() === 'borrowed').length;
    const overdueBorrows = borrowRecords.filter(r => {
        if (r.status.toLowerCase() === 'returned') return false;
        const due = new Date(r.dueDate);
        const now = new Date();
        return due.getTime() < now.getTime();
    }).length;
    const uniqueBooks = new Set(borrowRecords.map(r => r.bookId)).size;
    const uniqueUsers = new Set(borrowRecords.map(r => r.userId)).size;

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">📊 Library Analytics</h1>
                            <p className="text-gray-400 text-lg">Comprehensive borrowing patterns and insights</p>
                        </div>
                    </div>
                    <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-900/50 border border-blue-700 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Total Borrows</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{totalBorrows}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-900/50 border border-emerald-700 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Active Borrows</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{activeBorrows}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-900/50 border border-red-700 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Overdue</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{overdueBorrows}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-900/50 border border-purple-700 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Unique Books</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{uniqueBooks}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-cyan-900/50 border border-cyan-700 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm">Active Users</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{uniqueUsers}</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Most Borrowed Books */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Most Borrowed Books</h3>
                        </div>
                        <div className="space-y-4">
                            {mostBorrowedBooks.slice(0, 6).map((book, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{book.title}</p>
                                        <p className="text-gray-400 text-sm">by {book.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">{book.borrowCount}</p>
                                        <p className="text-gray-400 text-xs">{book.percentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Status Distribution</h3>
                        </div>
                        <div className="space-y-4">
                            {statusDistribution.map((stat, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 capitalize">{stat.status}</span>
                                        <span className="text-white font-medium">{stat.count} ({stat.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${stat.percentage}%`,
                                                backgroundColor: stat.color
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Authors */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Popular Authors</h3>
                        </div>
                        <div className="space-y-4">
                            {topAuthors.map((author, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{author.author}</p>
                                        <p className="text-gray-400 text-sm">{author.bookCount} books</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">{author.totalBorrows}</p>
                                        <p className="text-gray-400 text-xs">{author.percentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Most Active Users</h3>
                        </div>
                        <div className="space-y-4">
                            {activeUsers.map((user, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{user.name}</p>
                                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">{user.borrowCount}</p>
                                        <p className="text-gray-400 text-xs">borrows</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Trends */}
                {monthlyTrends.length > 0 && (
                    <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Monthly Trends (Last 6 Months)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            {monthlyTrends.map((month, index) => (
                                <div key={index} className="bg-slate-700/50 rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-sm mb-2">{month.month}</p>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-blue-400 text-sm">Borrowed</p>
                                            <p className="text-white font-bold text-lg">{month.borrows}</p>
                                        </div>
                                        <div>
                                            <p className="text-emerald-400 text-sm">Returned</p>
                                            <p className="text-white font-bold text-lg">{month.returns}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisPage;