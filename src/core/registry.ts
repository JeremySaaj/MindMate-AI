/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Auto-discovery registry core file
// This file must not be modified by teammates when adding features.
// Features auto-register by exporting their configuration under /src/features/<feature>/index.ts

import { ComponentType } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: string; // Name of Lucide Icon
  roles: ('student' | 'teacher' | 'admin')[];
  order?: number;
}

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  roles: ('student' | 'teacher' | 'admin' | 'public')[];
}

export interface FeatureConfig {
  id: string;
  name: string;
  navItems?: NavItem[];
  routes?: RouteConfig[];
}

// Automatically scan the features folder using Vite's glob import
// It matches any file in features/*/index.ts
const featureModules = (import.meta as any).glob('../features/*/index.ts', { eager: true });

let cachedFeatures: FeatureConfig[] | null = null;

export function getFeatures(): FeatureConfig[] {
  if (cachedFeatures) {
    return cachedFeatures;
  }

  const features: FeatureConfig[] = [];
  
  for (const path in featureModules) {
    const mod = featureModules[path] as { config?: FeatureConfig };
    if (mod && mod.config) {
      features.push(mod.config);
    } else {
      console.warn(`Feature at ${path} is missing a default/named 'config' export.`);
    }
  }

  // Sort by id for deterministic order
  features.sort((a, b) => a.id.localeCompare(b.id));
  cachedFeatures = features;
  return features;
}

export function getRoutesForRole(role: 'student' | 'teacher' | 'admin' | 'public'): RouteConfig[] {
  const allFeatures = getFeatures();
  const routes: RouteConfig[] = [];

  for (const feature of allFeatures) {
    if (feature.routes) {
      for (const r of feature.routes) {
        if (r.roles.includes(role) || r.roles.includes('public')) {
          routes.push(r);
        }
      }
    }
  }

  return routes;
}

export function getNavItemsForRole(role: 'student' | 'teacher' | 'admin'): NavItem[] {
  const allFeatures = getFeatures();
  const navItems: NavItem[] = [];

  for (const feature of allFeatures) {
    if (feature.navItems) {
      for (const item of feature.navItems) {
        if (item.roles.includes(role)) {
          navItems.push(item);
        }
      }
    }
  }

  return navItems.sort((a, b) => (a.order || 99) - (b.order || 99));
}
