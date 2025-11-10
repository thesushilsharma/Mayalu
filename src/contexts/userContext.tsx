import { createContext, useContext } from "react";

// User level context
export type UserLevel = {
    level: number;
    xp: number;
    requiredXp: number;
};

type UserLevelContextType = {
    userLevel: UserLevel;
    addXp: (amount: number) => void;
};

export const defaultUserLevel: UserLevel = {
    level: 1,
    xp: 0,
    requiredXp: 100,
};

const UserLevelContext = createContext<UserLevelContextType>({
    userLevel: defaultUserLevel,
    addXp: () => { },
});

export const useUserLevel = () => useContext(UserLevelContext);