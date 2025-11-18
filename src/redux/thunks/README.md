# Підключення бекенду

## Статус готовності

✅ **Додаток готовий до підключення бекенду**

Всі необхідні компоненти налаштовані:
- ✅ Thunk'и створені для всіх CRUD операцій
- ✅ ExtraReducers налаштовані для обробки станів
- ✅ Loading та error стани додані в Redux store
- ✅ Валідація payload додана
- ✅ Централізований експорт thunk'ів

## Як підключити бекенд

### 1. Оновіть thunk'и з реальними API запитами

#### Для клієнтів (`src/redux/thunks/clientsThunk.js`):

```javascript
// Замініть заглушку на реальний запит:
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, {rejectWithValue}) => {
    try {
      const response = await fetch('https://your-api.com/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`, // якщо потрібна авторизація
        },
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Помилка завантаження клієнтів');
    }
  },
);
```

#### Для планів тренувань (`src/redux/thunks/workoutPlansThunk.js`):

Аналогічно оновіть всі thunk'и, замінивши TODO-коментарі на реальні API запити.

### 2. Використання в компонентах

#### Приклад завантаження клієнтів:

```javascript
import {useDispatch, useSelector} from 'react-redux';
import {fetchClients, saveClient} from '../redux/thunks';

const MyComponent = () => {
  const dispatch = useDispatch();
  const {clients, loading, error} = useSelector(state => ({
    clients: state.app.clients,
    loading: state.app.loading.clients,
    error: state.app.error.clients,
  }));

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleSave = async (clientData) => {
    try {
      await dispatch(saveClient(clientData)).unwrap();
      // Успішно збережено
    } catch (error) {
      // Обробка помилки
      console.error(error);
    }
  };

  if (loading) return <Text>Завантаження...</Text>;
  if (error) return <Text>Помилка: {error}</Text>;

  return <View>...</View>;
};
```

### 3. Доступні thunk'и

#### Клієнти:
- `fetchClients()` - завантажити всіх клієнтів
- `saveClient(clientData)` - зберегти нового клієнта
- `updateClient({clientId, clientData})` - оновити клієнта
- `deleteClient(clientId)` - видалити клієнта

#### Плани тренувань:
- `fetchWorkoutPlans()` - завантажити всі плани
- `fetchWorkoutPlansByDate(date)` - завантажити плани за датою
- `saveWorkoutPlan(planData)` - зберегти план
- `updateWorkoutPlan({planId, planData})` - оновити план
- `deleteWorkoutPlan(planId)` - видалити план

### 4. Стани в Redux

Після виклику thunk'ів, стани автоматично оновлюються:

```javascript
// Loading стани
state.app.loading.clients // boolean
state.app.loading.workoutPlans // boolean

// Error стани
state.app.error.clients // string | null
state.app.error.workoutPlans // string | null

// Дані
state.app.clients // EntityAdapter state
state.app.trainings // EntityAdapter state
```

### 5. Міграція існуючих компонентів

Замініть синхронні action'и на async thunk'и:

**Було:**
```javascript
dispatch(createNewClients(clientData));
```

**Стало:**
```javascript
dispatch(saveClient(clientData));
// або з обробкою помилок:
try {
  await dispatch(saveClient(clientData)).unwrap();
} catch (error) {
  // обробка помилки
}
```

## Примітки

- Всі thunk'и мають валідацію payload
- Помилки автоматично зберігаються в `state.app.error`
- Loading стани автоматично оновлюються
- ExtraReducers вже налаштовані для всіх thunk'ів

