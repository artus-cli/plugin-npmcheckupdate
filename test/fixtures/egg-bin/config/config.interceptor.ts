import { Command } from '@artus-cli/artus-cli';
import { NpmCheckUpdateConfig } from '../../../../src';
import { Dev } from '../command';

export default {
  npmcheckupdate: {
    enableInterceptor: process.env.DISAPLE_ENTERCEPTOR
      ? false
      : (cmdClz: typeof Command) => cmdClz === Dev,
  } satisfies NpmCheckUpdateConfig,
};
