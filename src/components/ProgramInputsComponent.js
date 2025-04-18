import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {HeaderWithBackButton} from './HeaderWithBackButton';
import {CustomInput} from './CustomInput';
import {useEffect, useState} from 'react';

export const ProgramInputsComponent = ({
  navigation,
  title,
  setTitle,
  program,
  setProgram,
  headerTitle,
  onPressConfig,
}) => {
  const [isActiveConfig, setIsActiveConfig] = useState(false);

  useEffect(() => {
    if (program.length !== 0 && title.length !== 0) {
      setIsActiveConfig(true);
    }
  }, []);
  return (
    <ScrollView>
      <HeaderWithBackButton
        navigation={navigation}
        configBtn={isActiveConfig}
        onPressConfig={() => onPressConfig()}>
        {headerTitle}
      </HeaderWithBackButton>
      <View style={styles.mainContent}>
        <CustomInput
          placeholder="Назва програми"
          value={title}
          setValue={setTitle}
        />
        <View>
          <Text style={styles.inputHeader}>Програма</Text>
          <TextInput
            value={program}
            onChangeText={setProgram}
            style={styles.input}
            placeholder={'Програма'}
            placeholderTextColor={'#A1A1A1'}
            inputMode={'text'}
            multiline={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    display: 'flex',
    width: '100%',
    marginTop: 24,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 20,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
  inputHeader: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'white',
  },
});
