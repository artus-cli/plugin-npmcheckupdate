import { NpmCheckUpdateConfig } from '../types';

export default {
  npmcheckupdate: {
    unpkgUrl: 'https://unpkg.com',
    checkInterval: '1d',
    upgradePolicy: 'latest',
    enableCommand: true,
    enableInterceptor: true,
    upgradeInfoPrintPosition: 'after',
  } as NpmCheckUpdateConfig,
};
