# Архитектура — Бесконечный Планер

## Stack

| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Next.js | 16.2.1 | App Router, API Routes, SSR |
| React | 19.2.4 | UI библиотека |
| Tailwind CSS | 4.x | Стили |
| shadcn/ui | 4.1.0 | UI компоненты (base-ui, НЕ Radix) |
| Drizzle ORM | 0.45.1 | ORM для PostgreSQL |
| Neon PostgreSQL | — | Serverless база данных |
| TanStack Query | 5.x | Client-side data fetching + кэширование |
| Recharts | 3.x | Графики (radar, bar, line, scatter) |
| Framer Motion | 12.x | Анимации (импорт: "motion/react") |
| Zod | 4.x | Валидация (API + формы) |
| sonner | 2.x | Toast уведомления |
| date-fns | 4.x | Работа с датами, ISO weeks |
| @dnd-kit | 6.x/10.x | Drag-to-reorder |
| canvas-confetti | 1.x | Confetti при достижениях |
| Lucide React | 0.577 | Иконки |

## Database Schema (18 таблиц)

### Базовые (без зависимостей)
- `categories` — 6 категорий жизни (seeded)
- `routines` — утренние/вечерние/свои рутины
- `achievements` — 15 достижений (seeded)

### Зависят от базовых
- `habit_templates` — шаблоны привычек (polarity, type, target, unit, min_version) → routines
- `life_goals` — цели на жизнь → categories

### Зависят от habit_templates/life_goals
- `yearly_goals` — годовые цели → categories, life_goals
- `daily_habits` — месячные экземпляры привычек → habit_templates
- `month_focus` — фокус месяца → yearly_goals

### Зависят от daily_habits
- `daily_habit_entries` — записи (date, completed, value, isMinimum) → daily_habits

### Еженедельные
- `weekly_habits` — недельные привычки
- `weekly_habit_entries` — записи недельных привычек

### Standalone
- `weekly_plans` — фокус недели (UNIQUE year+week)
- `reviews` — обзоры (weekly/monthly, structured questions + notes + rating)
- `energy_logs` — энергия 1-5 (UNIQUE date)
- `wheel_of_life` — колесо жизни (UNIQUE year+month+category)
- `user_achievements` — разблокированные достижения
- `user_xp` — XP записи (UNIQUE date+source+sourceId)
- `quarter_themes` — квартальные темы (UNIQUE year+quarter)

### Ключевое архитектурное решение: habit_templates

Привычки живут в двух уровнях:
1. `habit_templates` — долгоживущий шаблон (имя, тип, полярность)
2. `daily_habits` — месячный экземпляр (ссылается на template через template_id)

Это позволяет:
- Стрики считать через шаблоны (кросс-месячная непрерывность)
- Рутины привязывать к шаблонам, а не к месячным экземплярам
- Heatmap строить из всех entries через template_id

## API Routes (33 routes)

### Core CRUD
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/categories | 6 категорий |
| GET/POST | /api/goals | Годовые цели |
| PATCH/DELETE | /api/goals/[id] | CRUD цели |
| GET/POST | /api/habits/daily | Ежедневные привычки |
| PATCH/DELETE | /api/habits/daily/[id] | CRUD привычки |
| PUT | /api/habits/daily/[id]/entries | Toggle entry (+ value, isMinimum) |
| GET/POST | /api/habits/weekly | Еженедельные привычки |
| PATCH/DELETE | /api/habits/weekly/[id] | CRUD |
| PUT | /api/habits/weekly/[id]/entries | Toggle entry |
| GET | /api/stats/year | Годовая статистика + XP |
| GET | /api/stats/month/[month] | Месячная статистика + polarity |

### V2 Routes
| Метод | Путь | Описание |
|-------|------|----------|
| GET/POST | /api/life-goals | Цели на жизнь |
| PATCH/DELETE | /api/life-goals/[id] | CRUD |
| GET/POST | /api/month-focus | Фокус месяца |
| PATCH/DELETE | /api/month-focus/[id] | CRUD |
| GET/POST | /api/routines | Рутины + вложенные привычки |
| PATCH/DELETE | /api/routines/[id] | CRUD |
| GET/POST | /api/habit-templates | Шаблоны привычек |
| PATCH/DELETE | /api/habit-templates/[id] | CRUD |
| GET/POST | /api/weekly-plans | Планы на неделю (upsert) |
| PATCH/DELETE | /api/weekly-plans/[id] | CRUD |
| GET/POST | /api/reviews | Обзоры (weekly/monthly) |
| PATCH/DELETE | /api/reviews/[id] | CRUD |
| GET/PUT | /api/energy | Энергия (upsert по date) |
| GET/POST | /api/wheel | Колесо жизни (batch upsert) |
| GET | /api/achievements | Все достижения + unlock status |
| POST | /api/achievements/check | Проверка и разблокировка |
| GET/POST | /api/xp | XP total + level + recent |
| GET | /api/analytics/heatmap | Тепловая карта года |
| GET | /api/analytics/trends | Тренды по неделям |
| GET | /api/analytics/days | Статистика по дням недели |
| GET | /api/analytics/energy-correlation | Корреляция энергия↔привычки |
| GET | /api/quarter-themes | Квартальные темы (upsert) |
| GET | /api/streaks | Стрики по шаблонам |

## Структура файлов

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Sidebar + Providers
│   ├── page.tsx                # Dashboard
│   ├── goals/page.tsx          # Годовые цели
│   ├── life/page.tsx           # Цели на жизнь
│   ├── month/[month]/page.tsx  # Месячный трекер
│   ├── week/[week]/page.tsx    # Еженедельный планировщик
│   ├── routines/page.tsx       # Рутины
│   ├── wheel/page.tsx          # Колесо жизни
│   ├── analytics/page.tsx      # Аналитика
│   ├── achievements/page.tsx   # Достижения
│   ├── globals.css             # Tailwind + dark mode + custom styles
│   └── api/                    # 33 API route files
├── components/
│   ├── layout/                 # Sidebar, PageTransition
│   ├── dashboard/              # MonthCard, YearProgress, GoalsSummary, EnergyPrompt, QuarterTheme, XpSummary, HeatmapPreview, AchievementShowcase, TopStreaks, GoalHierarchyTree
│   ├── goals/                  # CategoryCard, GoalRow
│   ├── life/                   # LifeCategoryCard, LifeGoalRow
│   ├── month/                  # DailyHabitsTable, WeeklyHabitsTable, MonthHeader, MonthFocus, HabitCheckbox, HabitCreationDialog, NumericPopover, HabitContextMenu, KeyboardShortcutsModal
│   ├── week/                   # WeekHeader, WeekHabitsSummary, ReviewForm
│   ├── routines/               # RoutineCard, RoutineTimeline
│   ├── wheel/                  # RadarChart, ScoreInput, WheelHistory
│   ├── analytics/              # Heatmap, TrendChart, DayChart, MonthComparison, HabitRanking, EnergyCorrelation, StreakLeaderboard
│   ├── achievements/           # AchievementCard, XpBar, LevelBadge, AchievementToast
│   ├── shared/                 # InlineEdit, SkeletonCard, ConfirmationDialog, EmptyState
│   ├── ui/                     # shadcn components
│   └── providers.tsx           # QueryClient + Toaster + YearProvider
├── hooks/                      # 19 React Query hooks
├── contexts/                   # YearContext
└── lib/
    ├── db/schema.ts            # Drizzle schema (18 tables)
    ├── db/index.ts             # Neon connection
    ├── api.ts                  # 50+ API client functions
    ├── validators.ts           # 14 Zod schemas
    ├── utils.ts                # Helpers (cn, MONTH_NAMES, etc.)
    ├── xp.ts                   # XP values, levels, getLevel()
    └── streaks.ts              # Streak calculations
```

## Deployment

- **Hosting:** Vercel (auto-deploy from GitHub master)
- **Database:** Neon PostgreSQL (serverless)
- **URL:** https://planner-app-sigma-rosy.vercel.app/
- **GitHub:** massmindmaker/planner-app

## Паттерн добавления фичи

1. **Schema** — добавить таблицу в `src/lib/db/schema.ts`
2. **Migration** — `npx drizzle-kit generate && npx drizzle-kit push`
3. **Validator** — добавить Zod schema в `src/lib/validators.ts`
4. **API Route** — создать route в `src/app/api/`
5. **API Client** — добавить функцию в `src/lib/api.ts`
6. **Hook** — создать в `src/hooks/use-*.ts`
7. **Component** — создать в `src/components/`
8. **Page** — создать/обновить в `src/app/`

## Важные конвенции

- UI на русском языке
- shadcn/ui использует `@base-ui/react` (НЕ Radix) — нет `asChild`, используй `render` prop
- Анимации через `motion/react` (не `framer-motion`)
- Zod v4 — проверяй совместимость API
- `any` типы в API client — legacy, постепенно типизировать
