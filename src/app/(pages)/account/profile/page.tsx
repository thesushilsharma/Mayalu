import { getUserProfile, requireAuth } from "@/lib/firebase/auth-server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, Phone, Shield, User, Clock } from "lucide-react"

export default async function ProfilePage() {
  // Require authentication and get user session
  const sessionUser = await requireAuth()
  
  // Fetch full user profile data from Firebase
  const profile = await getUserProfile(sessionUser.uid)
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription>Unable to fetch user profile data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getInitials = (email: string | undefined, displayName: string | null | undefined) => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email?.charAt(0).toUpperCase() || "U"
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="size-20">
              <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName || "User"} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.email, profile.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-2xl">
                  {profile.displayName || "User Profile"}
                </CardTitle>
                {profile.emailVerified ? (
                  <Badge variant="default" className="gap-1.5">
                    <Shield className="size-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1.5">
                    <Shield className="size-3" />
                    Unverified
                  </Badge>
                )}
                {profile.disabled && (
                  <Badge variant="destructive">Disabled</Badge>
                )}
              </div>
              <CardDescription className="mt-2">
                Member since {formatDate(profile.metadata.creationTime)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm font-mono truncate">{profile.email || "Not provided"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Phone className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{profile.phoneNumber || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Account Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <User className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-xs font-mono truncate">{profile.uid}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                  <p className="text-xs">{formatDate(profile.metadata.lastSignInTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {profile.metadata.lastRefreshTime && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>Last token refresh: {formatDate(profile.metadata.lastRefreshTime)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Provider Information */}
      {profile.providerData && profile.providerData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sign-in Methods</CardTitle>
            <CardDescription>Authentication providers linked to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.providerData.map((provider) => (
                <div key={provider.uid || provider.providerId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Shield className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {provider.providerId.replace(".com", "")}
                      </p>
                      <p className="text-xs text-muted-foreground">{provider.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}      
    </div>
  )
}
