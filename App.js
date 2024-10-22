/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './src/components/StackNavigator';
import {PlusMenuModal} from './src/components/PlusMenuModal';

function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
      <PlusMenuModal />
    </NavigationContainer>
  );
}

export default App;
