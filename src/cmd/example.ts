import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'example',
  description: 'This is a example command',
})
export class ExampleCommand extends Command {
  async run() {
    console.info('show example');
  }
}
