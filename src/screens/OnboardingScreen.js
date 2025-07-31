import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ONBOARDING_DATA} from '../helper/onboardingData';

const {width, height} = Dimensions.get('window');

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('TabBar');
  };

  const renderItem = ({item}) => (
    <ImageBackground
      source={item.background}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}>
      <View style={styles.overlay}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </ImageBackground>
  );

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, {opacity: splashOpacity}]}>
        <ImageBackground
          source={require('../assets/onBoarding/mainOnboardingBackground.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}>
          <View style={styles.overlayMainScreen}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconTitle}>SC</Text>
            </View>
            <Text style={styles.mainOnboardingTitle}>SmartCoach</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarBlock}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, i) => {
              const isVisited = i <= currentIndex;
              const isActive = i === currentIndex;
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    isVisited && {backgroundColor: '#3EB1CC'},
                    isActive && styles.activeDot,
                  ]}
                />
              );
            })}
          </View>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Пропустити</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
            listener: event => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / width);
              setCurrentIndex(index);
            },
          },
        )}
        scrollEventThrottle={16}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === ONBOARDING_DATA.length - 1 ? 'Почати' : 'Далі'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DOT_SIZE = 10;
const ACTIVE_WIDTH = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
  },
  appName: {
    fontSize: 24,
    position: 'absolute',
    bottom: 60,
    color: '#000',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    position: 'absolute',
    zIndex: 2,
  },
  topBarBlock: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
  },
  pagination: {
    position: 'absolute',
    right: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#ccc',
  },
  activeDot: {
    width: ACTIVE_WIDTH,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  appIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#3EB1CC',
    borderRadius: 20,
  },
  appIconTitle: {
    fontSize: 45,
    fontWeight: '800',
    color: 'black',
  },
  overlay: {
    paddingBottom: 120,
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayMainScreen: {
    position: 'relative',
    paddingBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  mainOnboardingTitle: {
    position: 'absolute',
    bottom: 80,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: 'white',
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#eee',
    textAlign: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#3EB1CC',
    width: width - 40,
    paddingVertical: 16,
    borderRadius: 24,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
    color: 'black',
  },
});
