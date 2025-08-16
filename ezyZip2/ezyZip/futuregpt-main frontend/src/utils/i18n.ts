// ZeroTrace AI Internationalization Module
// Supports multiple languages with fallback and extensible string management

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'zh';

export interface LanguageStrings {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    settings: string;
    help: string;
    about: string;
  };

  // App
  app: {
    title: string;
    tagline: string;
    version: string;
    copyright: string;
  };

  // Navigation
  navigation: {
    overview: string;
    shield: string;
    tools: string;
    settings: string;
    profile: string;
    logout: string;
  };

  // Features
  features: {
    traceCleaner: {
      title: string;
      description: string;
      status: string;
    };
    cookieShield: {
      title: string;
      description: string;
      status: string;
    };
    aiProxy: {
      title: string;
      description: string;
      status: string;
    };
    secureNotes: {
      title: string;
      description: string;
      status: string;
    };
    sessionGuard: {
      title: string;
      description: string;
      status: string;
    };
    modelBoost: {
      title: string;
      description: string;
      status: string;
    };
  };

  // Status
  status: {
    active: string;
    enhanced: string;
    secured: string;
    disabled: string;
    error: string;
    warning: string;
    info: string;
  };

  // Settings
  settings: {
    general: string;
    privacy: string;
    security: string;
    appearance: string;
    language: string;
    notifications: string;
    data: string;
    about: string;
    
    // General
    theme: string;
    language: string;
    autoSave: string;
    notifications: string;
    
    // Privacy
    privacyMode: string;
    privacyModeDescription: string;
    trackingProtection: string;
    cookieProtection: string;
    
    // Security
    sessionTimeout: string;
    autoLock: string;
    encryption: string;
    
    // Appearance
    darkMode: string;
    lightMode: string;
    systemMode: string;
    accentColor: string;
    
    // Data
    exportData: string;
    importData: string;
    clearData: string;
    dataUsage: string;
  };

  // AI Models
  aiModels: {
    gpt35Turbo: string;
    gpt4: string;
    claude4: string;
    geminiPro: string;
    deepseek: string;
    
    // Descriptions
    fastEfficient: string;
    highQuality: string;
    advancedReasoning: string;
    creativeSolutions: string;
    mathematical: string;
  };

  // Messages
  messages: {
    // Success
    settingsSaved: string;
    featureEnabled: string;
    featureDisabled: string;
    dataExported: string;
    dataImported: string;
    
    // Errors
    saveError: string;
    loadError: string;
    networkError: string;
    permissionError: string;
    
    // Confirmations
    confirmDelete: string;
    confirmClear: string;
    confirmLogout: string;
    
    // Info
    noFeatures: string;
    loadingFeatures: string;
    storageUsage: string;
  };

  // Input
  input: {
    placeholder: string;
    send: string;
    typing: string;
    enterMessage: string;
  };

  // Profile
  profile: {
    name: string;
    email: string;
    plan: string;
    pro: string;
    free: string;
    upgrade: string;
    manage: string;
  };
}

// English strings (default)
const englishStrings: LanguageStrings = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    settings: 'Settings',
    help: 'Help',
    about: 'About'
  },

  app: {
    title: 'ZeroTrace AI',
    tagline: 'Privacy-first, zero footprint.',
    version: '1.0.0',
    copyright: '© 2024 ZeroTrace AI. All rights reserved.'
  },

  navigation: {
    overview: 'Overview',
    shield: 'Shield',
    tools: 'Tools',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout'
  },

  features: {
    traceCleaner: {
      title: 'Trace Cleaner',
      description: 'Wipe browsing traces on close',
      status: 'Secured'
    },
    cookieShield: {
      title: 'Cookie Shield',
      description: 'Auto-reject trackers',
      status: 'Active'
    },
    aiProxy: {
      title: 'AI Proxy',
      description: 'Route via ZeroTrace proxy',
      status: 'Enhanced'
    },
    secureNotes: {
      title: 'Secure Notes',
      description: 'Ephemeral scratchpad',
      status: 'Secured'
    },
    sessionGuard: {
      title: 'Session Guard',
      description: 'Auto-lock with inactivity',
      status: 'Active'
    },
    modelBoost: {
      title: 'Model Boost',
      description: 'Smart prompt optimizer',
      status: 'Enhanced'
    }
  },

  status: {
    active: 'Active',
    enhanced: 'Enhanced',
    secured: 'Secured',
    disabled: 'Disabled',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  },

  settings: {
    general: 'General',
    privacy: 'Privacy',
    security: 'Security',
    appearance: 'Appearance',
    language: 'Language',
    notifications: 'Notifications',
    data: 'Data',
    about: 'About',
    
    theme: 'Theme',
    language: 'Language',
    autoSave: 'Auto Save',
    notifications: 'Notifications',
    
    privacyMode: 'Privacy Mode',
    privacyModeDescription: 'Enable enhanced privacy protection',
    trackingProtection: 'Tracking Protection',
    cookieProtection: 'Cookie Protection',
    
    sessionTimeout: 'Session Timeout',
    autoLock: 'Auto Lock',
    encryption: 'Encryption',
    
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemMode: 'System Mode',
    accentColor: 'Accent Color',
    
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear Data',
    dataUsage: 'Data Usage'
  },

  aiModels: {
    gpt35Turbo: 'GPT-3.5 Turbo',
    gpt4: 'GPT-4',
    claude4: 'Claude-4',
    geminiPro: 'Gemini Pro',
    deepseek: 'DeepSeek',
    
    fastEfficient: 'Fast & Efficient',
    highQuality: 'High Quality',
    advancedReasoning: 'Advanced Reasoning',
    creativeSolutions: 'Creative Solutions',
    mathematical: 'Mathematical'
  },

  messages: {
    settingsSaved: 'Settings saved successfully',
    featureEnabled: 'Feature enabled',
    featureDisabled: 'Feature disabled',
    dataExported: 'Data exported successfully',
    dataImported: 'Data imported successfully',
    
    saveError: 'We couldn\'t save your preferences. They\'ll apply until you close the popup.',
    loadError: 'Failed to load data',
    networkError: 'Network error occurred',
    permissionError: 'Permission denied',
    
    confirmDelete: 'Are you sure you want to delete this?',
    confirmClear: 'Are you sure you want to clear all data?',
    confirmLogout: 'Are you sure you want to logout?',
    
    noFeatures: 'No features yet—enable from Settings.',
    loadingFeatures: 'Loading features...',
    storageUsage: 'Storage usage'
  },

  input: {
    placeholder: 'Ask me anything...',
    send: 'Send',
    typing: 'Typing...',
    enterMessage: 'Enter your message'
  },

  profile: {
    name: 'Name',
    email: 'Email',
    plan: 'Plan',
    pro: 'Pro',
    free: 'Free',
    upgrade: 'Upgrade',
    manage: 'Manage'
  }
};

// Spanish strings
const spanishStrings: LanguageStrings = {
  ...englishStrings,
  app: {
    title: 'ZeroTrace AI',
    tagline: 'Privacidad primero, huella cero.',
    version: '1.0.0',
    copyright: '© 2024 ZeroTrace AI. Todos los derechos reservados.'
  },
  navigation: {
    overview: 'Resumen',
    shield: 'Escudo',
    tools: 'Herramientas',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar sesión'
  },
  // Add more Spanish translations as needed
};

// French strings
const frenchStrings: LanguageStrings = {
  ...englishStrings,
  app: {
    title: 'ZeroTrace AI',
    tagline: 'Confidentialité d\'abord, empreinte zéro.',
    version: '1.0.0',
    copyright: '© 2024 ZeroTrace AI. Tous droits réservés.'
  },
  navigation: {
    overview: 'Aperçu',
    shield: 'Bouclier',
    tools: 'Outils',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion'
  },
  // Add more French translations as needed
};

// Language map
const languageMap: Record<SupportedLanguage, LanguageStrings> = {
  en: englishStrings,
  es: spanishStrings,
  fr: frenchStrings,
  de: englishStrings, // TODO: Add German translations
  ja: englishStrings, // TODO: Add Japanese translations
  ko: englishStrings, // TODO: Add Korean translations
  zh: englishStrings  // TODO: Add Chinese translations
};

// i18n class
class I18n {
  private currentLanguage: SupportedLanguage = 'en';
  private fallbackLanguage: SupportedLanguage = 'en';

  constructor() {
    this.detectLanguage();
  }

  /**
   * Detect user's preferred language
   */
  private detectLanguage(): void {
    try {
      // Try to get from storage first
      const savedLanguage = localStorage.getItem('zt:language') as SupportedLanguage;
      if (savedLanguage && this.isSupported(savedLanguage)) {
        this.currentLanguage = savedLanguage;
        return;
      }

      // Fall back to browser language
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (this.isSupported(browserLang)) {
        this.currentLanguage = browserLang;
        return;
      }

      // Default to English
      this.currentLanguage = 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      this.currentLanguage = 'en';
    }
  }

  /**
   * Check if language is supported
   */
  private isSupported(lang: string): lang is SupportedLanguage {
    return Object.keys(languageMap).includes(lang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Set language
   */
  async setLanguage(lang: SupportedLanguage): Promise<void> {
    if (!this.isSupported(lang)) {
      throw new Error(`Unsupported language: ${lang}`);
    }

    this.currentLanguage = lang;
    
    try {
      localStorage.setItem('zt:language', lang);
      
      // Update document language attribute
      document.documentElement.lang = lang;
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }

  /**
   * Get string by key path
   */
  t(keyPath: string): string {
    try {
      const keys = keyPath.split('.');
      let value: any = languageMap[this.currentLanguage] || languageMap[this.fallbackLanguage];
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          // Fallback to English
          value = this.getNestedValue(languageMap[this.fallbackLanguage], keys);
          break;
        }
      }
      
      return typeof value === 'string' ? value : keyPath;
    } catch (error) {
      console.error(`Translation error for key "${keyPath}":`, error);
      return keyPath;
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, keys: string[]): any {
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  }

  /**
   * Get all strings for current language
   */
  getAllStrings(): LanguageStrings {
    return languageMap[this.currentLanguage] || languageMap[this.fallbackLanguage];
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(languageMap) as SupportedLanguage[];
  }

  /**
   * Format string with parameters
   */
  format(keyPath: string, params: Record<string, string | number>): string {
    let str = this.t(keyPath);
    
    for (const [key, value] of Object.entries(params)) {
      str = str.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }
    
    return str;
  }

  /**
   * Get plural form
   */
  plural(keyPath: string, count: number, singular: string, plural: string): string {
    const baseKey = this.t(keyPath);
    return count === 1 ? singular : plural;
  }
}

// Create and export singleton instance
export const i18n = new I18n();

// Export types and utilities
export type { LanguageStrings, SupportedLanguage };
export { I18n };

// Convenience function for translations
export const t = (keyPath: string): string => i18n.t(keyPath);

// Convenience function for formatted strings
export const format = (keyPath: string, params: Record<string, string | number>): string => 
  i18n.format(keyPath, params);
