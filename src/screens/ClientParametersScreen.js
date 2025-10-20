import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderWithBackButton} from '../components/HeaderWithBackButton';
import {ClientParametersDate} from '../components/ClientParametersDate';
import {ClientParametersContent} from '../components/ClientParametersContent';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {updateClientParameters} from '../redux/action';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

const bodyMeasurements = [
  {key: 'bodyWeight', label: 'Вага тіла', unit: 'кг'},
  {key: 'height', label: 'Зріст', unit: 'см'},
  {key: 'neck', label: 'Шия', unit: 'см'},
  {key: 'chest', label: 'Груди', unit: 'см'},
  {key: 'waist', label: 'Талія', unit: 'см'},
  {key: 'abdomen', label: 'Живіт', unit: 'см'},
  {key: 'hips', label: 'Сідниці', unit: 'см'},
  {key: 'shoulders', label: 'Плечі', unit: 'см'},
  {key: 'forearm', label: 'Передпліччя', unit: 'см'},
  {key: 'biceps', label: 'Біцепс', unit: 'см'},
  {key: 'wrist', label: 'Зап’ястя', unit: 'см'},
  {key: 'thigh', label: 'Стегно', unit: 'см'},
  {key: 'calf', label: 'Ікри', unit: 'см'},
];

export const ClientParametersScreen = ({route}) => {
  const dispatch = useDispatch();
  const clientId = route.params?.clientId;

  const client = useSelector(state =>
    state.clients?.find(c => c.id === clientId),
  );

  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [firstColumnData, setFirstColumnData] = useState({});
  const [secondColumnData, setSecondColumnData] = useState({});
  const [initialFirst, setInitialFirst] = useState({});
  const [initialSecond, setInitialSecond] = useState({});
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  useEffect(() => {
    if (client?.params?.length) {
      const [first = {}, second = {}] = client.params;
      setFirstColumnData(first);
      setSecondColumnData(second);
      setFirstDate(first.date || '');
      setSecondDate(second.date || '');
      setInitialFirst(first);
      setInitialSecond(second);
    }
  }, [client]);

  const checkIfChanged = (first, second, date1, date2) => {
    const changed =
      JSON.stringify(first) !== JSON.stringify(initialFirst) ||
      JSON.stringify(second) !== JSON.stringify(initialSecond) ||
      date1 !== (initialFirst?.date || '') ||
      date2 !== (initialSecond?.date || '');
    setIsActiveSubmitBtn(changed);
  };

  const handleSubmit = () => {
    const completeFirst = {
      date: firstDate,
      ...bodyMeasurements.reduce((acc, item) => {
        acc[item.key] = firstColumnData[item.key] || '';
        return acc;
      }, {}),
    };

    const completeSecond = {
      date: secondDate,
      ...bodyMeasurements.reduce((acc, item) => {
        acc[item.key] = secondColumnData[item.key] || '';
        return acc;
      }, {}),
    };

    dispatch(
      updateClientParameters({
        clientId,
        FirstParamsInfo: completeFirst,
        SecondParamsInfo: completeSecond,
      }),
    );

    setInitialFirst(completeFirst);
    setInitialSecond(completeSecond);
    setIsActiveSubmitBtn(false);
  };

  return (
    <LayoutComponent>
      <>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <SafeAreaView style={styles.container}>
            <HeaderWithBackButton>Заміри</HeaderWithBackButton>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag">
              <View style={styles.row}>
                <View style={styles.column}>
                  <ClientParametersDate
                    value={firstDate}
                    onChange={val => {
                      setFirstDate(val);
                      checkIfChanged(
                        firstColumnData,
                        secondColumnData,
                        val,
                        secondDate,
                      );
                    }}
                    title="Дата-1"
                  />
                  <ClientParametersContent
                    data={bodyMeasurements}
                    columnKeyPrefix="1"
                    values={firstColumnData}
                    onValueChange={(key, val) => {
                      const updated = {...firstColumnData, [key]: val};
                      setFirstColumnData(updated);
                      checkIfChanged(
                        updated,
                        secondColumnData,
                        firstDate,
                        secondDate,
                      );
                    }}
                  />
                </View>
                <View style={styles.column}>
                  <ClientParametersDate
                    value={secondDate}
                    onChange={val => {
                      setSecondDate(val);
                      checkIfChanged(
                        firstColumnData,
                        secondColumnData,
                        firstDate,
                        val,
                      );
                    }}
                    title="Дата-2"
                  />
                  <ClientParametersContent
                    data={bodyMeasurements}
                    columnKeyPrefix="2"
                    values={secondColumnData}
                    onValueChange={(key, val) => {
                      const updated = {...secondColumnData, [key]: val};
                      setSecondColumnData(updated);
                      checkIfChanged(
                        firstColumnData,
                        updated,
                        firstDate,
                        secondDate,
                      );
                    }}
                  />
                </View>
              </View>

              <SafeInfoButton
                handleSubmit={handleSubmit}
                disabled={!isActiveSubmitBtn}>
                Зберегти
              </SafeInfoButton>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    flex: 1,
  },
});
