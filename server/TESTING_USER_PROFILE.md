# Тестування User Profile API

## Швидкий старт

### 1. Автоматичне тестування

Запустіть тестовий скрипт:

```bash
cd server
./test-user-profile.sh
```

Скрипт автоматично:

- Залогінується (або використає наданий токен)
- Протестує всі endpoints
- Покаже результати

Або з наданим токеном:

```bash
./test-user-profile.sh "your_access_token_here"
```

### 2. Ручне тестування

#### Крок 1: Отримати токен

Спочатку потрібно залогінитися або зареєструватися:

```bash
# Логін
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "MySecure123"
  }'
```

Збережіть `access` токен з відповіді.

#### Крок 2: Тестування endpoints

**GET /api/user/profile** - Отримати профіль

```bash
curl -X GET "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**PUT /api/user/profile** - Оновити профіль

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Іван",
    "surname": "Петренко",
    "email": "ivan@example.com",
    "birthday": "1990-05-15T00:00:00.000Z",
    "experience": "5 років досвіду",
    "city": "Київ",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

**Часткове оновлення** (тільки name):

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Олександр"
  }'
```

**Очищення поля** (порожній рядок):

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar": ""
  }'
```

**DELETE /api/user/account** - Видалити акаунт

⚠️ **УВАГА**: Ця операція незворотна!

```bash
curl -X DELETE "http://localhost:3000/api/v1/user/account" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## Тестування валідації

### Невірний email

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email"
  }'
```

Очікуваний результат: `400 Bad Request` з повідомленням про невірний формат email.

### Дата в майбутньому

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "birthday": "2030-01-01T00:00:00.000Z"
  }'
```

Очікуваний результат: `400 Bad Request` з повідомленням про невірну дату.

### Занадто довге ім'я

```bash
curl -X PUT "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "А" * 100
  }'
```

Очікуваний результат: `400 Bad Request` з повідомленням про перевищення ліміту.

## Тестування безпеки

### Запит без токену

```bash
curl -X GET "http://localhost:3000/api/v1/user/profile" \
  -H "Content-Type: application/json"
```

Очікуваний результат: `401 Unauthorized`

### Запит з невірним токеном

```bash
curl -X GET "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json"
```

Очікуваний результат: `401 Unauthorized`

## Приклади відповідей

### Успішне отримання профілю

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+380501234567",
    "name": "Іван",
    "surname": "Петренко",
    "email": "ivan@example.com",
    "birthday": "1990-05-15T00:00:00.000Z",
    "experience": "5 років досвіду",
    "city": "Київ",
    "avatar": "https://example.com/avatar.jpg",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Успішне оновлення профілю

```json
{
  "success": true,
  "message": "Профіль оновлено успішно",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+380501234567",
    "name": "Олександр",
    "surname": "Петренко",
    "email": "ivan@example.com",
    "birthday": "1990-05-15T00:00:00.000Z",
    "experience": "5 років досвіду",
    "city": "Київ",
    "avatar": null,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Помилка валідації

```json
{
  "success": false,
  "message": "Помилка валідації",
  "errors": [
    {
      "field": "email",
      "message": "Невірний формат email"
    }
  ]
}
```

### Помилка авторизації

```json
{
  "success": false,
  "message": "Токен доступу не надано. Додайте заголовок Authorization: Bearer <token>"
}
```

## Використання з jq для красивого виводу

Якщо встановлено `jq`, можна додати `| jq .` до curl команд:

```bash
curl -X GET "http://localhost:3000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq .
```

## Використання Postman

1. Створіть новий запит
2. Встановіть метод (GET, PUT, DELETE)
3. URL: `http://localhost:3000/api/v1/user/profile`
4. Вкладка "Headers":
   - `Authorization`: `Bearer YOUR_ACCESS_TOKEN`
   - `Content-Type`: `application/json`
5. Для PUT запитів - вкладка "Body" → "raw" → "JSON":

```json
{
  "name": "Іван",
  "surname": "Петренко",
  "email": "ivan@example.com"
}
```

## Перевірка логів сервера

Під час тестування перевіряйте логи сервера для діагностики:

```bash
# Якщо сервер запущено через npm run dev
# Логи будуть виводитися в консоль
```

Логи містять:

- Інформацію про запити
- Помилки валідації
- Операції оновлення профілю
- Видалення акаунтів
