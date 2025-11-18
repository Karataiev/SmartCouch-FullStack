// Middleware більше не потрібен для ініціалізації таймера
// Таймер ініціалізується в store.js після створення store
export const timeMiddleware = store => {
  return next => action => {
    // Просто пропускаємо всі action'и
    return next(action);
  };
};

