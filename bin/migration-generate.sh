read -p "Input name for your migration: " migrationName
npx typeorm-ts-node-commonjs migration:generate ./src/database/migrations/"$migrationName" -d ./src/database/data-source-local.ts
