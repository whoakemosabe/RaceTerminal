'use client'

import { useState, useEffect } from 'react';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

export function useUsername() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);

  useEffect(() => {
    // Load initial username
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCALSTORAGE_USERNAME_KEY) {
        setUsername(e.newValue || DEFAULT_USERNAME);
      }
    };

    // Listen for custom event for same-window updates
    const handleCustomEvent = (e: CustomEvent) => {
      setUsername(e.detail || DEFAULT_USERNAME);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('usernameChange', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('usernameChange', handleCustomEvent as EventListener);
    };
  }, []);

  return { username };
}