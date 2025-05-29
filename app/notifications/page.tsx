import axios from 'axios'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'

interface notifications {
    id: string;
    userId: string;
    message: string;
    isRead: number;
    createdAt: Date
}

const page = async () => {
    const session = await getServerSession(authOptions)
    let errorMessage = null;
    let notifications: notifications[] = [];

    try{
        const res : any = await axios.get(`http://localhost:3000/api/notifications/${session?.user.id}`)
        if(res.data.success && res.data.success === 'no notification to view'){
            return (
                <div className="min-h-screen bg-black p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">🔔 Notifications</h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
                            <p className="text-gray-400 text-lg">Stay updated with your library activities</p>
                        </div>

                        {/* No Notifications */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">All Caught Up!</h2>
                                        <p className="text-white/80">No new notifications at the moment</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 text-center">
                                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Your inbox is empty</h3>
                                <p className="text-gray-400">When you have new library activities, they'll appear here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }    
        notifications = res.data
        const result : any = await axios.put(`http://localhost:3000/api/notifications/${session?.user.id}`)
        if(result.data.success) console.log("notifications set to read")
    }catch(error: any){
        console.log("--------->", error)
    }

    // Helper function to get relative time
    const getRelativeTime = (createdAt: Date) => {
        const now = new Date();
        const created = new Date(createdAt);
        const difference = now.getTime() - created.getTime();
        
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return created.toLocaleDateString();
    };

    // Helper function to get notification icon based on message content
    const getNotificationIcon = (message: string) => {
        if (message.toLowerCase().includes('borrow') || message.toLowerCase().includes('checked out')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
            );
        }
        if (message.toLowerCase().includes('return') || message.toLowerCase().includes('due')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
            );
        }
        if (message.toLowerCase().includes('extend') || message.toLowerCase().includes('renew')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
        );
    };

    // Separate unread and read notifications
    const unreadNotifications = notifications.filter(n => n.isRead === 0);
    const readNotifications = notifications.filter(n => n.isRead === 1);

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🔔 Notifications</h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-lg">Stay updated with your library activities</p>
                        {unreadNotifications.length > 0 && (
                            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                {unreadNotifications.length} unread
                            </div>
                        )}
                    </div>
                </div>

                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            New Notifications
                        </h2>
                        <div className="space-y-4">
                            {unreadNotifications.map((notification) => (
                                <div key={notification.id} className="bg-slate-800 rounded-2xl border border-red-500/50 overflow-hidden hover:border-red-400 transition-all duration-300 group">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-600/20 border border-red-500 rounded-xl p-3 flex-shrink-0">
                                                <div className="text-red-400">
                                                    {getNotificationIcon(notification.message)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <p className="text-white font-medium leading-relaxed group-hover:text-red-300 transition-colors">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                                                        <span className="text-gray-400 text-sm whitespace-nowrap">
                                                            {getRelativeTime(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Read Notifications */}
                {readNotifications.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            Previous Notifications
                        </h2>
                        <div className="space-y-3">
                            {readNotifications.map((notification) => (
                                <div key={notification.id} className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden hover:bg-slate-800 transition-all duration-300 group">
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-2 flex-shrink-0">
                                                <div className="text-slate-400">
                                                    {getNotificationIcon(notification.message)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                        </svg>
                                                        <span className="text-gray-500 text-sm whitespace-nowrap">
                                                            {getRelativeTime(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State for All Read */}
                {notifications.length > 0 && unreadNotifications.length === 0 && (
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">All Notifications Read</h3>
                            <p className="text-gray-400">Great! You're all caught up with your library notifications.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page