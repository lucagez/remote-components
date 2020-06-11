const { Command, flags } = require('@oclif/command');
const fs = require('fs-extra');
const path = require('path');
const child = require('child_process');

class CreateCommand extends Command {
  static args = [
    {
      name: 'dir',
      required: false,
      default: '.',
      description: 'path to bootstrap remote-components project',
    },
  ];
  async run() {
    const { args, flags } = this.parse(CreateCommand);

    const pkgManager = flags['pkg-manager'] || 'yarn';

    this.log(`Bootrapping ${path.resolve(args.dir)}`);

    const TEMPLATE_PATH = path.resolve(__dirname, '../../template');
    const DEST_PATH = path.resolve(args.dir);

    fs.copySync(TEMPLATE_PATH, DEST_PATH);

    child.execSync(`cd ${DEST_PATH} && ${pkgManager} install`, {
      stdio: 'inherit',
    });

    this.log('Bootstrapped succesfully 🌈');
  }
}

CreateCommand.description = 'Bootstrap remote-components project';

CreateCommand.flags = {
  'pkg-manager': flags.string({char: 'p', description: 'Choose between yarn and npm as package manager'}),
}

module.exports = CreateCommand;
