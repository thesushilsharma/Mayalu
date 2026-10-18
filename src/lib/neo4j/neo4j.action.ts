"use server";

import {
  getCompatibilityGraph,
  recalculateDynamicHarmony,
  recordGraphInteraction,
  syncUserProfileToNeo4j,
  CompatibilityGraphData,
} from "./graph-service";
import { executeCypher } from "./client";

/**
 * Server Action: Fetch live compatibility graph from Neo4j
 */
export async function getCompatibilityGraphAction(
  userId1?: string,
  userId2?: string
): Promise<CompatibilityGraphData> {
  return await getCompatibilityGraph(userId1, userId2);
}

/**
 * Server Action: Continuous Graph Learning recalculate
 */
export async function recalculateHarmonyScoreAction(
  userId1?: string,
  userId2?: string
) {
  return await recalculateDynamicHarmony(userId1, userId2);
}

/**
 * Server Action: Record dynamic interaction in the graph
 */
export async function recordGraphInteractionAction(
  swiperId: string,
  targetId: string,
  action: "like" | "pass" | "superlike" | "chat"
) {
  return await recordGraphInteraction(swiperId, targetId, action);
}

/**
 * Server Action: Sync user profile to Neo4j
 */
export async function syncUserToGraphAction(profile: {
  userId: string;
  firstName?: string;
  age?: number;
  gender?: string;
  location?: string;
  relationshipIntent?: string;
  dalBhatFrequency?: string;
  interests?: string[];
  dealbreakers?: string[];
}) {
  return await syncUserProfileToNeo4j(profile);
}

/**
 * Legacy support for user lookup
 */
export const getUserByID = async (id: string) => {
  try {
    const result = await executeCypher(
      `
      CYPHER 25
      MATCH (u:User {userId: $id})
      RETURN u
      `,
      { id }
    );
    if (!result.records || result.records.length === 0) return null;
    return result.records[0].get("u").properties;
  } catch (error) {
    console.error("getUserByID error:", error);
    return null;
  }
};
