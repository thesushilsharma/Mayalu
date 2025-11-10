import { defaultUserLevel, UserLevel } from '@/contexts/userContext';
import React, { useEffect, useState } from 'react'

export default function useUserLevel() {
    const [userLevel, setUserLevel] = useState<UserLevel>(defaultUserLevel);

    // Load user level from localStorage on client side
    useEffect(() => {
      const savedLevel = localStorage.getItem('userLevel');
      if (savedLevel) {
        setUserLevel(JSON.parse(savedLevel));
      }
    }, []);
  
    // Save user level to localStorage when it changes
    useEffect(() => {
      localStorage.setItem('userLevel', JSON.stringify(userLevel));
    }, [userLevel]);
  
    const addXp = (amount: number) => {
      setUserLevel((prev) => {
        const newXp = prev.xp + amount;
        
        // Check if user should level up
        if (newXp >= prev.requiredXp) {
          const newLevel = prev.level + 1;
          // Next level requires more XP (scaling formula)
          const newRequiredXp = Math.floor(prev.requiredXp * 1.5);
          
          return {
            level: newLevel,
            xp: newXp - prev.requiredXp, // Carry over excess XP
            requiredXp: newRequiredXp,
          };
        }
        
        return {
          ...prev,
          xp: newXp,
        };
      });
    };
}
