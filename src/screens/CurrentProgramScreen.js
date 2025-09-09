import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
  Easing,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';
import {ConfigModal} from '../components/ConfigModal';
import {updateClientProgram, updateProgramsArray} from '../redux/action';
import {RemoveModal} from '../components/RemoveModal';
import {LayoutComponent} from '../components/LayoutComponent';

export const CurrentProgramScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const programs = useSelector(state => state.programs);
  const {itemData, origin, clientId} = route.params;

  const [title, setTitle] = useState(itemData.title);
  const [program, setProgram] = useState(itemData.program);
  const [isSubmitActive, setSubmitActive] = useState(false);
  const [isConfigModalVisible, setConfigModalVisible] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const showAnimatedSuccessMessage = () => {
    setShowSuccessMessage(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }).start(() => {
          setShowSuccessMessage(false);
        });
      }, 2000);
    });
  };

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
    showAnimatedSuccessMessage();
  };

  const handleRemoveFromAllPrograms = () => {
    const updatedPrograms = programs.filter(p => p.id !== itemData.id);
    dispatch(updateProgramsArray(updatedPrograms));
    navigation.goBack();
  };

  const handleRemoveFromClient = () => {
    dispatch(
      updateClientProgram({
        clientId,
        programInfo: {id: '', title: '', program: ''},
      }),
    );
    navigation.goBack();
  };

  const handleNavigate = screen => {
    if (screen === 'ClientProgramAssignment') {
      navigation.navigate(screen, {itemData: programData});
    } else {
      navigation.navigate(screen);
    }
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

        {showSuccessMessage && (
          <Animated.View style={[styles.toastContainer, {opacity: fadeAnim}]}>
            <Text style={styles.toastText}>Зміни збережено</Text>
          </Animated.View>
        )}

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
          handleRemove={handleRemoveFromClient}
        />
      </SafeAreaView>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 42,
    paddingHorizontal: 20,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
