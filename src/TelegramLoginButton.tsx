import { useEffect, useMemo, useRef } from "react";
import type { TelegramWidgetAuthData } from "./types";

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

export interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: TelegramWidgetAuthData) => void;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: "write" | "read";
  usePic?: boolean;
  language?: string;
  className?: string;
}

let widgetCounter = 0;

export function TelegramLoginButton({
  botName,
  onAuth,
  buttonSize = "large",
  cornerRadius = 8,
  requestAccess = "write",
  usePic = true,
  language,
  className
}: TelegramLoginButtonProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const callbackName = useMemo(() => {
    widgetCounter += 1;
    return `__telegramAuthCallback_${widgetCounter}`;
  }, []);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";
    (window as Window & Record<string, unknown>)[callbackName] = (user: TelegramWidgetAuthData) => {
      onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-radius", String(cornerRadius));
    script.setAttribute("data-request-access", requestAccess);
    script.setAttribute("data-userpic", usePic ? "true" : "false");
    script.setAttribute("data-onauth", `${callbackName}(user)`);
    script.setAttribute("data-lang", language ?? "en");

    container.appendChild(script);

    return () => {
      delete (window as Window & Record<string, unknown>)[callbackName];
      container.innerHTML = "";
    };
  }, [botName, buttonSize, callbackName, cornerRadius, language, onAuth, requestAccess, usePic]);

  return <div className={className} ref={hostRef} />;
}
