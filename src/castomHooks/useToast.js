import React, {createContext, useContext, useRef, useState} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({children}) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = text => {
    setMessage(text);
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 1500);
    });
  };

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, {opacity}]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#4195B9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',

    zIndex: 100,
    elevation: 5,
  },
  toastText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
