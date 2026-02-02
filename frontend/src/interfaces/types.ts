import type {
  ComponentType,
  LazyExoticComponent,
  ReactNode,
} from 'react';

export type IconType = ComponentType<unknown> | string;
export type ItemType = 'folder' | 'file' | 'app';
export type MenuKey = 'file' | 'edit' | 'view' | 'help';

export interface AppBaseProps {
  windowId: string;
}

export interface ProjectData {
  title: string;
  subtitle: string;
  banner: string;
  skills: string[];
  description: string;
  link?: string;
}

export interface FileSystemItem {
  id: string;
  parentId: string | null;
  name: string;
  type: ItemType;
  appId?: string;
  content?: string | ProjectData;
  icon?: IconType;
}



export interface WindowState {
  id: string;
  title: string;
  icon: IconType;
  component: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type AppComponent =
  | ComponentType<AppBaseProps>
  | LazyExoticComponent<ComponentType<AppBaseProps>>;


export interface AppDefinition {
  id: string;
  title: string;
  icon: IconType;
  component: AppComponent;
  defaultSize?: { width: number; height: number };
  visibility?: {
    desktop?: boolean;
    programs?: boolean;
  };
  system?: boolean;
}

export interface SystemStateContextType {
  isCrashed: boolean;
  isShutDown: boolean;
  crashSystem: () => void;
  rebootSystem: () => void;
  shutDownSystem: () => void;
  returnToGame: () => void;
  systemResetCount: number;
}

export interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;

  openWindow: (
    app: AppDefinition,
    initialProps?: Record<string, unknown>
  ) => void;

  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;

  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  updateWindowTitle: (id: string, title: string) => void;

  getAppById: (id: string) => AppDefinition | undefined;
}

export interface OSContextType extends SystemStateContextType, WindowManagerContextType { }



export interface FileSystemContextType {
  items: Record<string, FileSystemItem>;

  createItem: (
    parentId: string,
    name: string,
    type: ItemType,
    appId?: string,
    content?: string | ProjectData
  ) => string;

  deleteItem: (id: string) => void;
  restoreItem: (id: string) => void;
  moveItem: (id: string, newParentId: string) => void;
  renameItem: (id: string, newName: string) => void;

  getItemsInFolder: (folderId: string) => FileSystemItem[];
  getItem: (id: string) => FileSystemItem | undefined;
}



export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ResizeEndHandler = (width: number, height: number) => void;


export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2;
  size: Vector2;
}
