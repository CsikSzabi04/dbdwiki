import { useState, useEffect } from 'react'
import { subscribeToPosts } from '../firebase/posts'

export const usePosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToPosts((newPosts) => {
      setPosts(newPosts)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { posts, loading }
}