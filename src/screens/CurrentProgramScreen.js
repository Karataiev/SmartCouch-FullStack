import React, {useEffect, useState, useMemo} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';
import {ConfigModal} from '../components/ConfigModal';
import {updateClientProgram, updateProgramsArray} from '../redux/action';
import {RemoveModal} from '../components/RemoveModal';
import {LayoutComponent} from '../components/LayoutComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToast} from '../castomHooks/useToast';

export const CurrentProgramScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {showToast} = useToast();
  const programs = useSelector(state => state.app.programs);
  const {itemData, origin, clientId} = route.params;

  const [title, setTitle] = useState(itemData.title);
  const [program, setProgram] = useState(itemData.program);
  const [isSubmitActive, setSubmitActive] = useState(false);
  const [isConfigModalVisible, setConfigModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  useEffect(() => {
    setSubmitActive(title !== itemData.title || program !== itemData.program);
  }, [title, program, itemData]);

  const programData = useMemo(
    () => ({
      id: itemData.id,
      title,
      program,
    }),
    [title, program, itemData.id],
  );

  const handleSubmit = () => {
    const updatedPrograms = programs.map(p =>
      p.id === itemData.id ? programData : p,
    );

    if (origin === 'ClientsProfileScreen') {
      const updatedProgram = updatedPrograms.find(p => p.id === itemData.id);
      dispatch(
        updateClientProgram({
          clientId,
          programInfo: updatedProgram,
        }),
      );
    } else {
      dispatch(updateProgramsArray(updatedPrograms));
    }

    setSubmitActive(false);
    Keyboard.dismiss();
    showToast('Зміни збережено');
  };

  const handleRemoveFromAllPrograms = () => {
    const updatedPrograms = programs.filter(p => p.id !== itemData.id);
    dispatch(updateProgramsArray(updatedPrograms));
    showToast('Програму видаленно');
    navigation.goBack();
  };

  const handleRemoveFromClient = () => {
    dispatch(
      updateClientProgram({
        clientId,
        programInfo: {id: '', title: '', program: ''},
      }),
    );
    showToast('Програму видаленно');
    navigation.goBack();
  };

  const handleNavigate = screen => {
    if (screen === 'ClientProgramAssignment') {
      navigation.navigate(screen, {itemData: programData});
    } else {
      navigation.navigate(screen);
    }
  };

  const handleConfirmRemovePress = () => {
    setRemoveModalVisible(false);
    handleRemoveFromClient();
  };

  return (
    <LayoutComponent>
      <SafeAreaView style={styles.container}>
        <ProgramInputsComponent
          navigation={navigation}
          title={title}
          setTitle={setTitle}
          program={program}
          setProgram={setProgram}
          headerTitle="Програма"
          origin={origin}
          isActiveConfig={true}
          onPressConfig={() => setConfigModalVisible(true)}
          onPressRemove={() => setRemoveModalVisible(true)}
        />

        <SafeInfoButton handleSubmit={handleSubmit} disabled={!isSubmitActive}>
          Зберегти
        </SafeInfoButton>

        <ConfigModal
          whereIsOpen="CurrentProgram"
          visible={isConfigModalVisible}
          hideModal={() => setConfigModalVisible(false)}
          handleNavigate={handleNavigate}
          handleRemove={handleRemoveFromAllPrograms}
        />

        <RemoveModal
          visible={removeModalVisible}
          hideModal={() => setRemoveModalVisible(false)}
          handleRemove={handleConfirmRemovePress}
          headerTitle={'Видалити програму для обраного клієнта?'}
        />
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
