import { NpmCheckUpdateConfig } from '../types';

export default {
  npmcheckupdate: {
    unpkgUrl: 'https://unpkg.com',
    checkInterval: '1d',
    upgradePolicy: 'latest',
    enableInterceptor: true,
  } as NpmCheckUpdateConfig,
};
