import {SafeAreaView, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {SafeInfoButton} from '../components/SafeInfoButton';
import {useDispatch} from 'react-redux';
import {createNewProgram} from '../redux/action';
import {ProgramInputsComponent} from '../components/ProgramInputsComponent';

export const CreateProgramScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [program, setProgram] = useState('');
  const [isActiveSubmitBtn, setIsActiveSubmitBtn] = useState(false);

  useEffect(() => {
    if (title.length !== 0 || program.length !== 0) {
      setIsActiveSubmitBtn(true);
    }
  }, [title, program]);

  const handleSubmit = () => {
    const uniqueID = `id-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const programObject = {
      id: uniqueID,
      title: title,
      program: program,
    };

    dispatch(createNewProgram(programObject));
    navigation.navigate('ClientPrograms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgramInputsComponent
        navigation={navigation}
        title={title}
        setTitle={setTitle}
        program={program}
        setProgram={setProgram}
        headerTitle={'Створення програми'}
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
