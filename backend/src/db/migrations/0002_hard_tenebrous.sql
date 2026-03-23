CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"fountain_text" text,
	"outline_text" text,
	"title_page_data" jsonb,
	"page_size" varchar(20) DEFAULT 'us-letter',
	"font_preference" jsonb DEFAULT '{"family":"Courier Prime","size":12,"lineSpacing":1}'::jsonb
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;