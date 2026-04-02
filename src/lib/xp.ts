export const XP_VALUES = {
  habit: 10,
  habit_minimum: 5,
  habit_numeric_full: 15,
  routine_bonus: 20,
  goal_complete: 100,
  month_focus: 30,
  review_weekly: 30,
  review_monthly: 50,
  wheel: 20,
  energy_log: 5,
  streak_7: 50,
  streak_30: 200,
  streak_100: 500,
} as const;

export const LEVELS = [
  { level: 1, title: "Новичок", xpRequired: 0 },
  { level: 2, title: "Ученик", xpRequired: 500 },
  { level: 3, title: "Практик", xpRequired: 1500 },
  { level: 4, title: "Знаток", xpRequired: 3500 },
  { level: 5, title: "Мастер", xpRequired: 7000 },
  { level: 6, title: "Эксперт", xpRequired: 12000 },
  { level: 7, title: "Гуру", xpRequired: 20000 },
  { level: 8, title: "Легенда", xpRequired: 35000 },
] as const;

export function getLevel(totalXp: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXp >= level.xpRequired) current = level;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.xpRequired > totalXp);
  return {
    ...current,
    totalXp,
    nextLevel: nextLevel ?? null,
    xpToNext: nextLevel ? nextLevel.xpRequired - totalXp : 0,
    xpInLevel: totalXp - current.xpRequired,
    xpForLevel: nextLevel ? nextLevel.xpRequired - current.xpRequired : 0,
  };
}
