import { StyleSheet, View } from 'react-native';
import{registerRootComponent} from 'expo'
import AppForm from './app/components/AppForm';
import Home from './app/components/Home';
import Chat from './app/components/Chat';
import Global from './app/components/Global';
import Profile from './app/components/Profile';
import ProfileSearch from './app/components/ProfileSearch';
import AddPostScreen from './app/components/AddPostScreen';
import {Provider} from 'react-redux'
import {store} from './app/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  function MyTabs({navigation}) {
    return (
      <Tab.Navigator>
        
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{
            headerShown: false 
          }
          }
        />
        <Tab.Screen name="Profile" component={Profile}
        options={{
          headerShown: false 
        }}

        />
        <Tab.Screen 
          name="Private Social" 
          component={Global}
          
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: '#2e64e5',
              fontSize: 18,
            },
            headerStyle: {
              shadowColor: '#fff',
              elevation: 0,
            },
            headerRight: () => (
              <View style={{marginRight: 10}}>
                <FontAwesome5.Button
                  name="plus"
                  size={22}
                  backgroundColor="#fff"
                  color="#2e64e5"
                  onPress={() => navigation.navigate('AddPost')}
                />
              </View>
            ),
          }}    
        />
      </Tab.Navigator>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='AppForm' screenOptions={{headerShown: false}}>
          <Stack.Screen name="AppForm" component={AppForm} />
          <Stack.Screen name="MyTabs" component={MyTabs} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ProfileSearch" component={ProfileSearch}/>
          <Stack.Screen name="AddPost" component={AddPostScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
