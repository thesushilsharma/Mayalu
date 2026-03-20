import DashboardSection from "@/components/dashboard";
import { Overview } from "@/components/overview";
import { RecentUsers } from "@/components/recent-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserActivity } from "@/components/user-activity";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Swipe Section */}
      <DashboardSection/>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-pink-200 dark:border-pink-900/30 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-pink-900 dark:text-pink-100">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">2,350</div>
            <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-1 font-medium">+180 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">Active Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">1,789</div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1 font-medium">+201 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900/30 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Total Matches</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">892</div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1 font-medium">+88 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Messages Sent</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">12,234</div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-medium">+1,234 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly user engagement metrics</p>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Recent user interactions</p>
          </CardHeader>
          <CardContent>
            <UserActivity />
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
            <p className="text-sm text-muted-foreground">Latest user registrations and activity</p>
          </CardHeader>
          <CardContent>
            <RecentUsers />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}