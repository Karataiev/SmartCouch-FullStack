import {Keyboard, SafeAreaView, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useDispatch, useSelector} from 'react-redux';
import {updateProgramsArray} from '../redux/action';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';
import {ConfigModal} from '../components/ConfigModal';

export const CurrentProgramScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const programsArr = useSelector(state => state.programs);
  const {itemData} = route.params;
  const [title, setTitle] = useState(itemData.title);
  const [program, setProgram] = useState(itemData.program);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);
  const [isToggleModal, setIsToggleModal] = useState(false);

  useEffect(() => {
    if (title !== itemData.title || program !== itemData.program) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
  }, [title, program]);

  const programDataObject = {
    id: itemData.id,
    title: title,
    program: program,
  };

  const handleSubmit = () => {
    const programIndex = programsArr.findIndex(el => el.id === itemData.id);
    programsArr.splice(programIndex, 1, programDataObject);
    dispatch(updateProgramsArray(programsArr));
    setIsActiveSubmitBtn(false);
    Keyboard.dismiss();
  };

  const onPressConfig = () => {
    setIsToggleModal(true);
  };

  const handleRemoveProgram = () => {
    const newProgramsArr = programsArr.filter(prog => prog.id !== itemData.id);
    dispatch(updateProgramsArray(newProgramsArr));
  };

  const handleNavigate = screen => {
    if (screen === 'PinningProgram') {
      navigation.navigate(screen, {
        itemData: programDataObject,
      });
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgramInputsComponent
        navigation={navigation}
        title={title}
        setTitle={setTitle}
        program={program}
        setProgram={setProgram}
        headerTitle={'Програма'}
        onPressConfig={onPressConfig}
      />
      <SafeInfoButton handleSubmit={handleSubmit} disabled={!isActiveSubmitBtn}>
        Зберегти
      </SafeInfoButton>
      <ConfigModal
        whereIsOpen="CurrentProgram"
        visible={isToggleModal}
        hideModal={() => setIsToggleModal(false)}
        handleNavigate={handleNavigate}
        handleRemove={handleRemoveProgram}
      />
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
