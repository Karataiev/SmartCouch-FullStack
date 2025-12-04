/**
 * Скрипт для генерації тестових даних для тестування великих обсягів
 * 
 * Використання:
 *   npm run generate-test-data [trainerId] [clientsCount] [workoutsCount]
 * 
 * Приклади:
 *   npm run generate-test-data                    # Використає першого користувача, 100 клієнтів, 500 тренувань
 *   npm run generate-test-data <trainerId>        # Для конкретного тренера
 *   npm run generate-test-data <trainerId> 150    # 150 клієнтів
 *   npm run generate-test-data <trainerId> 150 1000  # 150 клієнтів, 1000 тренувань
 *   npm run generate-test-data <trainerId> 0 1000  # Тільки тренування (0 клієнтів, використає існуючих)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '@/config/database';
import { User, Client, WorkoutPlan } from '@/models';
import { normalizePhone } from '@/utils/phone.util';

// Завантажуємо .env (з кореня server, де запускається скрипт)
dotenv.config();

// Утиліта для генерації випадкового номера телефону
function generatePhone(): string {
  const prefix = '+380';
  const codes = ['50', '63', '66', '67', '68', '73', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
  const code = codes[Math.floor(Math.random() * codes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000).toString();
  return `${prefix}${code}${number}`;
}

// Утиліта для генерації випадкового імені
function generateName(): string {
  const names = [
    'Олександр', 'Олексій', 'Андрій', 'Дмитро', 'Максим', 'Володимир', 'Іван', 'Сергій',
    'Михайло', 'Роман', 'Віктор', 'Олег', 'Юрій', 'Павло', 'Тарас', 'Богдан',
    'Василь', 'Ігор', 'Остап', 'Назар', 'Марія', 'Олена', 'Оксана', 'Тетяна',
    'Наталія', 'Юлія', 'Анна', 'Ірина', 'Вікторія', 'Катерина', 'Світлана', 'Людмила'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

// Утиліта для генерації випадкового прізвища
function generateSurname(): string {
  const surnames = [
    'Іваненко', 'Петренко', 'Коваленко', 'Бондаренко', 'Ткаченко', 'Морозенко',
    'Шевченко', 'Кравченко', 'Мельник', 'Коваль', 'Бондар', 'Ткач', 'Мороз',
    'Шевчук', 'Кравчук', 'Марченко', 'Лисенко', 'Романенко', 'Савченко', 'Василенко',
    'Гриценко', 'Олійник', 'Білоус', 'Гончар', 'Тарасенко', 'Полтавський', 'Київський'
  ];
  return surnames[Math.floor(Math.random() * surnames.length)];
}

// Утиліта для генерації довгого тексту
function generateLongText(minLength: number, maxLength: number): string {
  const words = [
    'тренування', 'фізична', 'підготовка', 'здоров\'я', 'спорт', 'фітнес', 'сила',
    'витривалість', 'гнучкість', 'координація', 'техніка', 'методика', 'програма',
    'результат', 'прогрес', 'мотивація', 'ціль', 'досягнення', 'успіх', 'праця',
    'вправи', 'навантаження', 'відпочинок', 'відновлення', 'харчування', 'режим',
    'дієта', 'білок', 'вуглеводи', 'жири', 'вітаміни', 'мінерали', 'вода', 'білкові',
    'кардіо', 'силові', 'функціональні', 'аеробні', 'анаеробні', 'інтервальні',
    'кругова', 'тренування', 'розминка', 'заминка', 'стретчинг', 'йога', 'пілатес'
  ];
  
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let text = '';
  
  while (text.length < length) {
    const word = words[Math.floor(Math.random() * words.length)];
    if (text.length > 0) text += ' ';
    text += word;
    if (text.length >= length) break;
  }
  
  // Обрізаємо до потрібної довжини
  return text.substring(0, maxLength).trim();
}

// Утиліта для генерації випадкової дати в межах наступних 90 днів
function generateRandomDate(): Date {
  const today = new Date();
  const daysOffset = Math.floor(Math.random() * 90); // 0-90 днів вперед
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  
  // Випадковий час від 8:00 до 20:00
  const hours = Math.floor(Math.random() * 12) + 8;
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

// Утиліта для генерації connection methods
function generateConnectionMethods() {
  const types = ['Instagram', 'Telegram', 'Viber', 'WhatsApp'];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 методи
  const selected = new Set<string>();
  
  while (selected.size < count) {
    const type = types[Math.floor(Math.random() * types.length)];
    selected.add(type);
  }
  
  return Array.from(selected).map(type => ({
    type,
    link: type === 'Instagram' 
      ? `@${generateName().toLowerCase()}${Math.floor(Math.random() * 1000)}`
      : `+380${Math.floor(100000000 + Math.random() * 900000000)}`,
  }));
}

async function generateTestData() {
  try {
    // Підключення до БД
    console.log('🔌 Підключення до MongoDB...');
    await connectDatabase();
    console.log('✅ Підключено до MongoDB\n');

    // Отримуємо параметри з командного рядка
    const args = process.argv.slice(2);
    const trainerIdArg = args[0];
    const clientsCount = parseInt(args[1] || '100');
    const workoutsCount = parseInt(args[2] || '500');

    // Знаходимо тренера
    let trainerId: mongoose.Types.ObjectId;
    
    if (trainerIdArg) {
      if (!mongoose.Types.ObjectId.isValid(trainerIdArg)) {
        throw new Error('Невірний формат trainerId');
      }
      trainerId = new mongoose.Types.ObjectId(trainerIdArg);
      const trainer = await User.findById(trainerId);
      if (!trainer) {
        throw new Error(`Тренер з ID ${trainerIdArg} не знайдений`);
      }
      console.log(`👤 Використовуємо тренера: ${trainer.name || 'Без імені'} ${trainer.surname || ''} (${trainer.phone})`);
    } else {
      const trainer = await User.findOne();
      if (!trainer) {
        throw new Error('Не знайдено жодного користувача в БД. Спочатку створіть користувача через реєстрацію.');
      }
      trainerId = trainer._id;
      console.log(`👤 Використовуємо першого тренера: ${trainer.name || 'Без імені'} ${trainer.surname || ''} (${trainer.phone})`);
    }

    console.log(`\n📊 Параметри генерації:`);
    console.log(`   - Кількість клієнтів: ${clientsCount === 0 ? '0 (використаємо існуючих)' : clientsCount}`);
    console.log(`   - Кількість тренувань: ${workoutsCount}\n`);

    // Генерація клієнтів (якщо потрібно)
    const clients: mongoose.Types.ObjectId[] = [];
    
    if (clientsCount > 0) {
      console.log('👥 Генерація клієнтів...');
      const batchSize = 50;
      
      for (let i = 0; i < clientsCount; i += batchSize) {
      const batch = [];
      const currentBatchSize = Math.min(batchSize, clientsCount - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        const name = generateName();
        const surname = generateSurname();
        const phone = generatePhone();
        
        // Генеруємо дані з різною довжиною текстів для тестування
        const targetAndWishes = i % 3 === 0 
          ? generateLongText(400, 500) // Максимальна довжина
          : i % 3 === 1 
            ? generateLongText(200, 300) // Середня довжина
            : undefined; // Короткий або відсутній
        
        const stateOfHealth = i % 4 === 0
          ? generateLongText(400, 500) // Максимальна довжина
          : i % 4 === 1
            ? generateLongText(100, 200) // Середня довжина
            : undefined;
        
        const notes = i % 5 === 0
          ? generateLongText(800, 1000) // Максимальна довжина (1000 символів)
          : i % 5 === 1
            ? generateLongText(500, 700) // Велика довжина
            : undefined;
        
        batch.push({
          trainerId,
          name,
          surname,
          phone: normalizePhone(phone),
          connectionMethods: i % 2 === 0 ? generateConnectionMethods() : [],
          targetAndWishes,
          stateOfHealth,
          levelOfPhysical: i % 3 === 0 ? 'Початковий' : i % 3 === 1 ? 'Середній' : 'Просунутий',
          notes,
          parameters: [],
        });
      }
      
      const createdClients = await Client.insertMany(batch);
      clients.push(...createdClients.map(c => c._id));
      
        process.stdout.write(`\r   Створено: ${Math.min(i + currentBatchSize, clientsCount)}/${clientsCount} клієнтів`);
      }
      
      console.log(`\n✅ Створено ${clients.length} клієнтів\n`);
    } else {
      // Використовуємо існуючих клієнтів
      console.log('👥 Отримуємо існуючих клієнтів...');
      const existingClients = await Client.find({ trainerId }).select('_id').lean();
      
      if (existingClients.length === 0) {
        throw new Error('Не знайдено жодного клієнта для тренера. Спочатку створіть клієнтів або вкажіть clientsCount > 0.');
      }
      
      clients.push(...existingClients.map(c => c._id));
      console.log(`✅ Знайдено ${clients.length} існуючих клієнтів\n`);
    }

    // Генерація тренувань
    console.log('🏋️  Генерація тренувань...');
    const trainingNames = [
      'Силове тренування', 'Кардіо сесія', 'Функціональне тренування',
      'Йога', 'Пілатес', 'Стретчинг', 'Кругова тренування', 'Інтервальне тренування',
      'Тренування на витривалість', 'Швидкісне тренування', 'Тренування з вагою',
      'Тренування з власною вагою', 'Тренування на гнучкість', 'Баланс та координація'
    ];
    
    const trainingTypes = ['Силове', 'Кардіо', 'Функціональне', 'Гнучкість', 'Баланс'];
    const locations = ['Зал', 'Дома', 'На вулиці', 'Спортзал', 'Фітнес-центр', undefined];
    
    let createdWorkouts = 0;
    const batchSizeWorkouts = 100;
    
    for (let i = 0; i < workoutsCount; i += batchSizeWorkouts) {
      const batch = [];
      const currentBatchSize = Math.min(batchSizeWorkouts, workoutsCount - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        // Випадковий клієнт
        const clientId = clients[Math.floor(Math.random() * clients.length)];
        
        // Випадкова дата
        const trainingDate = generateRandomDate();
        
        // Створюємо occurrence
        const occurrenceId = `occ_${Date.now()}_${i}_${j}`;
        const slotId = `${trainingDate.getHours().toString().padStart(2, '0')}:${trainingDate.getMinutes().toString().padStart(2, '0')}`;
        
        const occurrence = {
          id: occurrenceId,
          slotId,
          trainingDate: {
            date: trainingDate.toISOString().split('T')[0],
            time: slotId,
          },
        };
        
        // Генеруємо назву тренування (іноді з довгим текстом)
        const baseName = trainingNames[Math.floor(Math.random() * trainingNames.length)];
        // Максимальна довжина назви - 200 символів, базове ім'я ~20-30 символів
        const maxAdditionalLength = 200 - baseName.length - 3; // -3 для " - "
        const trainingName = i % 10 === 0 && maxAdditionalLength > 50
          ? `${baseName} - ${generateLongText(50, maxAdditionalLength)}` // Довга назва
          : baseName;
        
        batch.push({
          trainerId,
          clientId,
          trainingName,
          trainingType: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          trainingDate: [{
            date: trainingDate.toISOString().split('T')[0],
            time: slotId,
          }],
          occurrences: [occurrence],
        });
      }
      
      await WorkoutPlan.insertMany(batch);
      createdWorkouts += currentBatchSize;
      process.stdout.write(`\r   Створено: ${createdWorkouts}/${workoutsCount} тренувань`);
    }
    
    console.log(`\n✅ Створено ${createdWorkouts} тренувань\n`);

    // Статистика
    console.log('📈 Статистика:');
    const totalClients = await Client.countDocuments({ trainerId });
    const totalWorkouts = await WorkoutPlan.countDocuments({ trainerId });
    const clientsWithLongTexts = await Client.countDocuments({
      trainerId,
      $or: [
        { notes: { $exists: true, $ne: null } },
        { targetAndWishes: { $exists: true, $ne: null } },
        { stateOfHealth: { $exists: true, $ne: null } },
      ],
    });
    
    console.log(`   - Всього клієнтів: ${totalClients}`);
    console.log(`   - Всього тренувань: ${totalWorkouts}`);
    console.log(`   - Клієнтів з довгими текстами: ${clientsWithLongTexts}`);
    
    // Перевірка пагінації
    const clientsPage1 = await Client.find({ trainerId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    console.log(`   - Клієнтів на першій сторінці (limit=20): ${clientsPage1.length}`);
    
    const workoutsPage1 = await WorkoutPlan.find({ trainerId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    console.log(`   - Тренувань на першій сторінці (limit=20): ${workoutsPage1.length}`);
    
    console.log('\n✅ Генерація тестових даних завершена успішно!');
    console.log('\n💡 Тепер можна тестувати додаток з великими обсягами даних:');
    console.log('   - Відкрийте додаток і перевірте список клієнтів');
    console.log('   - Перевірте календар тренувань');
    console.log('   - Перевірте відображення довгих текстів в профілях клієнтів');

  } catch (error) {
    console.error('\n❌ Помилка:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 З\'єднання з MongoDB закрито');
    process.exit(0);
  }
}

// Запуск
generateTestData();

