import { Program, Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit } from '@artus-cli/artus-cli';

@LifecycleHookUnit()
export default class TemplateLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @LifecycleHook()
  async configDidLoad() {
    console.info('bin', this.program.binName);
  }
}
