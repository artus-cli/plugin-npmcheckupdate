import { run } from './test-utils';
import rimraf from 'rimraf';
import path from 'path';
import assert from 'assert';

describe('test/index.test.ts', () => {
  beforeEach(async () => {
    rimraf.sync(path.resolve(__dirname, './fixtures/*/.npmcheckupdate'));
  });

  it('should display upgrade info without error', async () => {
    await run('egg-bin', '-h')
      .debug()
      .expect('stdout', /Update available 1.0.0 → [2-9]+.\d+.\d+/)
      .expect('stdout', /Run npm i -g egg-bin@latest to update/)
      .end();
  });

  it('should display upgrade info with patch version without error', async () => {
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'policy', UPGRADE_POLICY: 'patch' },
    })
      .debug()
      .expect('stdout', /Update available 1.0.0 → 1.0.\d+/)
      .expect('stdout', /Run npm i -g egg-bin@1.0.\d+ to update/)
      .end();
  });

  it('should display upgrade info with minor version without error', async () => {
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'policy', UPGRADE_POLICY: 'minor' },
    })
      .debug()
      .expect('stdout', /Update available 1.0.0 → 1.\d+.\d+/)
      .expect('stdout', /Run npm i -g egg-bin@1.\d+.\d+ to update/)
      .end();
  });

  it('should display upgrade info with major version without error', async () => {
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'policy', UPGRADE_POLICY: 'major' },
    })
      .debug()
      .expect('stdout', /Update available 1.0.0 → [2-9]+.\d+.\d+/)
      .expect('stdout', /Run npm i -g egg-bin@[2-9]+.\d+.\d+ to update/)
      .end();
  });

  it.skip('should not check update when cache is expired', async () => {
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'interval' },
    })
      .debug()
      .expect('stdout', /Update available/)
      .end();

    // not expired
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'interval' },
    })
      .debug()
      .notExpect('stdout', /Update available/)
      .end();

    await new Promise(resolve => setTimeout(resolve, 10000));

    // expired
    await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'interval' },
    })
      .debug()
      .expect('stdout', /Update available/)
      .end();
  });

  it('should use enableInterceptor without error', async () => {
    await run('egg-bin', 'dev', {
      env: { ARTUS_CLI_ENV: 'interceptor', DISAPLE_ENTERCEPTOR: 'true' },
    })
      // .debug()
      .notExpect('stdout', /Update available/)
      .end();

    await run('egg-bin', 'dev', {
      env: { ARTUS_CLI_ENV: 'interceptor' },
    })
      // .debug()
      .expect('stdout', /Update available/)
      .end();

    await run('egg-bin', [], {
      env: { ARTUS_CLI_ENV: 'interceptor' },
    })
      .debug()
      .notExpect('stdout', /Update available/)
      .end();
  });

  it('should change upgade info display position without error', async () => {
    // should after
    const { stdout } = await run('egg-bin', '-h')
      // .debug()
      .expect('stdout', /Update available/)
      .end();

    const stdoutList = stdout.split(/\r?\n/);
    const updateAvailableIndex = stdoutList.findIndex(s => s.includes('Update available'));
    const usageIndex = stdoutList.findIndex(s => s.includes('Usage: egg-bin'));
    assert(updateAvailableIndex > usageIndex);

    // should before
    const { stdout: stdout2 } = await run('egg-bin', '-h', {
      env: { ARTUS_CLI_ENV: 'position' },
    })
      // .debug()
      .expect('stdout', /Update available/)
      .end();

    const stdoutList2 = stdout2.split(/\r?\n/);
    const updateAvailableIndex2 = stdoutList2.findIndex(s => s.includes('Update available'));
    const usageIndex2 = stdoutList2.findIndex(s => s.includes('Usage: egg-bin'));
    assert(updateAvailableIndex2 < usageIndex2);
  });

  it('should check update manually', async () => {
    const { stdout } = await run('egg-bin', 'checkupdate')
      // .debug()
      .expect('stdout', /Update available/)
      .end();

    const list = stdout.split(/\r?\n/).filter(s => s.includes('Update available'));
    assert(list.length === 1);

    // disttag
    await run('egg-bin', [ 'checkupdate', 'patch' ])
      // .debug()
      .expect('stdout', /Update available 1.0.0 → 1.0.\d+/)
      .end();

    // unknown disttag
    await run('egg-bin', [ 'checkupdate', 'asd' ])
      // .debug()
      .expect('stdout', /Unknown dist-tag: asd, please check and try again/)
      .end();

    // disable command
    await run('egg-bin', 'checkupdate', {
      env: { ARTUS_CLI_ENV: 'command' },
    })
      // .debug()
      .expect('stderr', /Command is not found: 'egg-bin checkupdate'/)
      .end();
  });

  it('should customize upgrade info', async () => {
    await run('egg-bin', 'checkupdate', {
      env: { ARTUS_CLI_ENV: 'hook', CONTENTS: 'true' },
    })
      .debug()
      .expect('stdout', /Update available/)
      .expect('stdout', /Changelog: http\:\/\/666/)
      .end();

    // return str
    await run('egg-bin', 'checkupdate', {
      env: { ARTUS_CLI_ENV: 'hook', CONTENTS_STR: 'true' },
    })
      // .debug()
      .expect('stdout', /│                    12345                     │/)
      .expect('stdout', /│                  上山打老虎                  │/)
      .end();

    // return full contents
    await run('egg-bin', 'checkupdate', {
      env: { ARTUS_CLI_ENV: 'hook', FULL_CONTENTS: 'true' },
    })
      // .debug()
      .expect('stdout', /Update available/)
      .expect('stdout', /666/)
      .end();

    // return full contents with str
    await run('egg-bin', 'checkupdate', {
      env: { ARTUS_CLI_ENV: 'hook', FULL_CONTENTS_STR: 'true' },
    })
      // .debug()
      .notExpect('stdout', /Update available/)
      .expect('stdout', /12345/)
      .expect('stdout', /老铁双击 666/)
      .end();
  });
});
