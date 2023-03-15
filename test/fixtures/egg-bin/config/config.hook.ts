import { NpmCheckUpdateConfig, UpgradeInfo } from '../../../../src';

const npmcheckupdate: NpmCheckUpdateConfig = {
  upgradeInfoHooks: {},
};

if (process.env.CONTENTS) {
  npmcheckupdate.upgradeInfoHooks.contents = (_upgradeInfo: UpgradeInfo, contents: string[]) => {
    return [...contents, `Changelog: http://666`];
  };
} else if (process.env.CONTENTS_STR) {
  npmcheckupdate.upgradeInfoHooks.contents = () => {
    return '12345\n上山打老虎';
  };
} else if (process.env.FULL_CONTENTS) {
  npmcheckupdate.upgradeInfoHooks.fullContents = (_upgradeInfo: UpgradeInfo, fullContents: string[]) => {
    return [...fullContents, `666`];
  };
} else if (process.env.FULL_CONTENTS_STR) {
  npmcheckupdate.upgradeInfoHooks.fullContents = () => {
    return '12345\n老铁双击 666';
  };
}

export default {
  npmcheckupdate,
};
