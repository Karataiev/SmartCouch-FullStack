import {SafeAreaView, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useDispatch, useSelector} from 'react-redux';
import {updateProgramsArray} from '../redux/action';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';

export const CurrentProgramScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const programsArr = useSelector(state => state.programs);
  const {itemData} = route.params;
  const [title, setTitle] = useState(itemData.title);
  const [program, setProgram] = useState(itemData.program);
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  useEffect(() => {
    if (title !== itemData.title || program !== itemData.program) {
      setIsActiveSubmitBtn(true);
    } else {
      setIsActiveSubmitBtn(false);
    }
  }, [title, program]);

  const handleSubmit = () => {
    const programDataObject = {
      id: itemData.id,
      title: title,
      program: program,
    };

    const programIndex = programsArr.findIndex(el => el.id === itemData.id);
    programsArr.splice(programIndex, 1, programDataObject);
    dispatch(updateProgramsArray(programsArr));
    setIsActiveSubmitBtn(false);
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
      />
      <SafeInfoButton handleSubmit={handleSubmit} disabled={!isActiveSubmitBtn}>
        Зберегти
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
