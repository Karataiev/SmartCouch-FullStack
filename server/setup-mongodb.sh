#!/bin/bash

echo "🔧 Налаштування MongoDB Connection String"
echo "=========================================="
echo ""

# Базовий URL
BASE_URL="mongodb+srv://karataievpro_db_user"
CLUSTER="cluster0.qyajcxv.mongodb.net"
DATABASE="smartcoach"

echo "Введи свій пароль від MongoDB Atlas:"
read -s PASSWORD

# URL encode спеціальні символи в паролі
ENCODED_PASSWORD=$(echo -n "$PASSWORD" | jq -sRr @uri 2>/dev/null || echo "$PASSWORD")

# Формуємо connection string
CONNECTION_STRING="${BASE_URL}:${ENCODED_PASSWORD}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority&appName=Cluster0"

echo ""
echo "✅ Connection string готовий:"
echo ""
echo "MONGODB_URI=${CONNECTION_STRING}"
echo ""
echo "📝 Додай цей рядок в .env файл"
