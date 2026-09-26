CREATE TABLE `previewPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionKey` varchar(128) NOT NULL,
	`selectedTourSlug` varchar(64) NOT NULL DEFAULT 'food',
	`selectedLanguage` varchar(8) NOT NULL DEFAULT 'en',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `previewPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `previewPreferences_sessionKey_unique` UNIQUE(`sessionKey`)
);
--> statement-breakpoint
CREATE TABLE `tourPreviewTranslations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tourId` int NOT NULL,
	`language` varchar(8) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tourPreviewTranslations_id` PRIMARY KEY(`id`),
	CONSTRAINT `tour_preview_language_unique` UNIQUE(`tourId`,`language`)
);
--> statement-breakpoint
CREATE TABLE `tourPreviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`label` varchar(128) NOT NULL,
	`destination` varchar(160) NOT NULL,
	`duration` varchar(64) NOT NULL,
	`groupFormat` varchar(128) NOT NULL,
	`languages` varchar(128) NOT NULL,
	`color` varchar(16) NOT NULL,
	`stops` text NOT NULL,
	`inclusions` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tourPreviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `tourPreviews_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
