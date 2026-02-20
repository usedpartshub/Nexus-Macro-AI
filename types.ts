
export enum NexusStatus {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  EXECUTING = 'EXECUTING',
  ALERT = 'ALERT'
}

export interface MacroStep {
  id: string;
  type: 'CLICK' | 'TYPE' | 'OPEN_URL' | 'CLOSE_TAB' | 'WAIT' | 'ADB_SHELL' | 'SWIPE' | 'SCREEN_CAPTURE' | 'UI_ANALYSIS' | 'SWITCH_ACCOUNT';
  value: string;
  coordX?: number;
  coordY?: number;
  delayMs: number;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  trigger: 'command' | 'schedule' | 'event';
  steps: MacroStep[];
  lastRun?: Date;
  status: 'active' | 'paused';
}

export interface Credential {
  id: string;
  platform: string;
  username: string;
  passwordEncrypted: string;
  totpSecret?: string;
  lastUsed?: Date;
}

export interface SensorData {
  magnetometer: number;
  rfLevel: number;
  tamperLevel: 'low' | 'medium' | 'high';
}

export interface HarvestTask {
  id: string;
  url: string;
  type: 'github' | 'wget';
  status: 'pending' | 'cloning' | 'completed' | 'failed';
  path: string;
}

export interface EmailIdentity {
  id: string;
  email: string;
  provider: 'grok' | 'chatgpt' | 'gemini' | 'custom';
  isActive: boolean;
  usageCount: number;
}
