import React, {
	createContext,
	useContext,
	useState,
	useCallback,
} from 'react';

import type {
	FileSystemContextType,
	FileSystemItem,
	ItemType,
	ProjectData,
} from '@interfaces/types';

import { DEFAULT_FS } from '@data/DefaultFileSystem';

const generateId = () => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return Math.random().toString(36).slice(2, 9);
};

const FileSystemContext = createContext<FileSystemContextType | undefined>(
	undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useFileSystem = () => {
	const context = useContext(FileSystemContext);
	if (!context) {
		throw new Error('useFileSystem must be used within FileSystemProvider');
	}
	return context;
};

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [items, setItems] = useState<Record<string, FileSystemItem>>(DEFAULT_FS);

	const createItem = useCallback(
		(
			parentId: string,
			name: string,
			type: ItemType,
			appId?: string,
			content?: string | ProjectData
		) => {
			const id = generateId();

			setItems((prev) => ({
				...prev,
				[id]: {
					id,
					parentId,
					name,
					type,
					appId,
					content,
				},
			}));

			return id;
		},
		[]
	);

	const deleteItem = useCallback((id: string) => {
		setItems((prev) => {
			const item = prev[id];
			if (!item) return prev;

			if (item.parentId === 'recycle_bin') {
				const next = { ...prev };
				delete next[id];
				return next;
			}

			return {
				...prev,
				[id]: { ...item, parentId: 'recycle_bin' },
			};
		});
	}, []);

	const restoreItem = useCallback((id: string) => {
		setItems((prev) => ({
			...prev,
			[id]: { ...prev[id], parentId: 'desktop' },
		}));
	}, []);

	const moveItem = useCallback((id: string, newParentId: string) => {
		setItems((prev) => ({
			...prev,
			[id]: { ...prev[id], parentId: newParentId },
		}));
	}, []);

	const renameItem = useCallback((id: string, newName: string) => {
		setItems((prev) => ({
			...prev,
			[id]: { ...prev[id], name: newName },
		}));
	}, []);

	const getItemsInFolder = useCallback(
		(folderId: string) =>
			Object.values(items).filter((item) => item.parentId === folderId),
		[items]
	);

	const getItem = useCallback((id: string) => items[id], [items]);

	return (
		<FileSystemContext.Provider
			value={{
				items,
				createItem,
				deleteItem,
				restoreItem,
				moveItem,
				renameItem,
				getItemsInFolder,
				getItem,
			}}
		>
			{children}
		</FileSystemContext.Provider>
	);
};