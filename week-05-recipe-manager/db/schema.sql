-- Week 5: Recipe Manager Schema
-- This is what EF Core Migrations generates under the hood

CREATE TABLE IF NOT EXISTS "Tags" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Recipes" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Difficulty" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "RecipeTags" (
    "RecipeId" INTEGER NOT NULL,
    "TagId" INTEGER NOT NULL,
    PRIMARY KEY ("RecipeId", "TagId"),
    FOREIGN KEY ("RecipeId") REFERENCES "Recipes" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("TagId") REFERENCES "Tags" ("Id") ON DELETE CASCADE
);
