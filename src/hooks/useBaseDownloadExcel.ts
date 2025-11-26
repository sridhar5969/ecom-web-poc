import { useState, useRef, useEffect } from 'react';
import { notificationService } from '../services/notifications/notification.service';
import baseFetch from '../utils/baseFetch';
import downloadFile from '../utils/downloadFile';
import Cookie from '../utils/Cookie';

const useBaseDownload = () => {
	const [loading, setLoading] = useState(false);
	const controllerRef = useRef<AbortController | null>(null);

	const token = Cookie.getToken();

	useEffect(() => {
		return () => {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
		};
	}, []);

	const handleDownloadFile = async (filePath: string) => {
		if (!token) {
			notificationService.error('Missing Authorization token', 'API Error');
			return;
		}

		setLoading(true);
		const controller = new AbortController();
		controllerRef.current = controller;

		try {
			const response = await baseFetch(`files/${filePath}`, controller, token);
			const blob = await response.blob();

			await downloadFile(blob, filePath);
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				// Handle abort error silently
			} else {
				const errorMessage = error instanceof Error ? error.message : "Couldn't download the file.";
				notificationService.error(errorMessage, 'Download Failed');
			}
		} finally {
			setLoading(false);
			controllerRef.current = null;
		}
	};

	return { loading, handleDownloadFile };
};

export default useBaseDownload;
