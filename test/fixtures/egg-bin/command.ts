import { Command, DefineCommand } from '@artus-cli/artus-cli';

@DefineCommand()
export class Main extends Command {
  async run() {
    //
  }
}

@DefineCommand({
  command: 'dev',
})
export class Dev extends Command {
  async run() {
    //
  }
}
