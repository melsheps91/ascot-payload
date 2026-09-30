import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_banner_buttons_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_banner_variant" AS ENUM('home', 'large', 'split', 'default');
  CREATE TYPE "public"."enum_pages_blocks_banner_scroll_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_banner_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_banner_image_position" AS ENUM('focal', 'top', 'center', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_banner_video_type" AS ENUM('youtube', 'local');
  CREATE TYPE "public"."enum_pages_blocks_ticker_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_intro_content_buttons_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_intro_content_heading_links_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_intro_content_layout" AS ENUM('split', 'centred');
  CREATE TYPE "public"."enum_pages_blocks_intro_content_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_product_cards_manual_cards_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_product_cards_manual_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_product_cards_manual_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_grid_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_style" AS ENUM('bordered', 'cards', 'row', 'pills');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_rows_buttons_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_rows_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_rows_image_fit" AS ENUM('cover', 'fit');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_rows_video_type" AS ENUM('youtube', 'local');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_first_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_repeater_content_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_timeline_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_logo_grid_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_logo_grid_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_gallery_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_gallery_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_style" AS ENUM('quote', 'grid', 'slider');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_jobs_list_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_jobs_list_cta_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_jobs_list_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_latest_news_intro_button_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_pages_blocks_latest_news_theme" AS ENUM('light', 'grey', 'dark');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_forms_blocks_upload_upload_collection" AS ENUM('cvs');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_forms_redirect_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_header_cta_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_footer_menu_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_footer_legal_links_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TYPE "public"."enum_job_settings_why_link_style" AS ENUM('auto', 'primary', 'secondary', 'text', 'icon');
  CREATE TABLE "pages_blocks_banner_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_banner_buttons_button_style" DEFAULT 'auto',
  	"button_icon" varchar,
  	"button_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_banner_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_banner_variant" DEFAULT 'large' NOT NULL,
  	"pre_heading" varchar,
  	"heading" varchar,
  	"scroll_link_label" varchar,
  	"scroll_link_url" varchar,
  	"scroll_link_style" "enum_pages_blocks_banner_scroll_link_style" DEFAULT 'auto',
  	"scroll_link_icon" varchar,
  	"scroll_link_new_tab" boolean,
  	"type" "enum_pages_blocks_banner_type" DEFAULT 'image',
  	"text" varchar,
  	"image_position" "enum_pages_blocks_banner_image_position" DEFAULT 'focal',
  	"video_type" "enum_pages_blocks_banner_video_type" DEFAULT 'youtube',
  	"youtube" varchar,
  	"video_id" integer,
  	"full_video_id" integer,
  	"video_fallback_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ticker_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_ticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"duration" numeric DEFAULT 40,
  	"theme" "enum_pages_blocks_ticker_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_intro_content_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_intro_content_buttons_button_style" DEFAULT 'auto',
  	"button_icon" varchar,
  	"button_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_intro_content_heading_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_intro_content_heading_links_button_style" DEFAULT 'auto',
  	"button_icon" varchar,
  	"button_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_intro_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_intro_content_layout" DEFAULT 'split' NOT NULL,
  	"heading" varchar,
  	"eyebrow" varchar,
  	"stat_value" varchar,
  	"stat_caption" varchar,
  	"content" jsonb NOT NULL,
  	"image_id" integer,
  	"theme" "enum_pages_blocks_intro_content_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_cards_manual_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar NOT NULL,
  	"link_url" varchar NOT NULL,
  	"link_style" "enum_pages_blocks_product_cards_manual_cards_link_style" DEFAULT 'auto',
  	"link_icon" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_product_cards_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_product_cards_manual_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"theme" "enum_pages_blocks_product_cards_manual_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_grid_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"image_id" integer,
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"link_style" "enum_pages_blocks_icon_grid_grid_link_style" DEFAULT 'auto',
  	"link_icon" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_icon_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_icon_grid_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"style" "enum_pages_blocks_icon_grid_style" DEFAULT 'bordered' NOT NULL,
  	"numbered" boolean,
  	"theme" "enum_pages_blocks_icon_grid_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_repeater_content_rows_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_repeater_content_rows_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_repeater_content_rows_buttons_button_style" DEFAULT 'auto',
  	"button_icon" varchar,
  	"button_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_repeater_content_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"logo_id" integer,
  	"heading" varchar,
  	"content" jsonb,
  	"media_type" "enum_pages_blocks_repeater_content_rows_media_type" DEFAULT 'image',
  	"image_fit" "enum_pages_blocks_repeater_content_rows_image_fit" DEFAULT 'cover',
  	"video_type" "enum_pages_blocks_repeater_content_rows_video_type" DEFAULT 'youtube',
  	"youtube_link" varchar,
  	"video_id" integer,
  	"video_poster_id" integer
  );
  
  CREATE TABLE "pages_blocks_repeater_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"first_image_side" "enum_pages_blocks_repeater_content_first_image_side" DEFAULT 'left',
  	"theme" "enum_pages_blocks_repeater_content_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"theme" "enum_pages_blocks_timeline_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_grid_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_logo_grid_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"theme" "enum_pages_blocks_logo_grid_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_gallery_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"theme" "enum_pages_blocks_gallery_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_testimonials_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"style" "enum_pages_blocks_testimonials_style" DEFAULT 'grid' NOT NULL,
  	"theme" "enum_pages_blocks_testimonials_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_jobs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_jobs_list_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"empty_text" varchar DEFAULT 'No roles match your search — send us your CV instead.',
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"cta_button_label" varchar,
  	"cta_button_url" varchar,
  	"cta_button_style" "enum_pages_blocks_jobs_list_cta_button_style" DEFAULT 'auto',
  	"cta_button_icon" varchar,
  	"cta_button_new_tab" boolean,
  	"theme" "enum_pages_blocks_jobs_list_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_posts_loop" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"per_page" numeric DEFAULT 13,
  	"show_filters" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_latest_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_text" varchar,
  	"intro_button_label" varchar,
  	"intro_button_url" varchar,
  	"intro_button_style" "enum_pages_blocks_latest_news_intro_button_style" DEFAULT 'auto',
  	"intro_button_icon" varchar,
  	"intro_button_new_tab" boolean,
  	"limit" numeric DEFAULT 3,
  	"theme" "enum_pages_blocks_latest_news_theme" DEFAULT 'light' NOT NULL,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"show_contact_details" boolean DEFAULT true,
  	"form_heading" varchar,
  	"form_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_sections_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_numbered_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contents_heading" varchar DEFAULT 'Contents',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"company_name" varchar,
  	"quote" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"category_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"hero_image_id" integer,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "jobs_duties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"status" "enum_jobs_status" DEFAULT 'open' NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"company" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"type" varchar DEFAULT 'Full-time',
  	"hours" varchar,
  	"summary" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cvs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_upload_mime_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mime_type" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_upload" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"upload_collection" "enum_forms_blocks_upload_upload_collection" NOT NULL,
  	"width" numeric,
  	"max_file_size" numeric,
  	"required" boolean,
  	"multiple" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_type" "enum_forms_redirect_type" DEFAULT 'reference',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_uploads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"job_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cvs_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"media_id" integer,
  	"testimonials_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"jobs_id" integer,
  	"cvs_id" integer,
  	"users_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_url" varchar NOT NULL,
  	"link_style" "enum_header_nav_items_link_style" DEFAULT 'auto',
  	"link_icon" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"cta_style" "enum_header_cta_style" DEFAULT 'auto',
  	"cta_icon" varchar,
  	"cta_new_tab" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_url" varchar NOT NULL,
  	"link_style" "enum_footer_menu_link_style" DEFAULT 'auto',
  	"link_icon" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_url" varchar NOT NULL,
  	"link_style" "enum_footer_legal_links_link_style" DEFAULT 'auto',
  	"link_icon" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"badge_id" integer,
  	"menu_heading" varchar DEFAULT 'Information',
  	"address_heading" varchar DEFAULT 'Address',
  	"contact_heading" varchar DEFAULT 'Get in touch',
  	"copyright" varchar DEFAULT '© Copyright {year} {company}',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_details_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "company_details_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "company_details_email_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "company_details_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "company_details" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"reg_number" varchar,
  	"address_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "job_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"application_form_id" integer NOT NULL,
  	"why_heading" varchar,
  	"why_text" varchar,
  	"why_link_label" varchar,
  	"why_link_url" varchar,
  	"why_link_style" "enum_job_settings_why_link_style" DEFAULT 'auto',
  	"why_link_icon" varchar,
  	"why_link_new_tab" boolean,
  	"general_heading" varchar DEFAULT 'Apply for *other roles.*',
  	"general_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_banner_buttons" ADD CONSTRAINT "pages_blocks_banner_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner_stats" ADD CONSTRAINT "pages_blocks_banner_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_full_video_id_media_id_fk" FOREIGN KEY ("full_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_video_fallback_id_media_id_fk" FOREIGN KEY ("video_fallback_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ticker_items" ADD CONSTRAINT "pages_blocks_ticker_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ticker"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ticker" ADD CONSTRAINT "pages_blocks_ticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro_content_buttons" ADD CONSTRAINT "pages_blocks_intro_content_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_intro_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro_content_heading_links" ADD CONSTRAINT "pages_blocks_intro_content_heading_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_intro_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro_content" ADD CONSTRAINT "pages_blocks_intro_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_intro_content" ADD CONSTRAINT "pages_blocks_intro_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards_manual_cards" ADD CONSTRAINT "pages_blocks_product_cards_manual_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards_manual_cards" ADD CONSTRAINT "pages_blocks_product_cards_manual_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_cards_manual"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards_manual" ADD CONSTRAINT "pages_blocks_product_cards_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid_grid" ADD CONSTRAINT "pages_blocks_icon_grid_grid_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid_grid" ADD CONSTRAINT "pages_blocks_icon_grid_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid" ADD CONSTRAINT "pages_blocks_icon_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows_tags" ADD CONSTRAINT "pages_blocks_repeater_content_rows_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_repeater_content_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows_buttons" ADD CONSTRAINT "pages_blocks_repeater_content_rows_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_repeater_content_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows" ADD CONSTRAINT "pages_blocks_repeater_content_rows_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows" ADD CONSTRAINT "pages_blocks_repeater_content_rows_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows" ADD CONSTRAINT "pages_blocks_repeater_content_rows_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content_rows" ADD CONSTRAINT "pages_blocks_repeater_content_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_repeater_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_repeater_content" ADD CONSTRAINT "pages_blocks_repeater_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid_logos" ADD CONSTRAINT "pages_blocks_logo_grid_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid_logos" ADD CONSTRAINT "pages_blocks_logo_grid_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid" ADD CONSTRAINT "pages_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_jobs_list" ADD CONSTRAINT "pages_blocks_jobs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_loop" ADD CONSTRAINT "pages_blocks_posts_loop_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_news" ADD CONSTRAINT "pages_blocks_latest_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_sections_sections" ADD CONSTRAINT "pages_blocks_numbered_sections_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_numbered_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_sections" ADD CONSTRAINT "pages_blocks_numbered_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_duties" ADD CONSTRAINT "jobs_duties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_requirements" ADD CONSTRAINT "jobs_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload_mime_types" ADD CONSTRAINT "forms_blocks_upload_mime_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_upload"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload" ADD CONSTRAINT "forms_blocks_upload_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_uploads" ADD CONSTRAINT "form_submissions_submission_uploads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_cvs_fk" FOREIGN KEY ("cvs_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cvs_fk" FOREIGN KEY ("cvs_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_menu" ADD CONSTRAINT "footer_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "company_details_address" ADD CONSTRAINT "company_details_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_details_phone_numbers" ADD CONSTRAINT "company_details_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_details_email_addresses" ADD CONSTRAINT "company_details_email_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_details_social_links" ADD CONSTRAINT "company_details_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_settings" ADD CONSTRAINT "job_settings_application_form_id_forms_id_fk" FOREIGN KEY ("application_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_banner_buttons_order_idx" ON "pages_blocks_banner_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_buttons_parent_id_idx" ON "pages_blocks_banner_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_stats_order_idx" ON "pages_blocks_banner_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_stats_parent_id_idx" ON "pages_blocks_banner_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_order_idx" ON "pages_blocks_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_parent_id_idx" ON "pages_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_path_idx" ON "pages_blocks_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_banner_video_idx" ON "pages_blocks_banner" USING btree ("video_id");
  CREATE INDEX "pages_blocks_banner_full_video_idx" ON "pages_blocks_banner" USING btree ("full_video_id");
  CREATE INDEX "pages_blocks_banner_video_fallback_idx" ON "pages_blocks_banner" USING btree ("video_fallback_id");
  CREATE INDEX "pages_blocks_ticker_items_order_idx" ON "pages_blocks_ticker_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_ticker_items_parent_id_idx" ON "pages_blocks_ticker_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ticker_order_idx" ON "pages_blocks_ticker" USING btree ("_order");
  CREATE INDEX "pages_blocks_ticker_parent_id_idx" ON "pages_blocks_ticker" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ticker_path_idx" ON "pages_blocks_ticker" USING btree ("_path");
  CREATE INDEX "pages_blocks_intro_content_buttons_order_idx" ON "pages_blocks_intro_content_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_content_buttons_parent_id_idx" ON "pages_blocks_intro_content_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_content_heading_links_order_idx" ON "pages_blocks_intro_content_heading_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_content_heading_links_parent_id_idx" ON "pages_blocks_intro_content_heading_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_content_order_idx" ON "pages_blocks_intro_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_intro_content_parent_id_idx" ON "pages_blocks_intro_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_intro_content_path_idx" ON "pages_blocks_intro_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_intro_content_image_idx" ON "pages_blocks_intro_content" USING btree ("image_id");
  CREATE INDEX "pages_blocks_product_cards_manual_cards_order_idx" ON "pages_blocks_product_cards_manual_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_cards_manual_cards_parent_id_idx" ON "pages_blocks_product_cards_manual_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_cards_manual_cards_image_idx" ON "pages_blocks_product_cards_manual_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_product_cards_manual_order_idx" ON "pages_blocks_product_cards_manual" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_cards_manual_parent_id_idx" ON "pages_blocks_product_cards_manual" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_cards_manual_path_idx" ON "pages_blocks_product_cards_manual" USING btree ("_path");
  CREATE INDEX "pages_blocks_icon_grid_grid_order_idx" ON "pages_blocks_icon_grid_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_grid_grid_parent_id_idx" ON "pages_blocks_icon_grid_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_grid_grid_image_idx" ON "pages_blocks_icon_grid_grid" USING btree ("image_id");
  CREATE INDEX "pages_blocks_icon_grid_order_idx" ON "pages_blocks_icon_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_grid_parent_id_idx" ON "pages_blocks_icon_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_grid_path_idx" ON "pages_blocks_icon_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_repeater_content_rows_tags_order_idx" ON "pages_blocks_repeater_content_rows_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_repeater_content_rows_tags_parent_id_idx" ON "pages_blocks_repeater_content_rows_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_repeater_content_rows_buttons_order_idx" ON "pages_blocks_repeater_content_rows_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_repeater_content_rows_buttons_parent_id_idx" ON "pages_blocks_repeater_content_rows_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_repeater_content_rows_order_idx" ON "pages_blocks_repeater_content_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_repeater_content_rows_parent_id_idx" ON "pages_blocks_repeater_content_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_repeater_content_rows_logo_idx" ON "pages_blocks_repeater_content_rows" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_repeater_content_rows_video_idx" ON "pages_blocks_repeater_content_rows" USING btree ("video_id");
  CREATE INDEX "pages_blocks_repeater_content_rows_video_poster_idx" ON "pages_blocks_repeater_content_rows" USING btree ("video_poster_id");
  CREATE INDEX "pages_blocks_repeater_content_order_idx" ON "pages_blocks_repeater_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_repeater_content_parent_id_idx" ON "pages_blocks_repeater_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_repeater_content_path_idx" ON "pages_blocks_repeater_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_grid_logos_order_idx" ON "pages_blocks_logo_grid_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_grid_logos_parent_id_idx" ON "pages_blocks_logo_grid_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_grid_logos_logo_idx" ON "pages_blocks_logo_grid_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_grid_order_idx" ON "pages_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_grid_parent_id_idx" ON "pages_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_grid_path_idx" ON "pages_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_jobs_list_order_idx" ON "pages_blocks_jobs_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_jobs_list_parent_id_idx" ON "pages_blocks_jobs_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_jobs_list_path_idx" ON "pages_blocks_jobs_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_posts_loop_order_idx" ON "pages_blocks_posts_loop" USING btree ("_order");
  CREATE INDEX "pages_blocks_posts_loop_parent_id_idx" ON "pages_blocks_posts_loop" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_loop_path_idx" ON "pages_blocks_posts_loop" USING btree ("_path");
  CREATE INDEX "pages_blocks_latest_news_order_idx" ON "pages_blocks_latest_news" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_news_parent_id_idx" ON "pages_blocks_latest_news" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_news_path_idx" ON "pages_blocks_latest_news" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_section_order_idx" ON "pages_blocks_form_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_parent_id_idx" ON "pages_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_path_idx" ON "pages_blocks_form_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_section_form_idx" ON "pages_blocks_form_section" USING btree ("form_id");
  CREATE INDEX "pages_blocks_numbered_sections_sections_order_idx" ON "pages_blocks_numbered_sections_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_sections_sections_parent_id_idx" ON "pages_blocks_numbered_sections_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_sections_order_idx" ON "pages_blocks_numbered_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_sections_parent_id_idx" ON "pages_blocks_numbered_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_sections_path_idx" ON "pages_blocks_numbered_sections" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "testimonials_image_idx" ON "testimonials" USING btree ("image_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "jobs_duties_order_idx" ON "jobs_duties" USING btree ("_order");
  CREATE INDEX "jobs_duties_parent_id_idx" ON "jobs_duties" USING btree ("_parent_id");
  CREATE INDEX "jobs_requirements_order_idx" ON "jobs_requirements" USING btree ("_order");
  CREATE INDEX "jobs_requirements_parent_id_idx" ON "jobs_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "cvs_updated_at_idx" ON "cvs" USING btree ("updated_at");
  CREATE INDEX "cvs_created_at_idx" ON "cvs" USING btree ("created_at");
  CREATE UNIQUE INDEX "cvs_filename_idx" ON "cvs" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_blocks_upload_mime_types_order_idx" ON "forms_blocks_upload_mime_types" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_mime_types_parent_id_idx" ON "forms_blocks_upload_mime_types" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_order_idx" ON "forms_blocks_upload" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_parent_id_idx" ON "forms_blocks_upload" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_path_idx" ON "forms_blocks_upload" USING btree ("_path");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_rels_order_idx" ON "forms_rels" USING btree ("order");
  CREATE INDEX "forms_rels_parent_idx" ON "forms_rels" USING btree ("parent_id");
  CREATE INDEX "forms_rels_path_idx" ON "forms_rels" USING btree ("path");
  CREATE INDEX "forms_rels_pages_id_idx" ON "forms_rels" USING btree ("pages_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_submission_uploads_order_idx" ON "form_submissions_submission_uploads" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_uploads_parent_id_idx" ON "form_submissions_submission_uploads" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_job_idx" ON "form_submissions" USING btree ("job_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_rels_order_idx" ON "form_submissions_rels" USING btree ("order");
  CREATE INDEX "form_submissions_rels_parent_idx" ON "form_submissions_rels" USING btree ("parent_id");
  CREATE INDEX "form_submissions_rels_path_idx" ON "form_submissions_rels" USING btree ("path");
  CREATE INDEX "form_submissions_rels_cvs_id_idx" ON "form_submissions_rels" USING btree ("cvs_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_cvs_id_idx" ON "payload_locked_documents_rels" USING btree ("cvs_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "footer_menu_order_idx" ON "footer_menu" USING btree ("_order");
  CREATE INDEX "footer_menu_parent_id_idx" ON "footer_menu" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE INDEX "footer_badge_idx" ON "footer" USING btree ("badge_id");
  CREATE INDEX "company_details_address_order_idx" ON "company_details_address" USING btree ("_order");
  CREATE INDEX "company_details_address_parent_id_idx" ON "company_details_address" USING btree ("_parent_id");
  CREATE INDEX "company_details_phone_numbers_order_idx" ON "company_details_phone_numbers" USING btree ("_order");
  CREATE INDEX "company_details_phone_numbers_parent_id_idx" ON "company_details_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX "company_details_email_addresses_order_idx" ON "company_details_email_addresses" USING btree ("_order");
  CREATE INDEX "company_details_email_addresses_parent_id_idx" ON "company_details_email_addresses" USING btree ("_parent_id");
  CREATE INDEX "company_details_social_links_order_idx" ON "company_details_social_links" USING btree ("_order");
  CREATE INDEX "company_details_social_links_parent_id_idx" ON "company_details_social_links" USING btree ("_parent_id");
  CREATE INDEX "job_settings_application_form_idx" ON "job_settings" USING btree ("application_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_banner_buttons" CASCADE;
  DROP TABLE "pages_blocks_banner_stats" CASCADE;
  DROP TABLE "pages_blocks_banner" CASCADE;
  DROP TABLE "pages_blocks_ticker_items" CASCADE;
  DROP TABLE "pages_blocks_ticker" CASCADE;
  DROP TABLE "pages_blocks_intro_content_buttons" CASCADE;
  DROP TABLE "pages_blocks_intro_content_heading_links" CASCADE;
  DROP TABLE "pages_blocks_intro_content" CASCADE;
  DROP TABLE "pages_blocks_product_cards_manual_cards" CASCADE;
  DROP TABLE "pages_blocks_product_cards_manual" CASCADE;
  DROP TABLE "pages_blocks_icon_grid_grid" CASCADE;
  DROP TABLE "pages_blocks_icon_grid" CASCADE;
  DROP TABLE "pages_blocks_repeater_content_rows_tags" CASCADE;
  DROP TABLE "pages_blocks_repeater_content_rows_buttons" CASCADE;
  DROP TABLE "pages_blocks_repeater_content_rows" CASCADE;
  DROP TABLE "pages_blocks_repeater_content" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_logo_grid_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_grid" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_jobs_list" CASCADE;
  DROP TABLE "pages_blocks_posts_loop" CASCADE;
  DROP TABLE "pages_blocks_latest_news" CASCADE;
  DROP TABLE "pages_blocks_form_section" CASCADE;
  DROP TABLE "pages_blocks_numbered_sections_sections" CASCADE;
  DROP TABLE "pages_blocks_numbered_sections" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "jobs_duties" CASCADE;
  DROP TABLE "jobs_requirements" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "cvs" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_upload_mime_types" CASCADE;
  DROP TABLE "forms_blocks_upload" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_rels" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions_submission_uploads" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "form_submissions_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_menu" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "company_details_address" CASCADE;
  DROP TABLE "company_details_phone_numbers" CASCADE;
  DROP TABLE "company_details_email_addresses" CASCADE;
  DROP TABLE "company_details_social_links" CASCADE;
  DROP TABLE "company_details" CASCADE;
  DROP TABLE "job_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_banner_buttons_button_style";
  DROP TYPE "public"."enum_pages_blocks_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_banner_scroll_link_style";
  DROP TYPE "public"."enum_pages_blocks_banner_type";
  DROP TYPE "public"."enum_pages_blocks_banner_image_position";
  DROP TYPE "public"."enum_pages_blocks_banner_video_type";
  DROP TYPE "public"."enum_pages_blocks_ticker_theme";
  DROP TYPE "public"."enum_pages_blocks_intro_content_buttons_button_style";
  DROP TYPE "public"."enum_pages_blocks_intro_content_heading_links_button_style";
  DROP TYPE "public"."enum_pages_blocks_intro_content_layout";
  DROP TYPE "public"."enum_pages_blocks_intro_content_theme";
  DROP TYPE "public"."enum_pages_blocks_product_cards_manual_cards_link_style";
  DROP TYPE "public"."enum_pages_blocks_product_cards_manual_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_product_cards_manual_theme";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_grid_link_style";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_style";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_rows_buttons_button_style";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_rows_media_type";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_rows_image_fit";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_rows_video_type";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_first_image_side";
  DROP TYPE "public"."enum_pages_blocks_repeater_content_theme";
  DROP TYPE "public"."enum_pages_blocks_timeline_theme";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_gallery_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_gallery_theme";
  DROP TYPE "public"."enum_pages_blocks_testimonials_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_theme";
  DROP TYPE "public"."enum_pages_blocks_jobs_list_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_jobs_list_cta_button_style";
  DROP TYPE "public"."enum_pages_blocks_jobs_list_theme";
  DROP TYPE "public"."enum_pages_blocks_latest_news_intro_button_style";
  DROP TYPE "public"."enum_pages_blocks_latest_news_theme";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum_forms_blocks_upload_upload_collection";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_forms_redirect_type";
  DROP TYPE "public"."enum_header_nav_items_link_style";
  DROP TYPE "public"."enum_header_cta_style";
  DROP TYPE "public"."enum_footer_menu_link_style";
  DROP TYPE "public"."enum_footer_legal_links_link_style";
  DROP TYPE "public"."enum_job_settings_why_link_style";`)
}
