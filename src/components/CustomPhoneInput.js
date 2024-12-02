import {StyleSheet, Text, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

export const CustomPhoneInput = ({
  placeholderTextColor,
  inputHeader,
  number,
  setNumber,
}) => {
  const handleFocusNumber = () => {
    if (!number) {
      setNumber('+38 0');
    } else {
      setNumber(number);
    }
  };

  const handleOutNumber = () => {
    if (number && number.length > 5) {
      setNumber(number);
    } else {
      setNumber('');
    }
  };

  return (
    <View>
      {inputHeader && <Text style={styles.inputHeader}>Телефон</Text>}
      <TextInputMask
        type={'custom'}
        options={{
          mask: '+38 0** *** ** **',
        }}
        value={number}
        onChangeText={setNumber}
        onFocus={() => handleFocusNumber()}
        onBlur={() => handleOutNumber()}
        style={styles.input}
        placeholder="Телефон"
        placeholderTextColor={placeholderTextColor}
        keyboardType="numeric"
        maxLength={17}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
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
