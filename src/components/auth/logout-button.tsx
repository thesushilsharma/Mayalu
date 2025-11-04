"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/firebase/auth-client"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const result = await logout()
      if (result.success) {
        router.push("/auth/login")
      } else {
        console.error("Logout failed:", result.error)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
