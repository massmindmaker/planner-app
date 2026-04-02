CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50) NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "achievements_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "energy_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"level" integer NOT NULL,
	CONSTRAINT "energy_logs_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "habit_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"polarity" varchar(10) DEFAULT 'positive' NOT NULL,
	"habit_type" varchar(15) DEFAULT 'boolean' NOT NULL,
	"target_value" integer,
	"unit" varchar(30),
	"min_version" text,
	"routine_id" integer,
	"routine_order" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "life_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "month_focus" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"goal_id" integer,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quarter_themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"quarter" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	CONSTRAINT "quarter_themes_year_quarter_unique" UNIQUE("year","quarter")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"week" integer,
	"month" integer,
	"type" varchar(10) NOT NULL,
	"went_well" text,
	"didnt_work" text,
	"next_focus" text,
	"notes" text,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(10) DEFAULT 'custom' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"achievement_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_xp" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"xp_gained" integer NOT NULL,
	"source" varchar(50) NOT NULL,
	"source_id" integer,
	CONSTRAINT "user_xp_date_source_source_id_unique" UNIQUE("date","source","source_id")
);
--> statement-breakpoint
CREATE TABLE "weekly_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"week" integer NOT NULL,
	"focus" text,
	CONSTRAINT "weekly_plans_year_week_unique" UNIQUE("year","week")
);
--> statement-breakpoint
CREATE TABLE "wheel_of_life" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"category_id" integer NOT NULL,
	"score" integer NOT NULL,
	CONSTRAINT "wheel_of_life_year_month_category_id_unique" UNIQUE("year","month","category_id")
);
--> statement-breakpoint
ALTER TABLE "daily_habit_entries" ADD COLUMN "value" integer;--> statement-breakpoint
ALTER TABLE "daily_habit_entries" ADD COLUMN "is_minimum" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_habits" ADD COLUMN "template_id" integer;--> statement-breakpoint
ALTER TABLE "daily_habits" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "yearly_goals" ADD COLUMN "life_goal_id" integer;--> statement-breakpoint
ALTER TABLE "habit_templates" ADD CONSTRAINT "habit_templates_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "life_goals" ADD CONSTRAINT "life_goals_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "month_focus" ADD CONSTRAINT "month_focus_goal_id_yearly_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."yearly_goals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wheel_of_life" ADD CONSTRAINT "wheel_of_life_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_habits" ADD CONSTRAINT "daily_habits_template_id_habit_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."habit_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yearly_goals" ADD CONSTRAINT "yearly_goals_life_goal_id_life_goals_id_fk" FOREIGN KEY ("life_goal_id") REFERENCES "public"."life_goals"("id") ON DELETE set null ON UPDATE no action;