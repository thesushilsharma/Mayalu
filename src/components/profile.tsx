"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartIcon, User, Edit, Settings, ChevronLeft, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserLevel } from "@/contexts/userContext";
import Image from "next/image";
import { getUserProfileData, type UserProfile } from "@/app/actions/profile";

export default function ProfileSection() {
  const { userLevel } = useUserLevel();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getUserProfileData();
        setUser(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <h3 className="text-lg font-medium">Error Loading Profile</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Unable to fetch user profile data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/account/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <HeartIcon className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl font-bold">Mayalu</h1>
          </div>
        </div>
        <Link href="/profile/edit">
          <Button variant="ghost" size="icon">
            <Edit className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user.profileImage || ""} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold">{user.name}{user.age > 0 ? `, ${user.age}` : ""}</h2>
                  <p className="text-muted-foreground">{user.location}</p>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-card">
                      {user.relationshipType} Mode
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Level Progress</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Level {userLevel.level}</span>
                      <span className="text-sm">{userLevel.xp}/{userLevel.requiredXp} XP</span>
                    </div>
                    <Progress
                      value={(userLevel.xp / userLevel.requiredXp) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.badges && user.badges.length > 0 ? (
                        user.badges.map((badge, index) => (
                          <Badge key={index} className="bg-muted text-foreground">
                            {badge.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No badges yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="xp">XP History</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">About Me</h3>
                  </CardHeader>
                  <CardContent>
                    <p>{user.bio || "No bio available. Complete your profile to add a bio."}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">Basic Info</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p>{user.height || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Education</p>
                        <p>{user.education || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p>{user.occupation || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{user.location || "Not set"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">Interests</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No interests added yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">Preferences</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Interested In</p>
                        <p>{user.preferences?.interestedIn || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age Range</p>
                        <p>{user.preferences?.ageRange || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p>{user.preferences?.distance || "Not set"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">My Photos</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {user.profileImage && (
                        <div className="aspect-square rounded-md overflow-hidden">
                          <Image
                            src={user.profileImage}
                            alt="Profile"
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      {user.photos && user.photos.length > 0 && user.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden">
                          <Image
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                      <div className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                        <Button variant="ghost" className="h-full w-full">
                          <Plus className="h-8 w-8 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="xp" className="mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-medium">XP History</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.xpHistory && user.xpHistory.length > 0 ? (
                        user.xpHistory.map((entry, index) => (
                          <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0">
                            <div>
                              <p className="font-medium">{entry.activity}</p>
                              <p className="text-sm text-muted-foreground">{entry.date}</p>
                            </div>
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                              +{entry.xp} XP
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No XP history yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}