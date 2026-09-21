"use client";

import { useCallback, useEffect, useState } from "react";

export function useFormDraft<T extends Record<string, unknown>>(
  formId: string,
  initialValues: T
) {
  const storageKey = `ubx:form:${formId}`;

  const [values, setValues] = useState<T>(() => {
    if (typeof window === "undefined") return initialValues;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return initialValues;
      const parsed = JSON.parse(raw) as Partial<T>;
      return { ...initialValues, ...parsed } as T;
    } catch {
      return initialValues;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      // Ignore storage errors from privacy mode or quota limits.
    }
  }, [storageKey, values]);

  const clearDraft = useCallback(() => {
    setValues(initialValues);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors from privacy mode or quota limits.
    }
  }, [initialValues, storageKey]);

  return {
    values,
    setValues,
    clearDraft,
  };
}
