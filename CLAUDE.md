@AGENTS.md

# Бесконечный Планер

Трекер привычек и целей на год → полная система планирования жизни.

## Quick Start

```bash
npm run dev          # Dev server на localhost:3000
npm run build        # Production build
npm run seed:achievements    # Засеять 15 достижений
npm run migrate:templates    # Мигрировать привычки в шаблоны
```

## Структура

- `src/app/` — 9 страниц (Dashboard, Life, Goals, Month, Week, Routines, Wheel, Analytics, Achievements)
- `src/app/api/` — 33 API routes (REST, Drizzle ORM → Neon PostgreSQL)
- `src/components/` — UI компоненты (shadcn/ui + Framer Motion)
- `src/hooks/` — 19 React Query hooks
- `src/lib/` — DB schema (18 таблиц), validators, API client, XP/streaks utils
- `src/contexts/` — YearContext
- `docs/` — USER-WORKFLOWS.md, ARCHITECTURE.md, DEVELOPMENT-LOG.md

## Конвенции

- **UI на русском** — все тексты, placeholder, toast на русском
- **shadcn/ui использует @base-ui/react** — НЕ Radix. Нет `asChild`, используй `render` prop
- **Анимации** — `import { motion } from "motion/react"` (не `framer-motion`)
- **Zod v4** — проверяй совместимость API при добавлении валидаторов
- **Паттерн фичи:** Schema → Migration → Validator → API Route → API Client → Hook → Component → Page

## Database

Neon PostgreSQL, Drizzle ORM. 18 таблиц. Ключевая архитектура: `habit_templates` → `daily_habits` (шаблон → месячные экземпляры) для кросс-месячных стриков.

## Deploy

Vercel auto-deploy из GitHub master. URL: https://planner-app-sigma-rosy.vercel.app/
