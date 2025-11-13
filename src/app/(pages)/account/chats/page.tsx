import { MessagesTable } from "@/components/messages-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChatPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Chats</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <MessagesTable />
        </CardContent>
      </Card>
    </div>
  );
}
