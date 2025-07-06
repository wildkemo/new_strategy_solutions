'use client'
import { useEffect } from 'react'

export default function SessionRefresher() {
  useEffect(() => {
    let timeout

    const refreshSession = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        fetch('/api/refresh_session', { method: 'POST' })
      }, 10000)
    }

    window.addEventListener('mousemove', refreshSession)
    window.addEventListener('keydown', refreshSession)

    return () => {
      window.removeEventListener('mousemove', refreshSession)
      window.removeEventListener('keydown', refreshSession)
    }
  }, [])

  return null
}
