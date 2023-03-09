import { NpmCheckUpdateConfig } from '../../../../src';

export default {
  npmcheckupdate: {
    upgradePolicy: process.env.UPGRADE_POLICY,
  } satisfies NpmCheckUpdateConfig,
};
