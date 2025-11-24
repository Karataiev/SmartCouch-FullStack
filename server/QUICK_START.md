# 🚀 Швидкий старт для тестування Auth

## Крок 1: Створіть .env файл

Створіть файл `.env` в папці `server/` з таким вмістом:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smartcoach
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-for-security
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000,http://10.0.2.2:3000,http://127.0.0.1:3000
LOG_LEVEL=info
```

**Важливо:** Змініть `JWT_SECRET` на випадковий рядок мінімум 32 символи!

---

## Крок 2: Запустіть MongoDB

Переконайтесь, що MongoDB запущений:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Або перевірте статус
brew services list | grep mongodb
```

---

## Крок 3: Запустіть сервер

```bash
cd server
npm run dev
```

Сервер запуститься на `http://localhost:3000`

---

## Крок 4: Протестуйте endpoints

### Варіант 1: Використайте готовий скрипт

```bash
cd server
./test-auth.sh
```

**Примітка:** Потрібен `jq` для форматування JSON. Встановіть через:

```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq
```

### Варіант 2: Використайте cURL вручну

#### 1. Реєстрація

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone": "+380501234567"}'
```

**Результат:** Код верифікації буде виведений в консоль сервера та повернутий в відповіді (development режим).

#### 2. Верифікація коду

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+380501234567", "code": "123456"}'
```

#### 3. Створення паролю

```bash
curl -X POST http://localhost:3000/api/v1/auth/create-password \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "MySecure123",
    "name": "Іван",
    "surname": "Петренко"
  }'
```

**Збережіть `access` та `refresh` токени з відповіді!**

#### 4. Логін

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380501234567",
    "password": "MySecure123"
  }'
```

#### 5. Оновлення токену

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN_HERE"}'
```

#### 6. Вихід

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN_HERE"}'
```

---

## Крок 5: Перевірте в MongoDB

```bash
mongosh mongodb://localhost:27017/smartcoach
```

```javascript
// Перегляд користувачів
db.users.find().pretty();

// Перегляд кодів верифікації
db.verificationcodes.find().pretty();

// Перегляд refresh токенів
db.refreshtokens.find().pretty();
```

---

## ✅ Чек-лист

- [ ] MongoDB запущений
- [ ] .env файл створений з правильними значеннями
- [ ] Сервер запущений без помилок
- [ ] Health check працює: `curl http://localhost:3000/health`
- [ ] Реєстрація працює (код виводиться в консоль)
- [ ] Верифікація працює
- [ ] Створення паролю працює (токени генеруються)
- [ ] Логін працює

---

## 📚 Детальна документація

Для детальнішої інформації дивіться:

- [TESTING_AUTH.md](./TESTING_AUTH.md) - повна інструкція з тестування
- [README.md](./README.md) - загальна документація

---

## ⚠️ Типові проблеми

### "MongoDB відключено"

**Рішення:** Запустіть MongoDB:

```bash
brew services start mongodb-community
```

### "JWT_SECRET має бути мінімум 32 символи"

**Рішення:** Змініть `JWT_SECRET` в `.env` на рядок >= 32 символи

### "Помилка валідації env змінних"

**Рішення:** Перевірте, що всі змінні в `.env` встановлені правильно

### Rate limiting помилки

**Рішення:** Зачекайте 15 хвилин або змініть номер телефону для тестування

