import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProfileHeaderComponent} from '../components/ProfileHeaderComponent';
import {ProfileMenuComponent} from '../components/ProfileMenuComponent';
import {LayoutComponent} from '../components/LayoutComponent';

export const ProfileTabScreen = ({navigation}) => {
  return (
    <LayoutComponent>
      <View style={styles.profileContainer}>
        <ProfileHeaderComponent />
        <ProfileMenuComponent navigation={navigation} />
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
});
