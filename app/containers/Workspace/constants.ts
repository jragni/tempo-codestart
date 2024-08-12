/**
 * Workspace constants
 */

import { darcula } from '@uiw/codemirror-theme-darcula';
import { githubDark } from '@uiw/codemirror-theme-github';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

import { Theme } from './definitions';
import { ToastOptions } from 'react-toastify';

export const themeDictionary: Record<string, Theme> = {
  darcula: {
    label: 'darcula',
    theme: darcula,
  },
  githubDark: {
    label: 'Github (dark)',
    theme: githubDark,
  },
  monokai: {
    label: 'monokai',
    theme: monokai,
  },
  vscodeDark: {
    label: 'vscode (dark)',
    theme: vscodeDark,
  },
}

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
  '23px',
  '24px',
  '25px',
];

export const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}