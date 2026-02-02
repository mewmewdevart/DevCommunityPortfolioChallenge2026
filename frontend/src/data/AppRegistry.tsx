import { lazy } from 'react';
import type { AppDefinition } from '@interfaces/types';

import iconCalculator from 'pixelarticons/svg/calculator.svg';
import iconPaint from 'pixelarticons/svg/paint-bucket.svg';
import iconLightbulb from 'pixelarticons/svg/lightbulb.svg';
import iconFile from 'pixelarticons/svg/file.svg';
import iconBug from 'pixelarticons/svg/bug.svg';

import internetExploreIcon from '@assets/icons/icon-internet-explorer.png';
import folderFullIcon from '@assets/icons/icon-folder.png';
import computerIcon from '@assets/icons/icon-computer.png';
import recycleBinIcon from '@assets/icons/icon-recycle-bin.png';
import notepadIcon from '@assets/icons/icon-text-file.png';
import webcamIcon from '@assets/icons/icon-webcam.png';
import mensagerIcon from '@assets/icons/icon-messenger.png';
import welcomeIcon from '@assets/icons/icon_information.png';
import googleIcon from '@assets/icons/icon_google.png';

const CalculatorApp = lazy(() => import('@features/Calculator/Calculator').then(m => ({ default: m.CalculatorApp })));
const FileExplorer = lazy(() => import('@features/FileExplorer/FileExplorer').then(m => ({ default: m.FileExplorer })));
const InternetExplorer = lazy(() => import('@features/InternetExplorer/InternetExplorer').then(m => ({ default: m.InternetExplorer })));
const Notepad = lazy(() => import('@features/Notepad/Notepad').then(m => ({ default: m.Notepad })));
const Welcome = lazy(() => import('@features/Welcome/Welcome').then(m => ({ default: m.Welcome })));
const Paint = lazy(() => import('@features/Paint/Paint').then(m => ({ default: m.Paint })));
const PDFViewer = lazy(() => import('@features/PDFViewer/PDFViewer').then(m => ({ default: m.PDFViewer })));
const Messenger = lazy(() => import('@features/Messenger/Messenger').then(m => ({ default: m.Messenger })));
const CameraApp = lazy(() => import('@features/Camera/Camera').then(m => ({ default: m.CameraApp })));
const Google = lazy(() => import('@features/Google/Google').then(m => ({ default: m.Google })));
const VirtualAssistantApp = lazy(() => import('@/features/VirtualAssistantApp/VirtualAssistantApp').then(m => ({ default: m.VirtualAssistantApp })));
const FakeVirusPayload = lazy(() => import('@/features/FakePath/FakePath').then(m => ({ default: m.FakePath })));

import { APP_IDS } from './appIds';
export { APP_IDS };

// eslint-disable-next-line react-refresh/only-export-components
export const AppRegistry: AppDefinition[] = [
  // SYSTEM
  {
    id: APP_IDS.COMPUTER,
    title: 'My Computer',
    icon: computerIcon,
    component: () => <FileExplorer folderId="desktop" />,
    defaultSize: { width: 500, height: 400 },
    system: true,
    visibility: { desktop: false, programs: false },
  },
  {
    id: APP_IDS.TRASH,
    title: 'Recycle Bin',
    icon: recycleBinIcon,
    component: () => <FileExplorer folderId="recycle_bin" />,
    defaultSize: { width: 400, height: 400 },
    system: true,
    visibility: { desktop: true, programs: false },
  },
  {
    id: APP_IDS.PROJECTS,
    title: 'Projects',
    icon: folderFullIcon,
    component: () => <FileExplorer folderId="projects" />,
    defaultSize: { width: 600, height: 400 },
    system: true,
    visibility: { desktop: true, programs: false },
  },

  // UTILITIES
  {
    id: APP_IDS.NOTEPAD,
    title: 'Notepad',
    icon: notepadIcon,
    component: Notepad,
    defaultSize: { width: 500, height: 400 },
    system: true,
    visibility: { desktop: false, programs: true },
  },
  {
    id: APP_IDS.CALCULATOR,
    title: 'Calculator',
    icon: iconCalculator,
    component: CalculatorApp,
    defaultSize: { width: 370, height: 420 },
    visibility: { desktop: false, programs: true },
  },
  {
    id: APP_IDS.PAINT,
    title: 'Paint',
    icon: iconPaint,
    component: Paint,
    defaultSize: { width: 600, height: 450 },
    system: true,
    visibility: { desktop: false, programs: true },
  },

  // INTERNET & MEDIA
  {
    id: APP_IDS.EXPLORER,
    title: 'Internet Explorer',
    icon: internetExploreIcon,
    component: InternetExplorer,
    defaultSize: { width: 800, height: 600 },
    system: true,
    visibility: { desktop: false, programs: true },
  },
  {
    id: APP_IDS.GOOGLE,
    title: 'Google Chrome',
    icon: googleIcon,
    component: Google,
    defaultSize: { width: 300, height: 500 },
    system: true,
    visibility: { desktop: true, programs: true },
  },
  {
    id: APP_IDS.MESSENGER,
    title: 'Messenger',
    icon: mensagerIcon,
    component: Messenger,
    defaultSize: { width: 300, height: 500 },
    system: true,
    visibility: { desktop: false, programs: true },
  },
  {
    id: APP_IDS.CAMERA,
    title: 'Camera',
    icon: webcamIcon,
    component: CameraApp,
    defaultSize: { width: 300, height: 500 },
    system: true,
    visibility: { desktop: true, programs: true },
  },

  // TOOLS & MISC
  {
    id: APP_IDS.WELCOME,
    title: 'Welcome',
    icon: welcomeIcon,
    component: Welcome,
    defaultSize: { width: 700, height: 550 },
    system: true,
    visibility: { desktop: true, programs: true },
  },
  {
    id: APP_IDS.ASSISTANT,
    title: 'Assistant',
    icon: iconLightbulb,
    component: VirtualAssistantApp,
    defaultSize: { width: 300, height: 100 },
    system: true,
    visibility: { desktop: false, programs: true },
  },
  {
    id: APP_IDS.PDF_VIEWER,
    title: 'Reader 1.0',
    icon: iconFile,
    component: PDFViewer,
    defaultSize: { width: 600, height: 700 },
    system: true,
    visibility: { desktop: false, programs: false },
  },
  {
    id: APP_IDS.FAKEPATH,
    title: 'Virus Installer',
    icon: iconBug,
    component: FakeVirusPayload,
    defaultSize: { width: 300, height: 200 },
    visibility: { desktop: false, programs: false },
  },
];