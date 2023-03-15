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
  }

  // check whether need to update
  const result = remoteVersion
    ? semver.compare(remoteVersion, pkgVersion)
    : -1;

  return {
    distTag,
    upgradePolicy,
    pkgName,
    pkgVersion,
    pkgBaseDir,
    targetVersion: remoteVersion,
    needUpdate: result > 0,
  };
}

export function displayUpgradeInfo(
  upgradeInfo: UpgradeInfo,
  upgradeInfoHooks?: NpmCheckUpdateConfig['upgradeInfoHooks'],
) {
  // update contents
  let contents = [
    `Update available ${chalk.gray(upgradeInfo.pkgVersion)} → ${chalk.greenBright(upgradeInfo.targetVersion)}`,
    `Run ${chalk.blueBright(`npm i -g ${upgradeInfo.pkgName}@${upgradeInfo.distTag || upgradeInfo.targetVersion}`)} to update`,
  ];

  if (upgradeInfoHooks && upgradeInfoHooks.contents) {
    const result = upgradeInfoHooks.contents(upgradeInfo, contents);
    contents = Array.isArray(result) ? result : result.split(/\r?\n/);
  }

  const minWidth = 40;
  const padding = 3;
  const removeColor = c => c.replace(/\x1B\[\d+m/g, '');
  const len = (c: string) => c.split('')
    .map(c => (c.match(/[\u4e00-\u9fa5]/) ? 2 : 1))
    .reduce((a, b) => a + b as any);

  let contentMaxWidth = contents.map(removeColor)
    .map(a => len(a))
    .sort((a, b) => a - b)
    .pop();
  
  if (contentMaxWidth < minWidth) {
    contentMaxWidth = minWidth;
  }

  // show content
  let fullContents: string[] = [];
  const contentWidth = contentMaxWidth + padding * 2;

  fullContents.push(chalk.yellowBright('╭' + '─'.repeat(contentWidth) + '╮'));
  fullContents.push(chalk.yellowBright('│' + ' '.repeat(contentWidth) + '│'));
  fullContents.push(chalk.yellowBright('│' + ' '.repeat(contentWidth) + '│'));

  contents.forEach(c => {
    const realContentWidth = len(removeColor(c));
    const leftSpace = ' '.repeat(padding + (contentMaxWidth - realContentWidth) / 2);
    const rightSpace = ' '.repeat(contentWidth - leftSpace.length - realContentWidth);
    fullContents.push(chalk.yellowBright('│') + leftSpace + c + rightSpace + chalk.yellowBright('│'));
  });

  fullContents.push(chalk.yellowBright('│' + ' '.repeat(contentWidth) + '│'));
  fullContents.push(chalk.yellowBright('│' + ' '.repeat(contentWidth) + '│'));
  fullContents.push(chalk.yellowBright('╰' + '─'.repeat(contentWidth) + '╯'));
  fullContents = fullContents.map(c => `  ${c}`);

  if (upgradeInfoHooks && upgradeInfoHooks.fullContents) {
    const result = upgradeInfoHooks.fullContents(upgradeInfo, fullContents);
    fullContents = Array.isArray(result) ? result : result.split(/\r?\n/);
  }

  console.info(`\n\n${fullContents.join('\n')}\n\n`);
}