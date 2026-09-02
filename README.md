# CampusWire

A frontend-only prototype for connecting VTU-affiliated colleges in Karnataka and helping students discover college events.

## Requirements

- Node.js 18.17 or newer (Node.js 20+ recommended)
- VS Code

## Run

Open a terminal inside this folder:

```bash
npm install
npm run dev
```

Then visit:

http://localhost:3000

The app opens at `/login`. Enter any email containing `@` and a password of at least 6 characters.

## Main folders

```text
CampusWire/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── home/
│       └── page.tsx
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── next-env.d.ts
```

This version intentionally has no backend, database, API, or real authentication.
