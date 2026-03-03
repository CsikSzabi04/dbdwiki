import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { getUserProfile, createUserProfile, updateUserAvatar } from '../firebase/users';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get additional profile data from Firestore
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUser(firebaseUser);
                    setUserProfile(profile);
                } catch (error) {
                    console.error("Firestore permission error or profile missing:", error);
                    // Still log the user in locally even if Firestore read fails
                    setUser(firebaseUser);
                    setUserProfile(null);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, displayName) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });

        // Set Leon Kennedy as default avatar
        let leonAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
        try {
            const survivorsData = await import('../hooks/survivors.json').then(m => m.default || m);
            const leonKennedy = survivorsData.find(char => char.name === 'Leon S. Kennedy');
            if (leonKennedy && leonKennedy.imgs?.portrait) {
                leonAvatar = leonKennedy.imgs.portrait;
            } else {
                // Fallback to first survivor if Leon not found
                const firstSurvivor = survivorsData[0];
                if (firstSurvivor && firstSurvivor.imgs?.portrait) {
                    leonAvatar = firstSurvivor.imgs.portrait;
                }
            }
        } catch (e) {
            console.error("Failed to load Leon Kennedy avatar", e);
        }

        const profileData = {
            displayName,
            email,
            photoURL: leonAvatar,
            role: 'survivor',
            bio: 'New Survivor in the Fog',
            joinedDate: new Date().toISOString()
        };

        await createUserProfile(userCredential.user.uid, profileData);
        try {
            await updateUserAvatar(userCredential.user.uid, leonAvatar, email);
            // Also update Firebase Auth profile
            await updateProfile(userCredential.user, { photoURL: leonAvatar });
        } catch (e) {
            console.error("Failed to save initial avatar to pfp collection", e);
        }
        setUserProfile(profileData);
        return userCredential.user;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };


    const value = {
        user,
        userProfile,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
