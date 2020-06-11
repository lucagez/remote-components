const { Command } = require('@oclif/command');

class CreateCommand extends Command {
  static args = [
    {
      name: 'name',
      required: true,
      description: 'remote component name',
    },
  ];

  async run() {
    const { args } = this.parse(CreateCommand);
    const { name } = args;

    this.log(
      `hello ${name} from /root/cli/tmp/examples/example-multi-js/src/commands/goodbye.js`,
    );
  }
}

CreateCommand.description = `Describe the command here
...
Extra documentation goes here
`;

module.exports = CreateCommand;
