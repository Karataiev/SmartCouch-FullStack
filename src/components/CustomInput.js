import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

export const CustomInput = ({
  placeholder,
  value,
  setValue,
  inputType = 'default',
  style,
  onBlur,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  errorText,
  multiline = false,
  numberOfLines = 1,
}) => {
  const [lines, setLines] = useState(1);

  const calculateLinesFromHeight = useCallback(
    height => {
      if (!multiline || !height) {
        return 1;
      }

      const lineHeight = 22;
      const padding = 24;
      const actualHeight = height - padding;
      const calculated = Math.max(1, Math.ceil(actualHeight / lineHeight));

      return calculated;
    },
    [multiline],
  );

  const handleContentSizeChange = useCallback(
    event => {
      if (!multiline) {
        return;
      }

      if (!value || value.trim() === '') {
        setLines(1);
        return;
      }

      const newlineCount = (value.match(/\n/g) || []).length;
      if (newlineCount === 0) {
        setLines(1);
        return;
      }

      const {height} = event.nativeEvent.contentSize;
      const calculated = calculateLinesFromHeight(height);

      setLines(prevLines => {
        if (calculated <= 1) {
          return 1;
        }
        if (prevLines !== calculated) {
          return calculated;
        }
        return prevLines;
      });
    },
    [multiline, calculateLinesFromHeight, value],
  );

  useEffect(() => {
    if (!multiline) {
      return;
    }

    if (!value || value.trim() === '') {
      setLines(1);
      return;
    }

    const newlineCount = (value.match(/\n/g) || []).length;

    setLines(prevLines => {
      if (newlineCount === 0) {
        return 1;
      }
      const newLines = newlineCount + 1;
      if (prevLines !== newLines) {
        return newLines;
      }
      return prevLines;
    });
  }, [multiline, value]);

  const dynamicNumberOfLines = multiline ? lines : 1;

  return (
    <View style={[styles.container, style]}>
      {placeholder && (
        <Text style={styles.inputHeader} pointerEvents="none">
          {placeholder}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={setValue}
        onBlur={onBlur}
        onContentSizeChange={handleContentSizeChange}
        style={[multiline ? styles.inputMultiline : styles.input]}
        placeholder={placeholder}
        placeholderTextColor="#A1A1A1"
        keyboardType={inputType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
        numberOfLines={dynamicNumberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    paddingHorizontal: 8,
    borderBottomColor: '#303030',
    borderBottomWidth: 1,
    color: 'white',
    fontSize: 17,
    lineHeight: 22,
  },
  inputMultiline: {
    width: '100%',
    minHeight: 50,
    maxHeight: 300,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 12,
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
    marginBottom: 4,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#FF5A5F',
  },
});
