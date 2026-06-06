use this file to help you to create the file arch and create them with the correct names

sentinela-mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── alertas.tsx
│       ├── forecast.tsx
│       └── settings.tsx
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Button.tsx
│   │   ├── HriIndicator.tsx
│   │   ├── AlertaCard.tsx
│   │   └── ForecastChart.tsx
│   ├── context/
│   │   ├── AlertaContext.tsx
│   │   └── UserContext.tsx
│   ├── services/
│   │   └── api.ts
│   ├── hooks/
│   │   ├── useAlertas.ts
│   │   └── useRegiao.ts
│   ├── types/
│   │   ├── alerta.ts
│   │   └── regiao.ts
│   └── constants/
│       ├── colors.ts
│       └── config.ts
├── app.json
├── tsconfig.json
└── package.json