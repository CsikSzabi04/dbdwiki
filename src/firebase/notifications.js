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
    if (data.recipientId === data.senderId) return null;

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
 * Subscribe to a user's notifications.
 */
export const subscribeToNotifications = (userId, limitCount = 8, callback) => {
    if (!userId) {
        callback([]);
        return () => { };
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
        notificationsRef,
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(notifications);
    }, (error) => {
        console.error("Error listening to notifications:", error);
        callback([]);
    });
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
