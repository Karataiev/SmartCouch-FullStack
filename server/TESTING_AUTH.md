# Тестування Auth Endpoints

## 📋 Передумови

1. **MongoDB** має бути запущений та доступний
2. **.env файл** має бути створений з необхідними змінними
3. **Node.js** версія >= 18.0.0

---

## 🔧 Налаштування

### 1. Створіть .env файл

Створіть файл `.env` в папці `server/` з наступним вмістом:

```env
# Server
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smartcoach

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-for-security
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# SMS (опціонально для development)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

**Важливо:**
- `JWT_SECRET` має бути мінімум 32 символи
- `MONGODB_URI` - змініть на ваш connection string
- Twilio налаштування не обов'язкові для development (буде використовуватись mock режим)

---

## 🚀 Запуск сервера

### Development режим (з auto-reload):
```bash
cd server
npm run dev
```

### Production режим:
```bash
cd server
npm run build
npm start
```

Сервер запуститься на `http://localhost:3000`

---

## 🧪 Тестування через cURL

### 1. Health Check
```bash
curl http://localhost:3000/health
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 2. Реєстрація (відправка SMS коду)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567"
  }'
```

**Очікувана відповідь (development):**
```json
{
  "success": true,
  "message": "Код верифікації відправлено",
  "code": "123456"
}
```

**Примітка:** В development режимі код буде виведений в консоль сервера та повернутий в відповіді.

---

### 3. Верифікація SMS коду

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "code": "123456"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Код верифікації підтверджено",
  "verified": true
}
```

---

### 4. Створення паролю

```bash
curl -X POST http://localhost:3000/api/v1/auth/create-password \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "MySecure123",
    "name": "Іван",
    "surname": "Петренко",
    "email": "ivan@example.com"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Пароль створено успішно",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+380501234567",
    "name": "Іван",
    "surname": "Петренко",
    "email": "ivan@example.com",
    "isVerified": true
  }
}
```

**Збережіть `access` та `refresh` токени для наступних запитів!**

---

### 5. Логін

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "MySecure123"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Вхід виконано успішно",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+380501234567",
    "name": "Іван",
    "surname": "Петренко",
    "email": "ivan@example.com",
    "isVerified": true
  }
}
```

---

### 6. Оновлення токену (Refresh Token)

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Токени оновлено успішно",
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 7. Вихід (Logout)

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Вихід виконано успішно"
}
```

---

## 🧪 Тестування через Postman

### Налаштування Postman

1. Створіть новий Collection: "SmartCoach Auth"
2. Додайте змінну `baseUrl` = `http://localhost:3000`
3. Додайте змінну `accessToken` (буде встановлюватись автоматично)

### Створіть запити:

#### 1. Register
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/register`
- **Body (raw JSON):**
```json
{
  "phone": "+380501234567"
}
```

#### 2. Verify Code
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/verify-code`
- **Body (raw JSON):**
```json
{
  "phone": "+380501234567",
  "code": "123456"
}
```

#### 3. Create Password
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/create-password`
- **Body (raw JSON):**
```json
{
  "phone": "+380501234567",
  "password": "MySecure123",
  "name": "Іван",
  "surname": "Петренко"
}
```
- **Tests (для збереження токенів):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.tokens.access);
    pm.environment.set("refreshToken", jsonData.tokens.refresh);
}
```

#### 4. Login
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/login`
- **Body (raw JSON):**
```json
{
  "phone": "+380501234567",
  "password": "MySecure123"
}
```

#### 5. Refresh Token
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/refresh-token`
- **Body (raw JSON):**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

#### 6. Logout
- **Method:** POST
- **URL:** `{{baseUrl}}/api/v1/auth/logout`
- **Body (raw JSON):**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

---

## 🧪 Тестування помилок

### 1. Невірний формат номера телефону
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "123"
  }'
```

**Очікувана відповідь (400):**
```json
{
  "success": false,
  "message": "Помилка валідації даних",
  "errors": [
    {
      "field": "phone",
      "message": "Невірний формат номера телефону"
    }
  ]
}
```

### 2. Невірний код верифікації
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "code": "000000"
  }'
```

**Очікувана відповідь (400):**
```json
{
  "success": false,
  "message": "Невірний код верифікації"
}
```

### 3. Невірний пароль при логіні
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "WrongPassword123"
  }'
```

**Очікувана відповідь (401):**
```json
{
  "success": false,
  "message": "Невірний номер телефону або пароль"
}
```

### 4. Запит без токену (для захищених endpoints)
```bash
curl -X GET http://localhost:3000/api/v1/user/profile
```

**Очікувана відповідь (401):**
```json
{
  "success": false,
  "message": "Токен доступу не надано. Додайте заголовок Authorization: Bearer <token>"
}
```

---

## 📝 Повний Flow тестування

### Сценарій 1: Повна реєстрація нового користувача

1. **Register** → отримайте SMS код
2. **Verify Code** → підтвердіть код
3. **Create Password** → створіть пароль та отримайте токени
4. **Login** → увійдіть з паролем
5. **Refresh Token** → оновіть токени
6. **Logout** → вийдіть з системи

### Сценарій 2: Логін існуючого користувача

1. **Login** → увійдіть з телефоном та паролем
2. **Refresh Token** → оновіть токени
3. **Logout** → вийдіть

---

## 🔍 Перевірка в MongoDB

Після тестування можна перевірити дані в MongoDB:

```bash
# Підключення до MongoDB
mongosh mongodb://localhost:27017/smartcoach

# Перегляд користувачів
db.users.find().pretty()

# Перегляд кодів верифікації
db.verificationcodes.find().pretty()

# Перегляд refresh токенів
db.refreshtokens.find().pretty()
```

---

## ⚠️ Типові помилки

### 1. "MongoDB відключено"
**Рішення:** Переконайтесь, що MongoDB запущений:
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 2. "JWT_SECRET має бути мінімум 32 символи"
**Рішення:** Змініть `JWT_SECRET` в `.env` на рядок довжиною >= 32 символи

### 3. "Помилка валідації env змінних"
**Рішення:** Перевірте, що всі обов'язкові змінні в `.env` встановлені

### 4. Rate limiting помилки
**Рішення:** Зачекайте 15 хвилин або змініть IP адресу

---

## 🎯 Чек-лист тестування

- [ ] Health check працює
- [ ] Реєстрація відправляє SMS код (в development - виводить в консоль)
- [ ] Верифікація коду працює
- [ ] Створення паролю генерує токени
- [ ] Логін працює з правильним паролем
- [ ] Логін не працює з невірним паролем
- [ ] Refresh token оновлює токени
- [ ] Logout видаляє refresh token
- [ ] Валідація працює (невірні дані повертають помилки)
- [ ] Rate limiting працює (після багатьох запитів)

---

## 📚 Додаткові ресурси

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [API Documentation](./README.md)



