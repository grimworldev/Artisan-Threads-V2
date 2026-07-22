import { useCallback } from 'react';

export type GetInitialsFn = (firstName?: string | null, lastName?: string | null) => string;

function getInitial(value: string): string {
    return Array.from(value.trim())[0] ?? '';
}


export function useInitials(): GetInitialsFn {
    return useCallback((firstName?: string | null, lastName?: string | null): string => {
        const first = firstName ? getInitial(firstName) : '';
        const last = lastName ? getInitial(lastName) : '';

        return `${first}${last}`.toUpperCase();
    }, []);
}
