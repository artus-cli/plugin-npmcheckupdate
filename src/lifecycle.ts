import { Program, Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, CommandContext, ArtusInjectEnum } from '@artus-cli/artus-cli';
import DefaultConfig from './config/config.default';
import { Updater } from './updater';
import { CheckUpdateCommand } from './command';

@LifecycleHookUnit()
export default class NpmCheckUpdateLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @Inject(ArtusInjectEnum.Config)
  config: typeof DefaultConfig;

  @Inject()
  updater: Updater;

  @LifecycleHook()
  async configDidLoad() {
    const { npmcheckupdate } = this.config;
    if (!npmcheckupdate.enableInterceptor) {
      return;
    }

    // enable CheckUpdateCommand dynamically
    if (npmcheckupdate.enableCommand) {
      this.program.enableCommand(CheckUpdateCommand);
    }

    const displayUpgradeInfo = async (ctx: CommandContext) => {
      let enableInterceptor = false;
      if (typeof npmcheckupdate.enableInterceptor === 'function') {
        enableInterceptor = ctx.matched ? npmcheckupdate.enableInterceptor(ctx.matched.clz) : false;
      } else {
        enableInterceptor = !!npmcheckupdate.enableInterceptor;
      }

      if (!enableInterceptor) {
        return;
      }

      const upgradeInfo = await this.updater.checkUpdate();
      if (upgradeInfo?.needUpdate) {
        this.updater.displayUpgradeInfo(upgradeInfo);
      }
    };

    this.program.use(async (ctx: CommandContext, next) => {
      if (npmcheckupdate.upgradeInfoPrintPosition === 'before') {
        await displayUpgradeInfo(ctx);
      }

      await next();

      if (npmcheckupdate.upgradeInfoPrintPosition === 'after') {
        await displayUpgradeInfo(ctx);
      }
    });
  }
}
