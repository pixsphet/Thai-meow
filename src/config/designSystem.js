import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Duolingo-inspired Design System
export const DESIGN_SYSTEM = {
  // Colors (Duolingo-inspired palette)
  colors: {
    // Primary colors
    primary: '#58CC02', // Duolingo green
    primaryDark: '#4BA300',
    primaryLight: '#7ED321',
    
    // Secondary colors
    secondary: '#FF9600', // Duolingo orange
    secondaryDark: '#E6850E',
    secondaryLight: '#FFB84D',
    
    // Accent colors
    accent: '#1CB0F6', // Duolingo blue
    accentDark: '#0A9ED9',
    accentLight: '#4CC9F0',
    
    // Status colors
    success: '#58CC02',
    warning: '#FF9600',
    error: '#FF4B4B',
    info: '#1CB0F6',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#121416',
    },
    
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#E9ECEF',
    },
    
    // Text colors
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      tertiary: '#ADB5BD',
      inverse: '#FFFFFF',
    },
    
    // Surface colors
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      elevated: '#FFFFFF',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 32,
      '2xl': 36,
      '3xl': 40,
      '4xl': 44,
      '5xl': 56,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Layout
  layout: {
    screenWidth: width,
    screenHeight: height,
    maxWidth: 400,
    edgePadding: 16,
    contentPadding: 20,
  },
  
  // Animation
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Common styles
export const COMMON_STYLES = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
  },
  
  // Card styles
  card: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.lg,
    ...DESIGN_SYSTEM.shadows.md,
  },
  
  // Button styles
  button: {
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: DESIGN_SYSTEM.colors.secondary,
  },
  
  buttonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.lg,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.white,
  },
  
  // Text styles
  text: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    lineHeight: DESIGN_SYSTEM.typography.lineHeight.base,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  
  textLarge: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
    lineHeight: DESIGN_SYSTEM.typography.lineHeight.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  
  textSmall: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.sm,
    lineHeight: DESIGN_SYSTEM.typography.lineHeight.sm,
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
  
  // Input styles
  input: {
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.gray[300],
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    fontSize: DESIGN_SYSTEM.typography.fontSize.base,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  
  inputFocused: {
    borderColor: DESIGN_SYSTEM.colors.primary,
  },
  
  // Progress styles
  progressBar: {
    height: 8,
    backgroundColor: DESIGN_SYSTEM.colors.gray[200],
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
};

export default DESIGN_SYSTEM;
