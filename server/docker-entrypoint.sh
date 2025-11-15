#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until nc -z postgres 5432; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

echo "Running database migrations..."
npx sequelize-cli db:migrate

echo "Starting application..."
exec node server.js

