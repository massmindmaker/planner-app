# История разработки — Бесконечный Планер

## V1: Начальная реализация (21 марта 2026)

**12 коммитов** — от scaffolding до рабочего приложения.

- Scaffold Next.js + Tailwind + shadcn/ui
- Database schema: 6 таблиц (categories, yearly_goals, daily_habits, daily_habit_entries, weekly_habits, weekly_habit_entries)
- API routes: categories, goals, daily/weekly habits, stats
- 3 страницы: Dashboard, Goals, Month Tracker
- UI overhaul с анимациями (Framer Motion)

**Оценка:** 68/108 (63%)

---

## V2: Масштабное расширение (2 апреля 2026)

**22 задачи, 23 коммита** — выполнено за одну сессию через subagent-driven development.

### Новые фичи:
- **Goal hierarchy:** Life Goals → Year Goals → Month Focus → Habits (4 уровня)
- **Habit polarity:** Позитивные (отмечаешь когда делал) vs Негативные (отмечаешь провалы)
- **Flexible types:** Boolean + Numeric (числовые) + Weekly Target (X раз в неделю)
- **Minimum version:** Лёгкая альтернатива привычки для плохих дней (50% XP)
- **Routines:** Утренние/вечерние рутины с порядком привычек
- **Weekly Planner:** Страница недели с фокусом, сводкой привычек, энергией
- **Reviews:** Weekly + Monthly обзоры (структурированные вопросы + свободные заметки)
- **Wheel of Life:** Radar chart, оценки 1-10 по 6 категориям, история
- **Gamification:** XP (8 уровней) + 15 достижений
- **Energy Tracker:** Утренняя оценка 1-5
- **Analytics:** Heatmap, тренды, дни, сравнение месяцев, корреляция энергии, стрик-лидерборд
- **Quarter Themes:** Тема на квартал
- **Responsive:** Burger sidebar, горизонтальный скролл таблиц

### Архитектурные решения:
- `habit_templates` таблица для кросс-месячной непрерывности
- Эволюционный подход (не ломаем существующее)
- Achievement checking на Dashboard mount для пассивных стриков

### Новые таблицы: 12
### Новые API routes: 22
### Новые hooks: 12
### Новые страницы: 6

---

## V3a: UX Polish (2-3 апреля 2026)

**9 задач, 16 фиксов** — доведение V2 до production quality.

### Исправления:
1. **Confetti** при разблокировке достижений (canvas-confetti)
2. **Success toasts** на сохранение (review, wheel, theme, energy)
3. **Undo delete** — toast с "Отменить" + 5с задержка перед удалением
4. **Page transitions** — AnimatePresence mode="wait"
5. **Year switcher** — YearContext + dropdown в sidebar + localStorage
6. **Dark mode** — Sun/Moon toggle, система prefers + localStorage
7. **Numeric popover** — ввод числа для числовых привычек в таблице
8. **Min version context menu** — правый клик: Выполнено/Минимум/Не выполнено + жёлтый half-fill
9. **Streaks API** — /api/streaks + бейджи в таблице + Top Streaks на dashboard
10. **Drag-to-reorder** — @dnd-kit в таблице привычек
11. **Keyboard shortcuts** — Arrows/Space/Enter/N/? в month tracker
12. **Goal hierarchy tree** — collapsible дерево Life→Year→Month→Habit на dashboard
13. **Monthly review modal** — подключение ReviewForm к кнопке "Итоги месяца"
14. **EmptyState** компонент для onboarding

### Новые пакеты: canvas-confetti

---

## Аудит (3 апреля 2026)

### Code Audit: PASS
- 0 TypeScript ошибок
- 114 импортов — все корректны
- 19 hooks — все экспорты верны
- 50+ API функций — все на месте
- 18 таблиц — все reference правильные
- 33 API routes — все реализованы

### API Audit: 21/22 PASS
- /api/streaks — 404 из-за missing hook file (исправлено, redeployed)

---

## Технический долг

- `any` типы в API client и hooks (нужна типизация через InferSelectModel)
- EmptyState компонент создан но не интегрирован в страницы
- Weekly habits не получили template_id (нужна миграция)
- Wheel of Life end-of-month prompt на dashboard (не подключен к useWheel)
- Нет тестов (unit/integration/e2e)

---

## Следующие шаги

- **V3b:** Mini Apps (Telegram + VK + OK) + Landing page
- **V3c:** Multi-user auth через платформы
- **V3d:** Группы (buddy groups + team groups)
- **V3e:** AI Chatbot для onboarding
