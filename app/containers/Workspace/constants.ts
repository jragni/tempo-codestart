/**
 * Workspace constants
 */
import { SandpackTheme } from '@codesandbox/sandpack-react';
import {
  amethyst,
  cobalt2,
  dracula,
  ecoLight,
  gruvboxDark
} from '@codesandbox/sandpack-themes'

interface ThemeOption {
  label: string;
  value: SandpackTheme;
}

export const themeDictionary: Record<string, ThemeOption>  = {
  amethyst: {
    label: 'Amethyst',
    value: amethyst,
  },
  cobalt2: {
    label: 'Cobalt2',
    value: cobalt2,
  },
  gruvboxDark: {
    label: 'Gruvbox Dark',
    value: gruvboxDark,
  },
  dracula: {
    label: 'Dracula',
    value: dracula,
  },
  ecoLight: {
    label: 'Eco Light',
    value: ecoLight,
  },
};

export const fontSizes: string[] = [
  '12px',
  '13px',
  '14px',
  '15px',
  '16px',
  '17px',
  '18px',
  '19px',
  '20px',
  '21px',
  '22px',
];