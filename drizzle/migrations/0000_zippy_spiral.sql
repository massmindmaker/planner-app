CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon" varchar(50) NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_habit_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"date" date NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "daily_habit_entries_habit_id_date_unique" UNIQUE("habit_id","date")
);
--> statement-breakpoint
CREATE TABLE "daily_habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer DEFAULT 2026 NOT NULL,
	"month" integer NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"goal" integer
);
--> statement-breakpoint
CREATE TABLE "weekly_habit_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"week" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "weekly_habit_entries_habit_id_week_unique" UNIQUE("habit_id","week")
);
--> statement-breakpoint
CREATE TABLE "weekly_habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer DEFAULT 2026 NOT NULL,
	"month" integer NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yearly_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"year" integer DEFAULT 2026 NOT NULL,
	"position" integer NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"daily_habit" text,
	"weekly_habit" text,
	"monthly_habit" text
);
--> statement-breakpoint
ALTER TABLE "daily_habit_entries" ADD CONSTRAINT "daily_habit_entries_habit_id_daily_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."daily_habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_habit_entries" ADD CONSTRAINT "weekly_habit_entries_habit_id_weekly_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."weekly_habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yearly_goals" ADD CONSTRAINT "yearly_goals_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;