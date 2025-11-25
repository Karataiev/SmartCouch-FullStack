#!/bin/bash

# Скрипт для тестування user profile endpoints
# Використання: ./test-user-profile.sh
# Або: ./test-user-profile.sh <ACCESS_TOKEN>

BASE_URL="http://localhost:3000"
PHONE="+380501234567"
PASSWORD="MySecure123"

echo "🧪 Тестування User Profile Endpoints"
echo "======================================"
echo ""

# Перевірка чи передано токен як аргумент
if [ -n "$1" ]; then
  ACCESS_TOKEN="$1"
  echo "✅ Використовується наданий токен"
else
  echo "🔐 Отримання токену через логін..."
  
  # Логін для отримання токену
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"phone\": \"$PHONE\",
      \"password\": \"$PASSWORD\"
    }")
  
  ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.access // empty')
  
  # Якщо логін не вдався - спробуємо зареєструватися
  if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo "⚠️  Логін не вдався. Спробуємо зареєструватися..."
    echo ""
    
    # 1. Register
    echo "📝 Крок 1: Реєстрація (відправка SMS коду)"
    REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
      -H "Content-Type: application/json" \
      -d "{\"phone\": \"$PHONE\"}")
    
    CODE=$(echo "$REGISTER_RESPONSE" | jq -r '.code // empty')
    if [ -z "$CODE" ]; then
      echo "⚠️  Код не повернуто в відповіді. Перевірте консоль сервера."
      echo "📄 Відповідь: $REGISTER_RESPONSE"
      echo ""
      echo "💡 Введіть код вручну або перевірте логи сервера"
      read -p "Введіть SMS код: " CODE
    fi
    
    if [ -z "$CODE" ]; then
      echo "❌ Помилка: не вдалося отримати код верифікації"
      exit 1
    fi
    
    echo ""
    
    # 2. Verify Code
    echo "📝 Крок 2: Верифікація коду"
    VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/verify-code" \
      -H "Content-Type: application/json" \
      -d "{\"phone\": \"$PHONE\", \"code\": \"$CODE\"}")
    
    echo "$VERIFY_RESPONSE" | jq .
    echo ""
    
    # 3. Create Password
    echo "📝 Крок 3: Створення паролю"
    CREATE_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/create-password" \
      -H "Content-Type: application/json" \
      -d "{
        \"phone\": \"$PHONE\",
        \"password\": \"$PASSWORD\",
        \"name\": \"Тестовий\",
        \"surname\": \"Користувач\"
      }")
    
    ACCESS_TOKEN=$(echo "$CREATE_PASSWORD_RESPONSE" | jq -r '.tokens.access // empty')
    
    if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
      echo "❌ Помилка: не вдалося зареєструватися та отримати токен"
      echo "📄 Відповідь: $CREATE_PASSWORD_RESPONSE"
      exit 1
    fi
    
    echo "✅ Реєстрація успішна! Токен отримано!"
  else
    echo "✅ Токен отримано через логін!"
  fi
fi

echo ""
echo ""

# 1. GET Profile
echo "1️⃣ GET /api/user/profile - Отримати профіль"
echo "--------------------------------------------"
GET_PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

echo "$GET_PROFILE_RESPONSE" | jq .
echo ""
echo ""

# Перевірка успішності
if echo "$GET_PROFILE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Профіль отримано успішно!"
else
  echo "❌ Помилка отримання профілю"
  exit 1
fi

echo ""
echo ""

# 2. PUT Profile - Оновлення профілю
echo "2️⃣ PUT /api/user/profile - Оновити профіль"
echo "--------------------------------------------"
UPDATE_PROFILE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Іван\",
    \"surname\": \"Петренко\",
    \"email\": \"ivan.petrenko@example.com\",
    \"birthday\": \"1990-05-15T00:00:00.000Z\",
    \"experience\": \"5 років досвіду в фітнесі\",
    \"city\": \"Київ\",
    \"avatar\": \"https://example.com/avatar.jpg\"
  }")

echo "$UPDATE_PROFILE_RESPONSE" | jq .

if echo "$UPDATE_PROFILE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Профіль оновлено успішно!"
else
  echo "❌ Помилка оновлення профілю"
fi

echo ""
echo ""

# 3. Перевірка оновленого профілю
echo "3️⃣ GET /api/user/profile - Перевірка оновленого профілю"
echo "--------------------------------------------------------"
GET_UPDATED_RESPONSE=$(curl -s -X GET "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

echo "$GET_UPDATED_RESPONSE" | jq .
echo ""
echo ""

# 4. Тест часткового оновлення (тільки name)
echo "4️⃣ PUT /api/user/profile - Часткове оновлення (тільки name)"
echo "-----------------------------------------------------------"
PARTIAL_UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Олександр\"
  }")

echo "$PARTIAL_UPDATE_RESPONSE" | jq .

if echo "$PARTIAL_UPDATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Часткове оновлення працює!"
else
  echo "❌ Помилка часткового оновлення"
fi

echo ""
echo ""

# 5. Тест очищення поля (порожній рядок)
echo "5️⃣ PUT /api/user/profile - Очищення поля (avatar = \"\")"
echo "--------------------------------------------------------"
CLEAR_FIELD_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"avatar\": \"\"
  }")

echo "$CLEAR_FIELD_RESPONSE" | jq .

if echo "$CLEAR_FIELD_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Очищення поля працює!"
else
  echo "❌ Помилка очищення поля"
fi

echo ""
echo ""

# 6. Тест валідації (невірний email)
echo "6️⃣ PUT /api/user/profile - Тест валідації (невірний email)"
echo "----------------------------------------------------------"
INVALID_EMAIL_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"invalid-email\"
  }")

echo "$INVALID_EMAIL_RESPONSE" | jq .

if echo "$INVALID_EMAIL_RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
  echo "✅ Валідація працює правильно (відхилено невірний email)!"
else
  echo "⚠️  Валідація може не працювати правильно"
fi

echo ""
echo ""

# 7. Тест без токену (має повернути 401)
echo "7️⃣ GET /api/user/profile - Тест без токену (має повернути 401)"
echo "--------------------------------------------------------------"
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/v1/user/profile" \
  -H "Content-Type: application/json")

echo "$NO_TOKEN_RESPONSE" | jq .

if echo "$NO_TOKEN_RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
  echo "✅ Захист працює правильно (401 без токену)!"
else
  echo "⚠️  Захист може не працювати правильно"
fi

echo ""
echo ""

# 8. DELETE Account (закоментовано для безпеки)
echo "8️⃣ DELETE /api/user/account - Видалити акаунт"
echo "---------------------------------------------"
echo "⚠️  Ця операція видалить акаунт! Пропускаємо для безпеки."
echo "💡 Для тестування видалення виконайте вручну:"
echo ""
echo "curl -X DELETE \"$BASE_URL/api/v1/user/account\" \\"
echo "  -H \"Authorization: Bearer $ACCESS_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

echo "✅ Тестування завершено!"
echo ""
echo "📝 Токен для ручного тестування:"
echo "$ACCESS_TOKEN"
echo ""

