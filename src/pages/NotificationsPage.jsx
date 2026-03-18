import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import { Navigate, Link } from 'react-router-dom';
import { subscribeToNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../firebase/notifications';
import { BellIcon, HeartIcon, ChatBubbleLeftIcon, UserPlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const NotificationItem = ({ notification }) => {
    const handleRead = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!notification.read) {
            await markNotificationAsRead(notification.id);
        }
    };

    let Icon = BellIcon;
    let iconColor = "text-smoke";
    let message = "";
    let link = "#";

    switch (notification.type) {
        case 'like':
            Icon = HeartSolid;
            iconColor = "text-dbd-red";
            message = "liked your post.";
            link = `/?post=${notification.postId}`;
            break;
        case 'comment':
            Icon = ChatBubbleLeftIcon;
            iconColor = "text-blue-400";
            message = "commented on your post.";
            link = `/?post=${notification.postId}`;
            break;
        case 'follow':
            Icon = UserPlusIcon;
            iconColor = "text-green-400";
            message = "started following you.";
            link = `/user/${notification.senderId}`;
            break;
    }

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <Link
            to={link}
            onClick={() => !notification.read && markNotificationAsRead(notification.id)}
            className={`flex items-start gap-4 p-4 transition-colors hover:bg-white/5 border-b border-white/5 ${!notification.read ? 'bg-dbd-red/5' : ''}`}
        >
            <div className="relative shrink-0 mt-1">
                <img
                    src={notification.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.senderId}`}
                    alt={notification.senderName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-obsidian flex items-center justify-center border border-white/10 ${iconColor}`}>
                    <Icon className="w-3 h-3" />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm text-smoke">
                    <span className="font-bold text-white block sm:inline mr-1 truncate">
                        {notification.senderName}
                    </span>
                    {message}
                </p>
                {notification.text && (
                    <p className="text-xs text-smoke/70 italic mt-1 truncate border-l-2 border-white/10 pl-2 py-0.5">
                        "{notification.text}"
                    </p>
                )}
                <p className="text-[10px] text-smoke/50 uppercase tracking-widest mt-2">
                    {timeAgo(notification.createdAt)}
                </p>
            </div>

            {!notification.read && (
                <button
                    onClick={handleRead}
                    title="Mark as read"
                    className="p-1.5 rounded-full text-dbd-red hover:bg-dbd-red/20 transition-colors shrink-0"
                >
                    <CheckIcon className="w-4 h-4" />
                </button>
            )}
        </Link>
    );
};

const NotificationsPage = () => {
    const { user, loading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [limitCount, setLimitCount] = useState(8);

    useEffect(() => {
        if (!user?.uid) return;
        setIsLoading(true);
        const unsubscribe = subscribeToNotifications(user.uid, limitCount, (data) => {
            setNotifications(data);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user?.uid, limitCount]);

    if (!loading && !user) {
        return <Navigate to="/login" replace />;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = async () => {
        if (unreadCount === 0 || !user?.uid) return;
        await markAllNotificationsAsRead(user.uid);
    };

    return (
        <Layout>
            <div className="max-w-[800px] mx-auto p-4 md:p-8 animate-fade-in relative min-h-screen">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-dbd-red/10 rounded-xl border border-dbd-red/20">
                            <BellIcon className="w-6 h-6 text-dbd-red" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Archive Logs</h1>
                            <p className="text-sm text-smoke">Entities interacting with you</p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-smoke hover:text-white uppercase tracking-wider px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="w-8 h-8 border-4 border-dbd-red/30 rounded-full border-t-dbd-red animate-spin"></div>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))}

                            {/* Load More Button */}
                            {notifications.length >= limitCount && (
                                <div className="p-4 border-t border-white/5 flex justify-center">
                                    <button
                                        onClick={() => setLimitCount(prev => prev + 8)}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-smoke hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/10"
                                    >
                                        Show More
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <BellIcon className="w-12 h-12 text-smoke/30 mb-4" />
                            <h3 className="text-lg font-bold text-white">The fog is silent</h3>
                            <p className="text-sm text-smoke mt-1 max-w-sm">
                                You don't have any notifications right now. When entities interact with your posts or start following you, it will appear here.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default NotificationsPage;
