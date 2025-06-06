import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  console.log(chatId);
  return <div>page</div>;
}
