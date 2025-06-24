import React, {useState, useMemo, useCallback} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import {createNewProgram, updateClientProgram} from '../redux/action';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';
import {SafeInfoButton} from '../components/SafeInfoButton';

export const CreateProgramScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('');

  const isActiveSubmitBtn =
    title.trim().length > 0 || program.trim().length > 0;

  const programObject = useMemo(() => {
    const uniqueID = `id-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2)}`;
    return {
      id: uniqueID,
      title: title.trim(),
      program: program.trim(),
    };
  }, [title, program]);

  const handleSubmit = useCallback(() => {
    if (route.params?.clientId) {
      dispatch(
        updateClientProgram({
          clientId: route.params.clientId,
          programInfo: programObject,
        }),
      );

      navigation.navigate('ProgramClientAssignment', {
        origin: route.params?.origin || 'MyPrograms',
        clientId: route.params?.clientId,
      });
    } else {
      navigation.navigate('MyPrograms');
    }

    dispatch(createNewProgram(programObject));
    setTitle('');
    setProgram('');
  }, [dispatch, navigation, route.params, programObject]);

  return (
    <SafeAreaView style={styles.container}>
      <ProgramInputsComponent
        navigation={navigation}
        title={title}
        setTitle={setTitle}
        program={program}
        setProgram={setProgram}
        headerTitle="Створення програми"
      />
      <SafeInfoButton handleSubmit={handleSubmit} disabled={!isActiveSubmitBtn}>
        Створити програму
      </SafeInfoButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
