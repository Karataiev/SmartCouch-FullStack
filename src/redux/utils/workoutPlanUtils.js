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
  const hour = trainingDate?.time?.[0]?.slice(0, 2);
  if (!hour) {
    return null;
  }
  const normalizedHour = hour.padStart(2, '0');
  return `${normalizedHour}:00`;
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

  const trainingDates = toTrainingDateArray(payload.trainingDate).map(cloneTrainingDate);
  if (!trainingDates.length) {
    return null;
  }

  const id = payload.id ?? nanoid();

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
      };
    })
    .filter(Boolean);

  if (!occurrences.length) {
    return null;
  }

  return {
    ...payload,
    id,
    trainingDate: trainingDates,
    occurrences,
  };
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
      ref => ref.trainingId === training.id && ref.occurrenceId === occurrence.id,
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
  const occurrenceIds = training.occurrences.map(({id: occurrenceId}) => occurrenceId);
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

export const detachOccurrencesFromAgenda = (agendaState, trainingId, occurrenceIds) =>
  detachOccurrencesByIds(agendaState, trainingId, occurrenceIds);
