import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_UID = 'm5bQpvVyXrhtTSvdmOA4rbeDsFb2';

async function migrateAdmins() {
    console.log('--- Database Migration: Admin Roles ---');

    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        console.log(`Found ${querySnapshot.size} users. Starting update...`);

        const updates = querySnapshot.docs.map(async (userDoc) => {
            const isAdminData = userDoc.id === ADMIN_UID;
            const userRef = doc(db, 'users', userDoc.id);

            await updateDoc(userRef, {
                admin: isAdminData
            });

            console.log(`User ${userDoc.id} (${userDoc.data().displayName || 'No Name'}) -> Admin: ${isAdminData}`);
        });

        await Promise.all(updates);
        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateAdmins();
