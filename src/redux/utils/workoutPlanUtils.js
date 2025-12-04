import {nanoid} from '@reduxjs/toolkit';
import {normalizeDateValue} from './dateUtils';

const cloneTrainingDate = value => {
  if (!value || typeof value !== 'object') {
    return value;
  }
  return {
    ...value,
    time: Array.isArray(value.time) ? [...value.time] : value.time,
  };
};

const toTrainingDateArray = value => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
};

const resolveSlotIdFromDate = trainingDate => {
  // Може бути об'єкт {date: "YYYY-MM-DD", time: "HH:mm"} або {time: ["HH:mm"]}
  let timeStr = null;
  if (trainingDate?.time) {
    if (typeof trainingDate.time === 'string') {
      // Формат "HH:mm" - беремо час напряму
      timeStr = trainingDate.time;
    } else if (
      Array.isArray(trainingDate.time) &&
      trainingDate.time.length > 0
    ) {
      // Формат ["HH:mm"] - беремо перший елемент
      timeStr = trainingDate.time[0];
    }
  }

  if (!timeStr) {
    return null;
  }

  // Якщо час в форматі "HH:mm", використовуємо його напряму як slotId
  // slotId має бути "HH:00" (округлюємо до години)
  if (typeof timeStr === 'string' && /^\d{2}:\d{2}$/.test(timeStr)) {
    const hour = timeStr.slice(0, 2);
    return `${hour}:00`;
  }

  // Якщо час не в правильному форматі, намагаємося витягнути годину
  const hourMatch = String(timeStr).match(/^(\d{1,2})/);
  if (hourMatch) {
    const hour = hourMatch[1].padStart(2, '0');
    return `${hour}:00`;
  }

  return null;
};

export const buildAgendaState = (agendaTemplate = []) =>
  agendaTemplate.reduce(
    (acc, {timeId}) => {
      if (!timeId) {
        return acc;
      }
      acc.slotIds.push(timeId);
      acc.slotsById[timeId] = {
        timeId,
        occurrences: [],
      };
      return acc;
    },
    {slotIds: [], slotsById: {}},
  );

export const createTrainingEntity = payload => {
  if (!payload) {
    return null;
  }

  const id = payload.id ?? nanoid();

  // Трансформуємо clientId в client з правильною структурою для компонентів
  // Якщо client вже є в payload (локальне створення), перевіряємо його структуру
  let client = payload.client || null;

  // Якщо client є, але не має правильної структури (немає client.client), нормалізуємо
  if (client && !client.client) {
    // Якщо client має поля name/surname напряму, створюємо правильну структуру
    if (client.name || client.surname) {
      client = {
        id: client.id,
        client: {
          name: client.name || '',
          surname: client.surname || '',
          number: client.number || client.phone || '',
          link: client.link || client.connectionMethods || [],
        },
      };
    }
    // Якщо client має тільки id, залишаємо як є (компоненти знайдуть клієнта в store)
  }

  // Якщо client немає, але є clientId, трансформуємо його
  if (!client && payload.clientId) {
    // Якщо clientId - це об'єкт (попульований з бекенду)
    if (typeof payload.clientId === 'object' && payload.clientId !== null) {
      client = {
        id: payload.clientId.id || payload.clientId._id,
        client: {
          name: payload.clientId.name || '',
          surname: payload.clientId.surname || '',
          number: payload.clientId.phone || payload.clientId.number || '',
          link: payload.clientId.connectionMethods || [],
        },
      };
    } else if (typeof payload.clientId === 'string') {
      // Якщо clientId - це просто ID (не попульований), залишаємо як є
      // Компоненти мають знайти клієнта в store за ID
      client = {
        id: payload.clientId,
      };
    }
  }

  // Якщо є occurrences з бекенду, використовуємо їх
  if (
    payload.occurrences &&
    Array.isArray(payload.occurrences) &&
    payload.occurrences.length > 0
  ) {
    const occurrences = payload.occurrences
      .map(occurrence => {
        const slotId = resolveSlotIdFromDate(occurrence.trainingDate);
        if (!slotId) {
          return null;
        }

        return {
          id: occurrence.id || nanoid(),
          slotId,
          trainingDate: occurrence.trainingDate,
          isCanceled: occurrence.isCanceled || false,
        };
      })
      .filter(Boolean);

    if (!occurrences.length) {
      return null;
    }

    const trainingDates = toTrainingDateArray(payload.trainingDate).map(
      cloneTrainingDate,
    );

    const result = {
      ...payload,
      id,
      trainingDate:
        trainingDates.length > 0
          ? trainingDates
          : occurrences.map(occ => occ.trainingDate),
      occurrences,
    };

    // Додаємо client, якщо він є, і видаляємо clientId
    if (client) {
      result.client = client;
      delete result.clientId;
    }

    return result;
  }

  // Якщо occurrences немає, створюємо з trainingDate
  const trainingDates = toTrainingDateArray(payload.trainingDate).map(
    cloneTrainingDate,
  );
  if (!trainingDates.length) {
    return null;
  }

  const occurrences = trainingDates
    .map(dateEntry => {
      const slotId = resolveSlotIdFromDate(dateEntry);
      if (!slotId) {
        return null;
      }

      return {
        id: nanoid(),
        slotId,
        trainingDate: dateEntry,
        isCanceled: false,
      };
    })
    .filter(Boolean);

  if (!occurrences.length) {
    return null;
  }

  const result = {
    ...payload,
    id,
    trainingDate: trainingDates,
    occurrences,
  };

  // Додаємо client, якщо він є, і видаляємо clientId
  if (client) {
    result.client = client;
    delete result.clientId;
  }

  return result;
};

export const attachTrainingToAgenda = (agendaState, training) => {
  if (!agendaState || !training?.occurrences?.length) {
    return;
  }

  training.occurrences.forEach(occurrence => {
    const slot = agendaState.slotsById[occurrence.slotId];
    if (!slot) {
      return;
    }

    const exists = slot.occurrences.some(
      ref =>
        ref.trainingId === training.id && ref.occurrenceId === occurrence.id,
    );

    if (!exists) {
      slot.occurrences.push({
        trainingId: training.id,
        occurrenceId: occurrence.id,
      });
    }
  });
};

const detachOccurrencesByIds = (agendaState, trainingId, occurrenceIds) => {
  if (!agendaState || !occurrenceIds?.length) {
    return;
  }

  const occurrenceIdSet = new Set(occurrenceIds);

  Object.values(agendaState.slotsById).forEach(slot => {
    if (!slot?.occurrences?.length) {
      return;
    }
    slot.occurrences = slot.occurrences.filter(
      ref =>
        !(
          ref.trainingId === trainingId && occurrenceIdSet.has(ref.occurrenceId)
        ),
    );
  });
};

export const detachTrainingFromAgenda = (agendaState, training) => {
  if (!training?.occurrences?.length) {
    return;
  }
  const occurrenceIds = training.occurrences.map(
    ({id: occurrenceId}) => occurrenceId,
  );
  detachOccurrencesByIds(agendaState, training.id, occurrenceIds);
};

export const removeOccurrenceByDate = (training, selectedDate) => {
  if (!training || !selectedDate) {
    return {updatedTraining: training, removedOccurrenceIds: []};
  }

  const normalizedDate = normalizeDateValue(selectedDate);
  if (!normalizedDate) {
    return {updatedTraining: training, removedOccurrenceIds: []};
  }

  const removedOccurrenceIds = [];
  const updatedOccurrences = training.occurrences.filter(occurrence => {
    const occurrenceDate = normalizeDateValue(occurrence.trainingDate);
    if (occurrenceDate !== normalizedDate) {
      return true;
    }
    removedOccurrenceIds.push(occurrence.id);
    return false;
  });

  if (!removedOccurrenceIds.length) {
    return {updatedTraining: training, removedOccurrenceIds};
  }

  const updatedTrainingDates = training.trainingDate.filter(
    dateEntry => normalizeDateValue(dateEntry) !== normalizedDate,
  );

  return {
    updatedTraining: {
      ...training,
      trainingDate: updatedTrainingDates,
      occurrences: updatedOccurrences,
    },
    removedOccurrenceIds,
  };
};

export const detachOccurrencesFromAgenda = (
  agendaState,
  trainingId,
  occurrenceIds,
) => detachOccurrencesByIds(agendaState, trainingId, occurrenceIds);
