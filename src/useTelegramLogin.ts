import { useCallback, useMemo, useState } from "react";
import type { TelegramWidgetAuthData } from "./types";

export interface UseTelegramLoginResult {
  user: TelegramWidgetAuthData | null;
  isAuthenticated: boolean;
  handleAuth: (authData: TelegramWidgetAuthData) => void;
  reset: () => void;
}

export function useTelegramLogin(
  initialUser: TelegramWidgetAuthData | null = null
): UseTelegramLoginResult {
  const [user, setUser] = useState<TelegramWidgetAuthData | null>(initialUser);

  const handleAuth = useCallback((authData: TelegramWidgetAuthData) => {
    setUser(authData);
  }, []);

  const reset = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  return {
    user,
    isAuthenticated,
    handleAuth,
    reset
  };
}
