/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Example Feature index file
// Provides standard Status/Health Dashboard and custom templates for other developers to clone.

import { FeatureConfig } from '../../core/registry';
import { ExampleView } from './ExampleView';

export const config: FeatureConfig = {
  id: 'example',
  name: 'System Example & Status',
  navItems: [],
  routes: []
};
