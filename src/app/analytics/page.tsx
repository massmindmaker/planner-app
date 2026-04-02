"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heatmap } from "@/components/analytics/heatmap";
import { TrendChart } from "@/components/analytics/trend-chart";
import { DayChart } from "@/components/analytics/day-chart";
import { MonthComparison } from "@/components/analytics/month-comparison";
import { EnergyCorrelation } from "@/components/analytics/energy-correlation";
import { HabitRanking } from "@/components/analytics/habit-ranking";
import { StreakLeaderboard } from "@/components/analytics/streak-leaderboard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-muted h-48 ${className ?? ""}`} />
  );
}

export default function AnalyticsPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={cardVariants}>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-muted-foreground mt-1">
          Статистика привычек за год
        </p>
      </motion.div>

      {/* Heatmap — full width */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Тепловая карта года</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Heatmap />
          </CardContent>
        </Card>
      </motion.div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly trends */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Тренд по неделям</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Day of week */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>По дням недели</CardTitle>
            </CardHeader>
            <CardContent>
              <DayChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Month comparison */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Сравнение месяцев</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthComparison />
            </CardContent>
          </Card>
        </motion.div>

        {/* Energy correlation */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Энергия vs выполнение</CardTitle>
            </CardHeader>
            <CardContent>
              <EnergyCorrelation />
            </CardContent>
          </Card>
        </motion.div>

        {/* Habit ranking */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Рейтинг привычек</CardTitle>
            </CardHeader>
            <CardContent>
              <HabitRanking />
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak leaderboard */}
        <motion.div variants={cardVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Серии привычек</CardTitle>
            </CardHeader>
            <CardContent>
              <StreakLeaderboard />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
