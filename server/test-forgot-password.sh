#!/bin/bash

# Скрипт для тестування відновлення паролю
# Використання: ./test-forgot-password.sh <phone_number>
# Приклад: ./test-forgot-password.sh +380501234567

BASE_URL="http://localhost:3000"
PHONE="${1:-+380501234567}"

echo "🧪 Тестування відновлення паролю для номера: $PHONE"
echo ""

# Крок 1: Запит на відновлення паролю
echo "📱 Крок 1: Запит SMS коду для відновлення паролю..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\"}")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Витягуємо код з відповіді (якщо є)
CODE=$(echo "$RESPONSE" | jq -r '.code // empty' 2>/dev/null)

if [ -z "$CODE" ]; then
  echo "⚠️  Код не знайдено в відповіді. Перевір консоль сервера."
  echo "Введи код вручну: "
  read -r CODE
fi

if [ -z "$CODE" ]; then
  echo "❌ Код не введено. Вихід."
  exit 1
fi

echo "✅ Отримано код: $CODE"
echo ""

# Крок 2: Верифікація коду
echo "🔐 Крок 2: Верифікація коду..."
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/verify-code" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\", \"code\": \"$CODE\"}")

echo "$VERIFY_RESPONSE" | jq '.' 2>/dev/null || echo "$VERIFY_RESPONSE"
echo ""

# Перевірка успіху
SUCCESS=$(echo "$VERIFY_RESPONSE" | jq -r '.success // false' 2>/dev/null)

if [ "$SUCCESS" != "true" ]; then
  echo "❌ Помилка верифікації коду"
  exit 1
fi

echo "✅ Код верифіковано успішно!"
echo ""

# Крок 3: Створення нового паролю
echo "🔑 Крок 3: Створення нового паролю..."
echo "Введи новий пароль (мінімум 8 символів, великі/малі літери, цифри): "
read -r NEW_PASSWORD

if [ -z "$NEW_PASSWORD" ]; then
  echo "❌ Пароль не введено. Вихід."
  exit 1
fi

CREATE_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/create-password" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\", \"password\": \"$NEW_PASSWORD\"}")

echo "$CREATE_PASSWORD_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_PASSWORD_RESPONSE"
echo ""

# Перевірка успіху
CREATE_SUCCESS=$(echo "$CREATE_PASSWORD_RESPONSE" | jq -r '.success // false' 2>/dev/null)

if [ "$CREATE_SUCCESS" = "true" ]; then
  echo "✅ Пароль успішно оновлено!"
  echo ""
  echo "🎉 Тестування завершено успішно!"
  echo "Тепер можна увійти з новим паролем."
else
  echo "❌ Помилка створення паролю"
  exit 1
fi

