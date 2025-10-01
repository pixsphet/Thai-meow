import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserProvider } from './src/contexts/UserContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import { AppProvider } from './src/contexts/AppContext';

import FirstScreen from './src/screens/FirstScreen';
import Onboarding1 from './src/screens/Onboarding1';
import Onboarding2 from './src/screens/Onboarding2';
import Onboarding3 from './src/screens/Onboarding3';


import LevelScreen from './src/screens/LevelScreen';
import LevelStage1 from './src/screens/LevelStage1';
import LevelStage2 from './src/screens/LevelStage2';
import LevelStage3 from './src/screens/LevelStage3';

import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';

import ProfileScreen from './src/screens/ProfileScreen';
import DailyChallengeScreen from './src/screens/DailyChallengeScreen';
import TreasureChestScreen from './src/screens/TreasurechestScreen';
import MiniGameScreen from './src/screens/MiniGameScreen';
import ArrangeSentenceScreen from './src/screens/ArrangeSentenceScreen';
import WordMatchingGame from './src/screens/WordMatchingGame';
import SimpleWordGame from './src/screens/SimpleWordGame';
import BasicWordGame from './src/screens/BasicWordGame';
import AdvancedWordGame from './src/screens/AdvancedWordGame';
import BeginnerWordGame from './src/screens/BeginnerWordGame';
import AdvancedVocabularyGame from './src/screens/AdvancedVocabularyGame';
import DuolingoStyleGame from './src/screens/DuolingoStyleGame';
import BeginnerDuolingoGame from './src/screens/BeginnerDuolingoGame';
import IntermediateDuolingoGame from './src/screens/IntermediateDuolingoGame';
import AchievementScreen from './src/screens/AchievementScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import Level1Stage1Game from './src/screens/Level1Stage1Game';
import ThaiConsonantsGame from './src/screens/ThaiConsonantsGame';
import ThaiVowelsGame from './src/screens/ThaiVowelsGame';
import SettingsScreen from './src/screens/SettingsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ProgressDashboardScreen from './src/screens/ProgressDashboardScreen';
import GameCompleteScreen from './src/screens/GameCompleteScreen';
import LessonCompleteScreen from './src/screens/LessonCompleteScreen';
import MainTab from './src/screens/MainTab';
import NewLessonGame from './src/screens/NewLessonGame';
import QuestScreen from './src/screens/QuestScreen';
import ForgotPasswordEmailScreen from './src/screens/ForgotPasswordEmailScreen';
import AddFriendScreen from './src/screens/AddFriendScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <UserProvider>
          <ProgressProvider>
            <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="First" component={FirstScreen} />
          <Stack.Screen name="Onboarding1" component={Onboarding1} />
          <Stack.Screen name="Onboarding2" component={Onboarding2} />
          <Stack.Screen name="Onboarding3" component={Onboarding3} />


          <Stack.Screen name="LevelScreen" component={LevelScreen} />
          <Stack.Screen name="Level" component={BottomTabNavigator} />
          <Stack.Screen name="LevelStage1" component={LevelStage1} />
          <Stack.Screen name="LevelStage2" component={LevelStage2} />
          <Stack.Screen name="LevelStage3" component={LevelStage3} />

          <Stack.Screen name="Register" component={SignUpScreen} />
          <Stack.Screen name="Login" component={SignInScreen} />

          {/* ✅ นำทางเข้า Bottom Tab */}
          <Stack.Screen name="MainTab" component={MainTab} />

          <Stack.Screen name="MiniGame" component={MiniGameScreen} />
          <Stack.Screen name="ArrangeSentence" component={ArrangeSentenceScreen} />
          <Stack.Screen name="WordMatching" component={WordMatchingGame} />
          <Stack.Screen name="SimpleWord" component={SimpleWordGame} />
          <Stack.Screen name="BasicWord" component={BasicWordGame} />
          <Stack.Screen name="AdvancedWord" component={AdvancedWordGame} />
          <Stack.Screen name="AdvancedVocabulary" component={AdvancedVocabularyGame} />
          <Stack.Screen name="DuolingoStyle" component={DuolingoStyleGame} />
          <Stack.Screen name="BeginnerDuolingo" component={BeginnerDuolingoGame} />
          <Stack.Screen name="IntermediateDuolingo" component={IntermediateDuolingoGame} />
          <Stack.Screen name="Achievements" component={AchievementScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Level1Stage1Game" component={Level1Stage1Game} />
          <Stack.Screen name="ThaiConsonants" component={ThaiConsonantsGame} />
          <Stack.Screen name="ThaiVowels" component={ThaiVowelsGame} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
          <Stack.Screen name="GameComplete" component={GameCompleteScreen} />
          <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
          <Stack.Screen name="BeginnerWord" component={BeginnerWordGame} />
          <Stack.Screen name="LessonComplete" component={LessonCompleteScreen} />
          <Stack.Screen name="NewLessonGame" component={NewLessonGame} />
          <Stack.Screen name="Quest" component={QuestScreen} />
          <Stack.Screen name="AddFriend" component={AddFriendScreen} />
          <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmailScreen} />
        </Stack.Navigator>
            </NavigationContainer>
          </ProgressProvider>
        </UserProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
