import { MdDashboard } from 'react-icons/md';
import Sample from '../../../pages/business/Sample';

export const sampleModule = {
	text: 'Sample Template', // Module name
	icon: MdDashboard, // Module icon
	order: 1, // Sidebar ordering
	submodules: [
		{
			text: 'Sample Template List', // Sidebar text
			path: 'business/sample', // Route URL
			element: Sample, // Actual React component
			permission: 'viewdashboard',
			icon: MdDashboard,
			showInSidebar: true,
			order: 1,
			isInitial: false
		}
	]
};
