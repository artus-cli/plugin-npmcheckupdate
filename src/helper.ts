import chalk from 'chalk';
import urllib from 'urllib';
import assert from 'assert';
import semver from 'semver';
import { NpmCheckUpdateConfig, UpgradeInfo } from './types';
import debug from 'debug';
const helperDebug = debug('npmcheckupdate#helper');

export async function checkUpdate(option: Pick<NpmCheckUpdateConfig, 'unpkgUrl' | 'upgradePolicy'> & {
  pkgName: string;
  pkgVersion: string;
  pkgBaseDir: string;
}) {
  const { unpkgUrl, upgradePolicy, pkgVersion, pkgName, pkgBaseDir } = option;

  let distTag: string | undefined;
  let remoteVersionPatterns: string;
  const [ major, minor ] = pkgVersion.split('.');
  if (upgradePolicy === 'major') {
    remoteVersionPatterns = '*';
  } else if (upgradePolicy === 'minor') {
    remoteVersionPatterns = `${major}.*`;
  } else if (upgradePolicy === 'patch') {
    remoteVersionPatterns = `${major}.${minor}.*`;
  } else {
    distTag = upgradePolicy;
    remoteVersionPatterns = upgradePolicy;
  }

  // request unpkg to get version info
  let remoteVersion: string;
  const unpkgHost = unpkgUrl.endsWith('/') ? unpkgUrl : `${unpkgUrl}/`;
  const remoteUrl = `${unpkgHost}${pkgName}@${remoteVersionPatterns}/package.json`;
  try {
    const { data } = await urllib.request(remoteUrl, {
      dataType: 'json',
    });

    assert(data.version, 'Invalid package.json, not found version info');
    remoteVersion = data.version;
  } catch(e) {
    helperDebug(`Request ${remoteUrl} failed with error: ` + e.message);
    return undefined;
  }

  // check whether need to update
  const result = semver.compare(remoteVersion, pkgVersion);
  if (result > 0) {
    return {
      distTag,
      upgradePolicy,
      pkgName,
      pkgVersion,
      pkgBaseDir,
      targetVersion: remoteVersion,
    };
  }

  return undefined;
}

export function displayUpgradeInfo(upgradeInfo: UpgradeInfo) {
  // update contents
  const contents = [
    `Update available ${chalk.gray(upgradeInfo.pkgVersion)} → ${chalk.greenBright(upgradeInfo.targetVersion)}`,
    `Run ${chalk.blueBright(`npm i -g ${upgradeInfo.pkgName}@${upgradeInfo.distTag || upgradeInfo.targetVersion}`)} to update`,
  ];

  const removeColor = c => c.replace(/\x1B\[\d+m/g, '');
  const maxLen = contents.map(removeColor)
    .sort((a, b) => a.length - b.length)
    .pop().length;

  // show content
  const distanceLen = 2;
  const displayContents: string[] = [];
  const contentLen = maxLen + distanceLen * 2;
  displayContents.push('┌' + '─'.repeat(contentLen) + '┐');
  displayContents.push('│' + ' '.repeat(contentLen) + '│');
  displayContents.push('│' + ' '.repeat(contentLen) + '│');

  contents.forEach(c => {
    const realContentLen = removeColor(c).length;
    const leftSpace = ' '.repeat(distanceLen + (maxLen - realContentLen) / 2);
    const rightSpace = ' '.repeat(contentLen - leftSpace.length - realContentLen);
    displayContents.push('│' + leftSpace + c + rightSpace + '│');
  });

  displayContents.push('│' + ' '.repeat(contentLen) + '│');
  displayContents.push('│' + ' '.repeat(contentLen) + '│');
  displayContents.push('└' + '─'.repeat(contentLen) + '┘');
  console.info(`\n\n${displayContents.map(c => `  ${c}`).join('\n')}\n\n`);
}