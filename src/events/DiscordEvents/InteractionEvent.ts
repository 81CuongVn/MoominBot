import { Collection, Interaction } from "discord.js";
import BaseEvent from "../../base/BaseEvent.js";
import BaseCommand from "../../base/BaseCommand.js";
import logger from "../../logger.js";
import { injectable, inject } from "tsyringe";
import { kCommands } from "../../constants.js";

@injectable()
export default class extends BaseEvent {
    constructor(@inject(kCommands) public readonly commands: Collection<string, BaseCommand>) {
        super("interactionCreate");
    }

    async execute(interaction: Interaction) {
        if (interaction.isCommand()) {
            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                const error = err as Error;
                logger.error(`[${interaction.commandName}] Command execution error:\n${error.stack || error}`);
            }
        }
    }
}