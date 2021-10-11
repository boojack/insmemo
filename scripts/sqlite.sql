CREATE TABLE `users` (
	`id` TEXT NOT NULL PRIMARY KEY,
	`username` TEXT NOT NULL,
	`password` TEXT NOT NULL,
	`github_name` TEXT NULL DEFAULT '',
	`created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `memos`  (
  `id` TEXT NOT NULL PRIMARY KEY,
  `content` TEXT NOT NULL,
  `user_id` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TEXT,
  FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `tags`  (
  `id` TEXT NOT NULL PRIMARY KEY,
  `user_id` TEXT NOT NULL,
  `text` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `level` INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `memo_tag`  (
  `id` TEXT NOT NULL PRIMARY KEY,
  `memo_id` TEXT NOT NULL,
  `tag_id` TEXT NOT NULL,
  FOREIGN KEY(`memo_id`) REFERENCES `memos`(`id`),
  FOREIGN KEY(`tag_id`) REFERENCES `tags`(`id`)
);