#!/bin/bash

# Скрипт для тестування auth endpoints
# Використання: ./test-auth.sh

BASE_URL="http://localhost:3000"
PHONE="+380501234567"
PASSWORD="MySecure123"

echo "🧪 Тестування Auth Endpoints"
echo "================================"
echo ""

# 1. Health Check
echo "1️⃣ Health Check"
curl -s -X GET "$BASE_URL/health" | jq .
echo ""
echo ""

# 2. Register
echo "2️⃣ Register (відправка SMS коду)"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\"}")

echo "$REGISTER_RESPONSE" | jq .

# Витягуємо код з відповіді (тільки в development)
CODE=$(echo "$REGISTER_RESPONSE" | jq -r '.code // empty')
if [ -z "$CODE" ]; then
  echo ""
  echo "⚠️  Код не повернуто в відповіді. Перевірте консоль сервера або введіть код вручну:"
  read -p "Введіть SMS код: " CODE
fi

echo ""
echo ""

# 3. Verify Code
echo "3️⃣ Verify Code"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/verify-code" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\", \"code\": \"$CODE\"}")

echo "$VERIFY_RESPONSE" | jq .
echo ""
echo ""

# 4. Create Password
echo "4️⃣ Create Password"
CREATE_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/create-password" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"password\": \"$PASSWORD\",
    \"name\": \"Іван\",
    \"surname\": \"Петренко\"
  }")

echo "$CREATE_PASSWORD_RESPONSE" | jq .

# Витягуємо токени
ACCESS_TOKEN=$(echo "$CREATE_PASSWORD_RESPONSE" | jq -r '.tokens.access // empty')
REFRESH_TOKEN=$(echo "$CREATE_PASSWORD_RESPONSE" | jq -r '.tokens.refresh // empty')

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Помилка: не вдалося отримати токени"
  exit 1
fi

echo ""
echo "✅ Токени отримано!"
echo ""
echo ""

# 5. Login
echo "5️⃣ Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"password\": \"$PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq .

# Оновлюємо токени з login
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.access // empty')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.refresh // empty')

echo ""
echo ""

# 6. Refresh Token
echo "6️⃣ Refresh Token"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq .

# Оновлюємо токени
ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.tokens.access // empty')
REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.tokens.refresh // empty')

echo ""
echo ""

# 7. Logout
echo "7️⃣ Logout"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/logout" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

echo "$LOGOUT_RESPONSE" | jq .
echo ""
echo ""

echo "✅ Тестування завершено!"
echo ""
echo "Токени для ручного тестування:"
echo "Access Token: $ACCESS_TOKEN"
echo "Refresh Token: $REFRESH_TOKEN"


