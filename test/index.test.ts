import { run } from './test-utils';
import rimraf from 'rimraf';
import path from 'path';

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

  it('should not check update when cache is expired', async () => {
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

    await new Promise(resolve => setTimeout(resolve, 5000));

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
});
