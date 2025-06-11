"use server";

import { User } from "../types/user";
import { Neo4jInstance } from "./client";

export const getUserByID = async (id: string) => {
  const result = await Neo4jInstance.executeQuery(
    `
MATCH (u:User {userId: $id})
RETURN u
`,
    { userId: id }
  );
  const user = result.records.map((record) => record.get("u").properties);
  if (user.length === 0) return null;
  return user[0] as User;
};
