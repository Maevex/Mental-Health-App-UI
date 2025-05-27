import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: Platform.OS === 'ios' ? 80 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          elevation: 10, // android shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case 'dash':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ChatScreen':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'user':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="dash"
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarLabel: 'Profil',
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="hasil" options={{ href: null }} />
      <Tabs.Screen name="keluhan" options={{ href: null }} />
      <Tabs.Screen name="subkategori" options={{ href: null }} />
      <Tabs.Screen name="edit" options={{ href: null }} />
    </Tabs>
  );
}
