import { MessagesTable } from "@/components/messages-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Inbox, Archive } from "lucide-react";
import { getMessageStats } from "@/lib/firebase/messages-server";

export default async function ChatPage() {
  // Fetch message statistics on the server
  const stats = await getMessageStats();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            Messages
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all your conversations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Messages</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {stats.total.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-medium">All time messages</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">Sent</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Send className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {stats.sent.toLocaleString()}
            </div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1 font-medium">Messages sent</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900/30 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Received</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Inbox className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {stats.received.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1 font-medium">Messages received</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">Unread</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Archive className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {stats.unread.toLocaleString()}
            </div>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1 font-medium">Pending messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table with Tabs */}
      <Card className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Conversations</CardTitle>
          <CardDescription>
            Real-time message updates from Firebase Firestore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <MessagesTable />
            </TabsContent>
            <TabsContent value="sent" className="space-y-4">
              <MessagesTable filter="sent" />
            </TabsContent>
            <TabsContent value="received" className="space-y-4">
              <MessagesTable filter="received" />
            </TabsContent>
            <TabsContent value="unread" className="space-y-4">
              <MessagesTable filter="unread" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
