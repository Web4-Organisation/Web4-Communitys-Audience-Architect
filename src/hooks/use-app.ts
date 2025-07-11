'use client';
import { useContext } from 'react';
import { AppProvider, useApp as useAppContext } from '@/context/app-context';

// This file is kept for separation of concerns, even if it just re-exports.
// It allows for adding more logic to the hook later without changing imports everywhere.

/**
 * @deprecated Use useAppContext from `@/context/app-context` instead.
 * This hook is an alias and will be removed in a future version.
 */
export const useApp = useAppContext;
