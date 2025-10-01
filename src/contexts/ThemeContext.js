import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setDarkTheme(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !darkTheme;
      setDarkTheme(newTheme);
      await AsyncStorage.setItem('theme', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    primary: darkTheme ? '#FF8C00' : '#FF8C00', // สีส้มหลัก
    text: darkTheme ? '#ffffff' : '#000000', // ขาว/ดำ
    card: darkTheme ? '#1a1a1a' : '#ffffff', // ดำ/ขาว
    background: darkTheme ? '#000000' : '#ffffff', // ดำ/ขาว
    border: darkTheme ? '#FF8C00' : '#FF8C00', // สีส้ม
    button: '#FF8C00', // สีส้มสำหรับปุ่ม
    buttonText: '#ffffff', // ขาวสำหรับข้อความปุ่ม
    gradients: {
      sunset: ['#FF8C00', '#FF6347'],
      orange: ['#FF8C00', '#FFA500'],
      darkOrange: ['#FF8C00', '#CC6600'],
      ocean: ['#56c5e4ff', '#2E50B0'],
      forest: ['#4CAF50', '#68f46fff'],
      purple: ['#9C27B0', '#E1BEE7'],
      pink: ['#E91E63', '#F8BBD9']
    }
  };

  const value = {
    darkTheme,
    toggleTheme,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;