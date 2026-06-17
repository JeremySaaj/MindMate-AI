/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Auth Feature index configuration

import { FeatureConfig } from '../../core/registry';
import { SignInPage } from './SignInPage';

export const config: FeatureConfig = {
  id: 'auth',
  name: 'Mind Mate Authentication',
  routes: [
    {
      path: '/signin',
      component: SignInPage,
      roles: ['public']
    }
  ]
};
