import type { ComponentType } from 'react';
import { sampleModule } from './protected/modules/sample.module';

// Lazy-loaded components
export const imports = {};

/**
 * Screen configuration interface
 */
export interface ScreenConfig {
	/** Icon component (only required for sidebar items) */
	icon?: ComponentType<{ fill?: string }>;
	/** Display text for the screen */
	text: string;
	/** Route path */
	path: string;
	/** React component to render */
	element: ComponentType;
	/** Required permission string */
	permission: string;
	/** Whether this is the initial route */
	isInitial?: boolean;
	/** Display order (only required for items that show in sidebar) */
	order?: number;
	/** Whether to show in sidebar */
	showInSidebar?: boolean;
}

/**
 * Main module configuration interface
 */
export interface MainModuleConfig {
	/** Module display text */
	text: string;
	/** Module icon component */
	icon: ComponentType<{ fill?: string }>;
	/** Display order */
	order: number;
	/** Submodules/screens within this module */
	submodules: ScreenConfig[];
}

// Main module configurations with hierarchical structure
export const mainModuleConfigs = [sampleModule];

// Flattened screen configurations for backward compatibility and routing
export const screenConfigs: ScreenConfig[] = mainModuleConfigs.flatMap(module => module.submodules);
