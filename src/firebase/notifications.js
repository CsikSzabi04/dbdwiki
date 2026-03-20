import { db } from './config';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    getDocs,
    writeBatch,
    limit
} from 'firebase/firestore';

/**
 * Creates a new notification for a user.
 * 
 * @param {Object} data
 * @param {string} data.recipientId - UID of the user receiving the notification
 * @param {string} data.senderId - UID of the user who triggered the event
 * @param {string} data.senderName - Name of the sender
 * @param {string} data.senderAvatar - Avatar URL of the sender
 * @param {string} data.type - 'like' | 'comment' | 'follow'
 * @param {string} [data.postId] - Optional related post ID
 * @param {string} [data.text] - Optional snippet of comment or context text
 */
export const createNotification = async (data) => {
    // Prevent users from notifying themselves
    if (data.recipientId !== 'all' && data.recipientId === data.senderId) return null;

    try {
        const notificationsRef = collection(db, 'notifications');
        const newNotification = {
            ...data,
            read: false,
            createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(notificationsRef, newNotification);
        return { id: docRef.id, ...newNotification };
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

/**
 * Creates a global broadcast notification for all users.
 */
export const createBroadcastNotification = async (data) => {
    return createNotification({
        ...data,
        recipientId: 'all',
        senderId: 'system',
        senderName: 'The Fog',
        senderAvatar: '/logo.png'
    });
};

/**
 * Subscribe to a user's notifications.
 */
export const subscribeToNotifications = (userId, limitCount = 8, callback) => {
    if (!userId) {
        callback([]);
        return () => { };
    }

    const notificationsRef = collection(db, 'notifications');
    
    // We'll use two separate listeners and combine them to avoid complex permission issues with 'in' queries
    let privateNotifications = [];
    let broadcastNotifications = [];

    const updateCallback = () => {
        const combined = [...privateNotifications, ...broadcastNotifications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limitCount);
        callback(combined);
    };

    const qPrivate = query(
        notificationsRef,
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const qBroadcast = query(
        notificationsRef,
        where('recipientId', '==', 'all'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    const unsubPrivate = onSnapshot(qPrivate, (snapshot) => {
        privateNotifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        updateCallback();
    }, (error) => {
        console.error("Error listening to private notifications:", error);
    });

    const unsubBroadcast = onSnapshot(qBroadcast, (snapshot) => {
        broadcastNotifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        updateCallback();
    }, (error) => {
        // Broadcasts might fail if rules are very strict, but we shouldn't crash the whole system
        if (error.code !== 'permission-denied') {
            console.error("Error listening to broadcast notifications:", error);
        }
    });

    return () => {
        unsubPrivate();
        unsubBroadcast();
    };
};

/**
 * Marks a single notification as read.
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const notificationRef = doc(db, 'notifications', notificationId);
        await updateDoc(notificationRef, { read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

/**
 * Marks all of a user's unread notifications as read.
 */
export const markAllNotificationsAsRead = async (userId) => {
    try {
        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('recipientId', '==', userId),
            where('read', '==', false)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return;

        const batch = writeBatch(db);
        snapshot.docs.forEach((document) => {
            batch.update(doc(db, 'notifications', document.id), { read: true });
        });
        await batch.commit();
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};
