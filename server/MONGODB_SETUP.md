# Налаштування MongoDB Atlas

## Формат connection string:

```
mongodb+srv://karataievpro_db_user:ТВІЙ_ПАРОЛЬ@cluster0.qyajcxv.mongodb.net/smartcoach?retryWrites=true&w=majority&appName=Cluster0
```

## Кроки:

1. **Заміни `<db_password>` на свій реальний пароль** від MongoDB Atlas

2. **Додай назву бази даних** (`smartcoach`) після `.net/`

3. **Відредагуй `.env` файл:**

```env
MONGODB_URI=mongodb+srv://karataievpro_db_user:ТВІЙ_ПАРОЛЬ@cluster0.qyajcxv.mongodb.net/smartcoach?retryWrites=true&w=majority&appName=Cluster0
```

## Приклад повного .env:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://karataievpro_db_user:ТВІЙ_ПАРОЛЬ@cluster0.qyajcxv.mongodb.net/smartcoach?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-for-testing
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## Важливо:

- ✅ Заміни `ТВІЙ_ПАРОЛЬ` на реальний пароль
- ✅ Назва бази даних (`smartcoach`) буде створена автоматично при першому підключенні
- ✅ Якщо пароль містить спеціальні символи (@, #, $, тощо), закодуй їх через URL encoding:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

## Перевірка підключення:

Після налаштування запусти:

```bash
npm run dev
```

Якщо все ОК, побачиш в консолі:
```
✅ Підключено до MongoDB
🚀 Сервер запущено на порту 3000
```

