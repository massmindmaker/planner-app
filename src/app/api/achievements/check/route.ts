import { db } from "@/lib/db";
import {
  achievements,
  userAchievements,
  habitTemplates,
  yearlyGoals,
  dailyHabits,
  dailyHabitEntries,
  reviews,
  monthFocus,
  userXp,
  wheelOfLife,
  energyLogs,
} from "@/lib/db/schema";
import { eq, and, gte, lte, count, sum, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get all achievements
    const allAchievements = await db.select().from(achievements);
    // Get already-unlocked achievements
    const alreadyUnlocked = await db.select().from(userAchievements);
    const unlockedIds = new Set(alreadyUnlocked.map((ua) => ua.achievementId));

    // Find achievements not yet unlocked
    const pendingAchievements = allAchievements.filter((a) => !unlockedIds.has(a.id));

    if (pendingAchievements.length === 0) {
      return NextResponse.json([]);
    }

    const newlyUnlocked: typeof allAchievements = [];

    for (const achievement of pendingAchievements) {
      let met = false;

      switch (achievement.code) {
        case "first_habit": {
          const [row] = await db.select({ cnt: count() }).from(habitTemplates);
          met = (row?.cnt ?? 0) > 0;
          break;
        }

        case "first_goal": {
          const [row] = await db.select({ cnt: count() }).from(yearlyGoals);
          met = (row?.cnt ?? 0) > 0;
          break;
        }

        case "streak_7":
        case "streak_30":
        case "streak_100": {
          const streakTarget = achievement.code === "streak_7" ? 7 : achievement.code === "streak_30" ? 30 : 100;

          // Get all habit templates
          const templates = await db.select({ id: habitTemplates.id }).from(habitTemplates);

          for (const template of templates) {
            // Get all daily habits for this template
            const habits = await db
              .select({ id: dailyHabits.id })
              .from(dailyHabits)
              .where(eq(dailyHabits.templateId, template.id));

            if (habits.length === 0) continue;

            const habitIds = habits.map((h) => h.id);

            // Get all completed entries for these habits, ordered by date
            const entries = await db
              .select({ date: dailyHabitEntries.date })
              .from(dailyHabitEntries)
              .where(
                and(
                  eq(dailyHabitEntries.completed, true),
                  sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                )
              )
              .orderBy(dailyHabitEntries.date);

            // Check for consecutive days streak
            if (entries.length < streakTarget) continue;

            const dates = entries.map((e) => new Date(e.date).getTime());
            let streak = 1;
            let maxStreak = 1;
            for (let i = 1; i < dates.length; i++) {
              const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
              if (diff === 1) {
                streak++;
                maxStreak = Math.max(maxStreak, streak);
              } else if (diff > 1) {
                streak = 1;
              }
            }
            if (maxStreak >= streakTarget) {
              met = true;
              break;
            }
          }
          break;
        }

        case "perfect_week": {
          // Find any week where all habits were completed every day
          // Get distinct year/month combos from dailyHabits
          const months = await db
            .selectDistinct({ year: dailyHabits.year, month: dailyHabits.month })
            .from(dailyHabits);

          for (const { year, month } of months) {
            const habits = await db
              .select({ id: dailyHabits.id })
              .from(dailyHabits)
              .where(and(eq(dailyHabits.year, year), eq(dailyHabits.month, month)));

            if (habits.length === 0) continue;

            // Check each week (Mon-Sun) in this month
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let startDay = 1; startDay <= daysInMonth; startDay += 7) {
              const endDay = Math.min(startDay + 6, daysInMonth);
              const days = endDay - startDay + 1;
              const totalExpected = habits.length * days;

              const startDate = `${year}-${String(month).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
              const endDate = `${year}-${String(month).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;

              const habitIds = habits.map((h) => h.id);
              const [row] = await db
                .select({ cnt: count() })
                .from(dailyHabitEntries)
                .where(
                  and(
                    eq(dailyHabitEntries.completed, true),
                    gte(dailyHabitEntries.date, startDate),
                    lte(dailyHabitEntries.date, endDate),
                    sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                  )
                );

              if ((row?.cnt ?? 0) >= totalExpected && totalExpected > 0) {
                met = true;
                break;
              }
            }
            if (met) break;
          }
          break;
        }

        case "perfect_month": {
          const months = await db
            .selectDistinct({ year: dailyHabits.year, month: dailyHabits.month })
            .from(dailyHabits);

          for (const { year, month } of months) {
            const habits = await db
              .select({ id: dailyHabits.id })
              .from(dailyHabits)
              .where(and(eq(dailyHabits.year, year), eq(dailyHabits.month, month)));

            if (habits.length === 0) continue;

            const daysInMonth = new Date(year, month, 0).getDate();
            const totalExpected = habits.length * daysInMonth;

            const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
            const endDate = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
            const habitIds = habits.map((h) => h.id);

            const [row] = await db
              .select({ cnt: count() })
              .from(dailyHabitEntries)
              .where(
                and(
                  eq(dailyHabitEntries.completed, true),
                  gte(dailyHabitEntries.date, startDate),
                  lte(dailyHabitEntries.date, endDate),
                  sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                )
              );

            if ((row?.cnt ?? 0) >= totalExpected && totalExpected > 0) {
              met = true;
              break;
            }
          }
          break;
        }

        case "first_review": {
          const [row] = await db.select({ cnt: count() }).from(reviews);
          met = (row?.cnt ?? 0) > 0;
          break;
        }

        case "goal_complete": {
          const [row] = await db
            .select({ cnt: count() })
            .from(yearlyGoals)
            .where(eq(yearlyGoals.completed, true));
          met = (row?.cnt ?? 0) > 0;
          break;
        }

        case "all_month_focus": {
          // Find any year/month combo where all monthFocus items are completed
          const months = await db
            .selectDistinct({ year: monthFocus.year, month: monthFocus.month })
            .from(monthFocus);

          for (const { year, month } of months) {
            const [totRow] = await db
              .select({ cnt: count() })
              .from(monthFocus)
              .where(and(eq(monthFocus.year, year), eq(monthFocus.month, month)));
            const [compRow] = await db
              .select({ cnt: count() })
              .from(monthFocus)
              .where(
                and(
                  eq(monthFocus.year, year),
                  eq(monthFocus.month, month),
                  eq(monthFocus.completed, true)
                )
              );

            const total = totRow?.cnt ?? 0;
            const completed = compRow?.cnt ?? 0;
            if (total > 0 && completed === total) {
              met = true;
              break;
            }
          }
          break;
        }

        case "level_up": {
          const [row] = await db.select({ total: sum(userXp.xpGained) }).from(userXp);
          met = Number(row?.total ?? 0) >= 500;
          break;
        }

        case "routine_master": {
          // Check for any habit template with a 30-day streak
          const templates = await db.select({ id: habitTemplates.id }).from(habitTemplates);

          for (const template of templates) {
            const habits = await db
              .select({ id: dailyHabits.id })
              .from(dailyHabits)
              .where(eq(dailyHabits.templateId, template.id));

            if (habits.length === 0) continue;

            const habitIds = habits.map((h) => h.id);
            const entries = await db
              .select({ date: dailyHabitEntries.date })
              .from(dailyHabitEntries)
              .where(
                and(
                  eq(dailyHabitEntries.completed, true),
                  sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                )
              )
              .orderBy(dailyHabitEntries.date);

            if (entries.length < 30) continue;

            const dates = entries.map((e) => new Date(e.date).getTime());
            let streak = 1;
            let maxStreak = 1;
            for (let i = 1; i < dates.length; i++) {
              const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
              if (diff === 1) {
                streak++;
                maxStreak = Math.max(maxStreak, streak);
              } else if (diff > 1) {
                streak = 1;
              }
            }
            if (maxStreak >= 30) {
              met = true;
              break;
            }
          }
          break;
        }

        case "clean_month": {
          // Any negative habit with 0 failures in a full month
          const negativeTemplates = await db
            .select({ id: habitTemplates.id })
            .from(habitTemplates)
            .where(eq(habitTemplates.polarity, "negative"));

          for (const template of negativeTemplates) {
            const months = await db
              .selectDistinct({ year: dailyHabits.year, month: dailyHabits.month })
              .from(dailyHabits)
              .where(eq(dailyHabits.templateId, template.id));

            for (const { year, month } of months) {
              const habits = await db
                .select({ id: dailyHabits.id })
                .from(dailyHabits)
                .where(
                  and(
                    eq(dailyHabits.templateId, template.id),
                    eq(dailyHabits.year, year),
                    eq(dailyHabits.month, month)
                  )
                );

              if (habits.length === 0) continue;

              const habitIds = habits.map((h) => h.id);
              const daysInMonth = new Date(year, month, 0).getDate();
              const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
              const endDate = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

              // For negative habits, "failure" = completed = true
              const [row] = await db
                .select({ cnt: count() })
                .from(dailyHabitEntries)
                .where(
                  and(
                    eq(dailyHabitEntries.completed, true),
                    gte(dailyHabitEntries.date, startDate),
                    lte(dailyHabitEntries.date, endDate),
                    sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                  )
                );

              if ((row?.cnt ?? 0) === 0) {
                // Also verify there are entries for this month (it was a "full" month of tracking)
                const [totalRow] = await db
                  .select({ cnt: count() })
                  .from(dailyHabitEntries)
                  .where(
                    and(
                      gte(dailyHabitEntries.date, startDate),
                      lte(dailyHabitEntries.date, endDate),
                      sql`${dailyHabitEntries.habitId} = ANY(ARRAY[${sql.join(habitIds.map((id) => sql`${id}`), sql`, `)}]::int[])`
                    )
                  );
                if ((totalRow?.cnt ?? 0) > 0) {
                  met = true;
                  break;
                }
              }
            }
            if (met) break;
          }
          break;
        }

        case "wheel_first": {
          const [row] = await db.select({ cnt: count() }).from(wheelOfLife);
          met = (row?.cnt ?? 0) > 0;
          break;
        }

        case "energy_week": {
          // 7 consecutive energy logs
          const logs = await db
            .select({ date: energyLogs.date })
            .from(energyLogs)
            .orderBy(energyLogs.date);

          if (logs.length < 7) break;

          const dates = logs.map((l) => new Date(l.date).getTime());
          let streak = 1;
          for (let i = 1; i < dates.length; i++) {
            const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
              streak++;
              if (streak >= 7) {
                met = true;
                break;
              }
            } else if (diff > 1) {
              streak = 1;
            }
          }
          break;
        }

        default:
          break;
      }

      if (met) {
        // Insert into userAchievements
        await db
          .insert(userAchievements)
          .values({ achievementId: achievement.id })
          .onConflictDoNothing();

        // Award XP
        if (achievement.xpReward > 0) {
          const today = new Date().toISOString().split("T")[0];
          await db
            .insert(userXp)
            .values({
              date: today,
              xpGained: achievement.xpReward,
              source: "achievement",
              sourceId: achievement.id,
            })
            .onConflictDoNothing();
        }

        newlyUnlocked.push(achievement);
      }
    }

    return NextResponse.json(newlyUnlocked);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
