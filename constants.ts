import { GameConfig } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

export const CONFIG: GameConfig = {
  gravity: 0.6,
  jumpStrength: -12,
  groundHeight: 50,
  baseSpeed: 2.5, // Reduced from 3.5 to make it even slower
  spawnRateMountain: 220, // Increased interval to maintain distance with slower speed
  spawnRateYuanbao: 150, // Increased interval for coins
};

export const COLORS = {
  primaryRed: '#DC2626', // red-600
  darkRed: '#991B1B', // red-800
  gold: '#F59E0B', // amber-500
  lightGold: '#FCD34D', // amber-300
  stone: '#E7E5E4', // stone-200 (Lighter stone for contrast on dark background)
  bgSky: '#8F1E1A', // Deep Red as requested
};

export const YUANBAO_VALUE = 10;