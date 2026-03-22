# react-telegram-auth

React library for Telegram Login Widget with server-side validation helper.

## Installation

```bash
npm install react-telegram-auth
```

## Quick start

```tsx
import { TelegramLoginButton, useTelegramLogin } from "react-telegram-auth";

export function LoginPage() {
  const { user, isAuthenticated, handleAuth } = useTelegramLogin();

  if (isAuthenticated && user) {
    return <div>Welcome, {user.first_name}</div>;
  }

  return (
    <TelegramLoginButton
      botName="YOUR_BOT_USERNAME"
      onAuth={handleAuth}
      buttonSize="large"
      requestAccess="write"
    />
  );
}
```

## Verify Telegram data on backend

Never trust Telegram auth payload on frontend only. Verify hash on server:

```ts
import { verifyTelegramAuth, type TelegramAuthData } from "react-telegram-auth/server";

function handleTelegramCallback(payload: TelegramAuthData) {
  const isValid = verifyTelegramAuth(payload, process.env.TELEGRAM_BOT_TOKEN ?? "", {
    maxAgeSeconds: 86400
  });

  if (!isValid) {
    throw new Error("Invalid telegram auth payload");
  }

  return payload;
}
```

## API

### `TelegramLoginButton`

Props:

- `botName: string` - your bot username from BotFather
- `onAuth: (user) => void` - callback from Telegram widget
- `buttonSize?: "large" | "medium" | "small"` (default: `"large"`)
- `cornerRadius?: number` (default: `8`)
- `requestAccess?: "write" | "read"` (default: `"write"`)
- `usePic?: boolean` (default: `true`)
- `language?: string` (default: `"en"`)
- `className?: string`

### `useTelegramLogin(initialUser?)`

Returns:

- `user`
- `isAuthenticated`
- `handleAuth`
- `reset`

### `verifyTelegramAuth(authData, botToken, options?)`

- Validates Telegram hash using your bot token
- Supports expiration check via `maxAgeSeconds`

## License

MIT
