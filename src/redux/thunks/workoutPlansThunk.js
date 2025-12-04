import {createAsyncThunk} from '@reduxjs/toolkit';
import {workoutPlansService} from '../../services/api';
import {transformIdsDeep} from '../../utils/dataTransform';

/**
 * Завантажує список планів тренувань з бекенду
 */
export const fetchWorkoutPlans = createAsyncThunk(
  'workoutPlans/fetchWorkoutPlans',
  async (params = {}, {rejectWithValue}) => {
    try {
      const response = await workoutPlansService.getWorkoutPlans(params);
      // Бекенд повертає { success: true, data: { workoutPlans: [...], pagination: {...} } }
      const workoutPlans = response.data?.workoutPlans || [];
      // Трансформуємо _id в id
      return transformIdsDeep(workoutPlans);
    } catch (error) {
      return rejectWithValue(
        error.message || 'Помилка завантаження планів тренувань',
      );
    }
  },
);

/**
 * Завантажує план тренувань для конкретної дати
 */
export const fetchWorkoutPlansByDate = createAsyncThunk(
  'workoutPlans/fetchWorkoutPlansByDate',
  async (date, {rejectWithValue}) => {
    try {
      if (!date || typeof date !== 'string') {
        throw new Error('Невалідна дата');
      }

      const response = await workoutPlansService.getWorkoutPlans({date});
      // Бекенд повертає { success: true, data: { workoutPlans: [...], pagination: {...} } }
      const workoutPlans = response.data?.workoutPlans || [];
      // Трансформуємо _id в id
      return transformIdsDeep(workoutPlans);
    } catch (error) {
      return rejectWithValue(
        error.message || 'Помилка завантаження планів тренувань',
      );
    }
  },
);

/**
 * Зберігає план тренування на бекенді
 */
export const saveWorkoutPlan = createAsyncThunk(
  'workoutPlans/saveWorkoutPlan',
  async (planData, {rejectWithValue}) => {
    try {
      if (!planData || typeof planData !== 'object') {
        throw new Error('Невалідні дані плану тренування');
      }
      if (!planData.trainingDate) {
        throw new Error('Відсутня дата тренування');
      }

      const response = await workoutPlansService.createWorkoutPlan(planData);
      // Бекенд повертає { success: true, message: '...', data: workoutPlan }
      // Трансформуємо _id в id
      return transformIdsDeep(response.data);
    } catch (error) {
      return rejectWithValue(
        error.message || 'Помилка збереження плану тренування',
      );
    }
  },
);

/**
 * Оновлює план тренування на бекенді
 */
export const updateWorkoutPlan = createAsyncThunk(
  'workoutPlans/updateWorkoutPlan',
  async ({planId, planData}, {rejectWithValue}) => {
    try {
      if (!planId || !planData || typeof planData !== 'object') {
        throw new Error('Невалідні дані для оновлення');
      }

      const response = await workoutPlansService.updateWorkoutPlan(
        planId,
        planData,
      );
      // Бекенд повертає { success: true, message: '...', data: workoutPlan }
      // Трансформуємо _id в id
      return transformIdsDeep(response.data);
    } catch (error) {
      return rejectWithValue(
        error.message || 'Помилка оновлення плану тренування',
      );
    }
  },
);

/**
 * Видаляє план тренування з бекенду
 */
export const deleteWorkoutPlan = createAsyncThunk(
  'workoutPlans/deleteWorkoutPlan',
  async (planId, {rejectWithValue}) => {
    try {
      if (!planId) {
        throw new Error('Невалідний ID плану тренування');
      }

      await workoutPlansService.deleteWorkoutPlan(planId);
      // Бекенд повертає { success: true, message: '...' }
      return planId;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Помилка видалення плану тренування',
      );
    }
  },
);
