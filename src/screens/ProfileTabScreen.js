import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {ProfileHeaderComponent} from '../components/ProfileHeaderComponent';
import {ProfileMenuComponent} from '../components/ProfileMenuComponent';
import {LayoutComponent} from '../components/LayoutComponent';
import {useDispatch} from 'react-redux';
import {logout} from '../redux/thunks/authThunk';

export const ProfileTabScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Помилка при виході:', error);
      // Навіть якщо помилка, перенаправляємо на логін
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  return (
    <LayoutComponent>
      <View style={styles.profileContainer}>
        <ProfileHeaderComponent />
        <ProfileMenuComponent navigation={navigation} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Вихід</Text>
        </TouchableOpacity>
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#232929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: '#FF3B30',
  },
});
