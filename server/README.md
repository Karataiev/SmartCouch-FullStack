# SmartCoach Backend API

Backend API для додатку SmartCoach.

## Технологічний стек

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Helmet, express-rate-limit, bcrypt

## Структура проекту

```
server/
├── src/
│   ├── config/          # Конфігурація
│   ├── controllers/     # Контролери
│   ├── models/          # Mongoose моделі
│   ├── routes/          # API маршрути
│   ├── middleware/      # Middleware
│   ├── services/        # Бізнес-логіка
│   ├── utils/           # Утиліти
│   ├── types/           # TypeScript типи
│   └── app.ts           # Точка входу
├── tests/               # Тести
└── dist/                # Скомпільований код
```

## Встановлення

```bash
npm install
```

## Налаштування

1. Скопіювати `.env.example` в `.env`
2. Заповнити необхідні змінні оточення

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Тестування

```bash
npm test
```

