import React, {useState, useMemo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import {createNewProgram, updateClientProgram} from '../redux/action';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <ProgramInputsComponent
          navigation={navigation}
          title={title}
          setTitle={setTitle}
          program={program}
          setProgram={setProgram}
          headerTitle="Створення програми"
        />
        <SafeInfoButton
          handleSubmit={handleSubmit}
          disabled={!isActiveSubmitBtn}>
          Створити програму
        </SafeInfoButton>
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
