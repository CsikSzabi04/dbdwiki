import { db } from './config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

/**
 * Ensures the chat document exists for a user and returns their chat history
 */
export const getChatHistory = async (userId) => {
    if (!userId) return [];

    try {
        const chatRef = doc(db, 'chatHistories', userId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
            return chatSnap.data().messages || [];
        } else {
            // Document doesn't exist, create it with the initial welcome message from the client
            await setDoc(chatRef, { messages: [] });
            return [];
        }
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
};

/**
 * Appends a new message (user or bot) to the user's chat history
 */
export const saveChatMessage = async (userId, messageObj) => {
    if (!userId) return;

    try {
        const chatRef = doc(db, 'chatHistories', userId);
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
            await setDoc(chatRef, { messages: [messageObj] });
        } else {
            await updateDoc(chatRef, {
                messages: arrayUnion(messageObj)
            });
        }
    } catch (error) {
        console.error("Error saving chat message:", error);
    }
};
