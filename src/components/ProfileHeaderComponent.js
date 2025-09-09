import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgProfileOptions} from '../assets/svgIcons/SvgProfileOptions';
import {SvgCreateService} from '../assets/svgIcons/SvgCreateService';
import {SvgLocation} from '../assets/svgIcons/SvgLocation';
import {SvgSchedule} from '../assets/svgIcons/SvgSchedule';

export const ProfileHeaderComponent = () => {
  return (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileGreeting}>Привіт,</Text>
        <TouchableOpacity style={styles.profileOptionsBtn}>
          <SvgProfileOptions />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileName}>Ігор</Text>

      <View style={styles.addedInfoBtns}>
        <TouchableOpacity style={styles.addedInfoItem}>
          <SvgCreateService />
          <Text style={styles.itemTitle}>Мої послуги</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addedInfoItem}>
          <SvgLocation />
          <Text style={styles.itemTitle}>Локація</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addedInfoItem}>
          <SvgSchedule />
          <Text style={styles.itemTitle}>Мій графік</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeaderContainer: {
    position: 'relative',
    paddingTop: 42,
    height: 172,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#232929',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  profileGreeting: {
    color: 'white',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '400',
  },
  profileOptionsBtn: {
    padding: 12,
    backgroundColor: 'rgba(133, 193, 219, 0.15)',
    borderRadius: 200,
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    lineHeight: 20,
    fontWeight: '700',
  },
  addedInfoBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  addedInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 21,
    borderRadius: 10,
    width: '32%',
    backgroundColor: '#364040',
  },
  itemTitle: {
    color: 'white',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    marginTop: 12,
  },
});
