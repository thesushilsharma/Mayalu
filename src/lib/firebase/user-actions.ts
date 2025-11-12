"use server";

import * as admin from "firebase-admin";

export interface User {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
  customClaims?: Record<string, unknown>;
}

export async function getAllUsers(maxResults = 1000): Promise<User[]> {
  try {
    const listUsersResult = await admin.auth().listUsers(maxResults);
    
    return listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
      customClaims: userRecord.customClaims,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function updateUserStatus(uid: string, disabled: boolean) {
  try {
    await admin.auth().updateUser(uid, { disabled });
    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

export async function deleteUser(uid: string) {
  try {
    await admin.auth().deleteUser(uid);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function setUserClaims(uid: string, claims: Record<string, unknown>) {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    return { success: true };
  } catch (error) {
    console.error("Error setting user claims:", error);
    return { success: false, error: "Failed to set user claims" };
  }
}
