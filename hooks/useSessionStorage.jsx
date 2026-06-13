"use client";

import { useEffect, useState } from "react";

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      } else {
        sessionStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (e) {}

    setReady(true);
  }, [key]);

  const setStoredValue = (newValue) => {
    setValue(newValue);
    try {
      sessionStorage.setItem(key, JSON.stringify(newValue));
    } catch (e) {}
  };

  return [value, setStoredValue, ready];
}
