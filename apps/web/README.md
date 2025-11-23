# @real-estate/web

Next.js web application for the Uzbekistan Real Estate Platform.

## Features

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Internationalization (i18n) with next-intl
  - Supported locales: English (en), Russian (ru), Uzbek (uz)
- API client for backend integration
- Responsive design

## Development

```bash
# Install dependencies (from project root)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── i18n/                  # Internationalization
│   ├── config.ts          # i18n configuration
│   ├── request.ts         # Next-intl request config
│   └── locales/           # Translation files
│       ├── en.json
│       ├── ru.json
│       └── uz.json
├── lib/                   # Utilities and helpers
│   └── api-client.ts      # API client for backend
└── middleware.ts          # Next.js middleware for i18n
```

## Routing

The application uses locale-based routing:

- `/en` - English version
- `/ru` - Russian version
- `/uz` - Uzbek version

Root path `/` redirects to `/en` by default.
