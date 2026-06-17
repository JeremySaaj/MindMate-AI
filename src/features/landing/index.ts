/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Landing Page Feature Registration

import { FeatureConfig } from '../../core/registry';
import { LandingPage } from './LandingPage';

export const config: FeatureConfig = {
  id: 'landing',
  name: 'Mind Mate Landing Page',
  // Landing is public but registered so the shell knows about it if needed
  routes: [
    {
      path: '/landing',
      component: LandingPage,
      roles: ['public']
    }
  ]
};
