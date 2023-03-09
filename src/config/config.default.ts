import { NpmCheckUpdateConfig } from '../types';

export default {
  npmcheckupdate: {
    unpkgUrl: 'https://unpkg.com',
    checkInterval: 0,
    upgradePolicy: 'latest',
    enableInterceptor: true,
  } as NpmCheckUpdateConfig,
};
