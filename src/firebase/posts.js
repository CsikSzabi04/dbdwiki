import { db } from './config'
import {
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

const postsCollection = collection(db, 'posts')

export const createPost = async (postData) => {
  const docRef = await addDoc(postsCollection, {
    ...postData,
    createdAt: new Date().toISOString(),
    likes: [],
    dislikes: []
  })
  return docRef.id
}

export const getPosts = async () => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const subscribeToPosts = (callback) => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(posts)
  })
}

export const updatePost = async (postId, updates) => {
  const postRef = doc(db, 'posts', postId)
  await updateDoc(postRef, { ...updates, edited: true })
}

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId))
}

export const likePost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId)
  const post = await getDoc(postRef)
  const currentLikes = post.data().likes || []
  const currentDislikes = post.data().dislikes || []

  let newLikes = currentLikes
  let newDislikes = currentDislikes

  if (currentLikes.includes(userId)) {
    newLikes = currentLikes.filter(id => id !== userId)
  } else {
    newLikes = [...currentLikes, userId]
    newDislikes = currentDislikes.filter(id => id !== userId)
  }

  await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes })
}

export const dislikePost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId)
  const post = await getDoc(postRef)
  const currentLikes = post.data().likes || []
  const currentDislikes = post.data().dislikes || []

  let newLikes = currentLikes
  let newDislikes = currentDislikes

  if (currentDislikes.includes(userId)) {
    newDislikes = currentDislikes.filter(id => id !== userId)
  } else {
    newDislikes = [...currentDislikes, userId]
    newLikes = currentLikes.filter(id => id !== userId)
  }

  await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes })
}

export const addComment = async (postId, commentData) => {
  const commentsCollection = collection(db, 'posts', postId, 'comments')
  await addDoc(commentsCollection, {
    ...commentData,
    createdAt: new Date().toISOString(),
    likes: []
  })
}