import { useAuth } from '../context/AuthContext';

/**
 * Returns a `visitTool(url)` function.
 * - Logged in  → opens the URL immediately in a new tab.
 * - Logged out → stores the URL as `pendingToolUrl` and calls `onRequireLogin`.
 */
export function useToolVisit(onRequireLogin: () => void) {
    const { user, setPendingToolUrl } = useAuth();

    const visitTool = (url: string) => {
        if (user) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            setPendingToolUrl(url);
            onRequireLogin();
        }
    };

    return { visitTool };
}
