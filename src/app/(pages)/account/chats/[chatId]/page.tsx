import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatDetailPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        }
      >
        <ChatContent params={params} />
      </Suspense>
    </div>
  );
}

async function ChatContent({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Conversation</h2>
      <p className="text-muted-foreground text-sm mt-1">Chat ID: {chatId}</p>
    </div>
  );
}
