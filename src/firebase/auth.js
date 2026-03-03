import { auth } from './config'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const register = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName })
  return userCredential.user
}

export const logout = async () => {
  await signOut(auth)
}

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}