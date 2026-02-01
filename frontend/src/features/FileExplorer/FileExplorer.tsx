import React, { useState, useEffect } from 'react';
import iconFileAlt from 'pixelarticons/svg/file-alt.svg';
import iconArrowUp from 'pixelarticons/svg/arrow-up.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import { useFileSystem } from '@context/FileSystemContext';
import { useOS } from '@context/OSContext';
import { WinButton } from '@atoms/WinButton/WinButton';
import { useTranslation } from '@context/LanguageContext';
import FolderIcon from '@assets/icons/icon-folder-small.png'
import './FileExplorer.css';

interface FileExplorerProps {
  folderId?: string;
  windowId?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  folderId = 'desktop',
  windowId,
}) => {
  const { openWindow, getAppById, updateWindowTitle } = useOS();
  const { getItemsInFolder, getItem, deleteItem } = useFileSystem();
  const { t } = useTranslation();

  const [currentPath, setCurrentPath] = useState(folderId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentFolder = getItem(currentPath);
  const items = getItemsInFolder(currentPath);

  useEffect(() => {
    if (!windowId || !currentFolder) return;
    updateWindowTitle(windowId, currentFolder.name);
  }, [currentPath, windowId, currentFolder, updateWindowTitle]);
  const handleDoubleClick = (id: string) => {
    const item = getItem(id);
    if (!item) return;

    if (item.type === 'folder') {
      setCurrentPath(item.id);
      setSelectedId(null);
    }
    else if (item.type === 'file' && item.appId) {
      const appDef = getAppById(item.appId);

      if (appDef) {
        openWindow(appDef, {
          content: item.content,
          title: item.name
        });
      }
    }
  };

  const handleUp = () => {
    if (currentFolder?.parentId) {
      setCurrentPath(currentFolder.parentId);
      setSelectedId(null);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteItem(selectedId);
      setSelectedId(null);
    }
  };

  return (
    <section
      className="file-explorer"
      tabIndex={-1} // Container itself usually shouldn't be tab-stop if it has interactive children, but if it captures keys...
      onKeyDown={(e) => {
        if (e.key === 'Delete') handleDelete();
      }}
      onClick={() => setSelectedId(null)}
      aria-label={t('file_explorer') || "File Explorer"}
    >
      <header className="file-explorer-toolbar">
        <span className="file-explorer-address">
          {t('address_label')} {currentFolder?.name || t('computer_root')}
        </span>

        <WinButton
          onClick={handleUp}
          disabled={!currentFolder?.parentId}
          className="file-explorer-up-btn"
          title={t('ie_back')}
          style={{ opacity: !currentFolder?.parentId ? 0.5 : 1 }}
        >
          <IconRenderer icon={iconArrowUp} size={12} />
        </WinButton>
      </header>

      <div className="file-explorer-grid" role="list" aria-label={t('files_list') || "Files list"}>
        {items.length === 0 && (
          <div className="file-explorer-empty">{t('folder_empty')}</div>
        )}

        {items.map((item) => {
          const selected = selectedId === item.id;

          return (
            <button
              type="button"
              key={item.id}
              className={`file-item ${selected ? 'file-item-selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClick(item.id);
              }}
              role="listitem"
              aria-selected={selected}
            >
              <div className="file-item-icon">
                {item.type === 'folder' ? (
                  <img src={FolderIcon} alt="" className='file-explorer_action-icon ' />
                ) : (
                  <IconRenderer
                    icon={iconFileAlt}
                    size={32}
                    className="file-item-icon__svg file-item-icon__svg--file"
                  />
                )}
              </div>

              <span className="file-item-name">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <footer className="file-explorer-status">
        {items.length} {t('objects_count')}
      </footer>
    </section>
  );
};