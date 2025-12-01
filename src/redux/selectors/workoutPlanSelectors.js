import {createSelector} from '@reduxjs/toolkit';
import {trainingsSelectors} from '../slices/appSlice';
import {convertUkrDateToISO} from '../utils/dateUtils';

const selectTrainingsEntities = trainingsSelectors.selectEntities;

const selectAgendaState = state =>
  state.app.agenda ?? {slotIds: [], slotsById: {}};
const selectIsoDate = (_, date) => date;

export const selectAgendaByDate = createSelector(
  [selectAgendaState, selectTrainingsEntities, selectIsoDate],
  (agenda, trainingEntities, selectedDate) => {
    const slotIds = agenda?.slotIds ?? [];
    const slotsById = agenda?.slotsById ?? {};

    if (!selectedDate) {
      return slotIds.map(slotId => ({timeId: slotId, trainings: []}));
    }

    return slotIds
      .map(slotId => {
        const slot = slotsById[slotId] ?? {timeId: slotId, occurrences: []};
        const trainings = slot.occurrences
          .map(ref => {
            const training = trainingEntities[ref.trainingId];
            if (!training) {
              return null;
            }

            const occurrence = training.occurrences?.find(
              occurrenceItem => occurrenceItem.id === ref.occurrenceId,
            );

            if (!occurrence) {
              return null;
            }

            const trainingInstance = {
              ...training,
              trainingDate: occurrence.trainingDate,
              occurrenceId: occurrence.id,
              isCanceled: occurrence.isCanceled || false,
            };

            if (!selectedDate) {
              return trainingInstance;
            }

            const isoDate = convertUkrDateToISO(
              trainingInstance.trainingDate?.date,
            );
            return isoDate === selectedDate ? trainingInstance : null;
          })
          .filter(Boolean);

        return {
          timeId: slotId,
          trainings,
        };
      })
      .filter(plan => !!plan.timeId);
  },
);

const selectClientId = (_, clientId) => clientId;

export const selectClientTrainingCards = createSelector(
  [trainingsSelectors.selectAll, selectClientId],
  (trainings, clientId) => {
    if (!clientId) {
      return [];
    }

    const clientTrainings = trainings
      .filter(training => training?.client?.id === clientId)
      .flatMap(training =>
        (training.occurrences ?? []).map(occurrence => ({
          ...training,
          trainingDate: occurrence.trainingDate,
        })),
      );

    if (!clientTrainings.length) {
      return [];
    }

    const groupedTrainings = clientTrainings.reduce((acc, training) => {
      const key = training.id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(training);
      return acc;
    }, {});

    return Object.entries(groupedTrainings).map(([key, value]) => ({
      key,
      trainings: value,
    }));
  },
);

export const selectCurrentTime = state => state.app.currentTime;

export const selectTrainingsForDate = createSelector(
  [selectAgendaByDate, selectIsoDate],
  (agendaByDate, selectedDate) => {
    if (!selectedDate || !agendaByDate) {
      return [];
    }
    return agendaByDate.flatMap(slot => slot.trainings || []);
  },
);
