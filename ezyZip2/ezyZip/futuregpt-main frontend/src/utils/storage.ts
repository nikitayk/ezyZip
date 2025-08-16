// ZeroTrace AI Storage Utility
// Handles Chrome extension storage with error handling and debouncing

export interface StorageData {
  'zt:model': string;
  'zt:privacy': boolean;
  'zt:tab': string;
  'zt:toggles': Record<string, boolean>;
  'zt:userProfile': {
    name: string;
    initials: string;
    isPro: boolean;
    tagline: string;
  };
  'zt:preferences': {
    theme: 'dark' | 'light';
    language: string;
    notifications: boolean;
    autoSave: boolean;
  };
}

// Default values
const DEFAULT_VALUES: Partial<StorageData> = {
  'zt:model': 'gpt-3.5-turbo',
  'zt:privacy': true,
  'zt:tab': 'overview',
  'zt:toggles': {},
  'zt:userProfile': {
    name: 'Alex Chen',
    initials: 'AC',
    isPro: true,
    tagline: 'Privacy-first, zero footprint.'
  },
  'zt:preferences': {
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoSave: true
  }
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Storage wrapper with error handling
class ZeroTraceStorage {
  private debouncedWrites = new Map<string, NodeJS.Timeout>();
  private readonly DEBOUNCE_DELAY = 300; // 300ms debounce

  /**
   * Get a value from storage
   */
  async get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | null> {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? null;
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Get multiple values from storage
   */
  async getMultiple<K extends keyof StorageData>(keys: K[]): Promise<Partial<StorageData>> {
    try {
      const result = await chrome.storage.local.get(keys);
      return result;
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return {};
    }
  }

  /**
   * Set a value in storage with debouncing
   */
  async set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<boolean> {
    try {
      // Clear existing debounced write
      if (this.debouncedWrites.has(key)) {
        clearTimeout(this.debouncedWrites.get(key)!);
      }

      // Set new debounced write
      const timeout = setTimeout(async () => {
        try {
          await chrome.storage.local.set({ [key]: value });
          this.debouncedWrites.delete(key);
        } catch (error) {
          console.error(`Storage set error for key "${key}":`, error);
        }
      }, this.DEBOUNCE_DELAY);

      this.debouncedWrites.set(key, timeout);
      return true;
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Set multiple values in storage
   */
  async setMultiple(data: Partial<StorageData>): Promise<boolean> {
    try {
      await chrome.storage.local.set(data);
      return true;
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      return false;
    }
  }

  /**
   * Remove a key from storage
   */
  async remove(key: keyof StorageData): Promise<boolean> {
    try {
      await chrome.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  async getUsage(): Promise<{ bytesInUse: number; quotaBytes: number } | null> {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse();
      const quotaBytes = await chrome.storage.local.getQuotaBytes();
      return { bytesInUse, quotaBytes };
    } catch (error) {
      console.error('Storage usage error:', error);
      return null;
    }
  }

  /**
   * Initialize storage with default values
   */
  async initialize(): Promise<void> {
    try {
      const existing = await this.getMultiple(Object.keys(DEFAULT_VALUES) as (keyof StorageData)[]);
      
      // Only set defaults for missing keys
      const toSet: Partial<StorageData> = {};
      for (const [key, defaultValue] of Object.entries(DEFAULT_VALUES)) {
        if (!(key in existing)) {
          toSet[key as keyof StorageData] = defaultValue as any;
        }
      }

      if (Object.keys(toSet).length > 0) {
        await this.setMultiple(toSet);
        console.log('ZeroTrace AI storage initialized with defaults');
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
    }
  }

  /**
   * Export storage data
   */
  async export(): Promise<string> {
    try {
      const data = await chrome.storage.local.get(null);
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Storage export error:', error);
      return '';
    }
  }

  /**
   * Import storage data
   */
  async import(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      await chrome.storage.local.set(data);
      return true;
    } catch (error) {
      console.error('Storage import error:', error);
      return false;
    }
  }

  /**
   * Listen for storage changes
   */
  onChanged(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void): void {
    chrome.storage.onChanged.addListener(callback);
  }

  /**
   * Remove storage change listener
   */
  removeChangeListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void): void {
    chrome.storage.onChanged.removeListener(callback);
  }
}

// Create and export singleton instance
export const storage = new ZeroTraceStorage();

// Initialize storage when module loads
storage.initialize().catch(console.error);

// Export types for external use
export type { StorageData };
export { ZeroTraceStorage };
