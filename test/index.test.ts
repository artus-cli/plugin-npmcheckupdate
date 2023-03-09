import { run } from './test-utils';

describe('test/index.test.ts', () => {
  it('should show example', async () => {
    await run('my-bin', 'example')
      // .debug()
      .expect('stdout', /show example/)
      .end();
  });
});
