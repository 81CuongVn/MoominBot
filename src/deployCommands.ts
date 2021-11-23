import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommandData } from "discord.js";
import readdirp from "readdirp";
import logger from "./logger.js";
import { __dirname } from "./utils/dirname.js";

export default async function DeployCommands() {
    const rest = new REST({
        version: "9"
    }).setToken(process.env.DISCORD_TOKEN!);

    try {
        logger.info("[/] Refreshing interaction commands...");
        const commands: ApplicationCommandData[] = [];
        const rawCommands = readdirp(`${__dirname(import.meta.url)}/interactions`, {
            fileFilter: ["*.js"]
        });

        for await (const interactionCommand of rawCommands) {
            const data = (await import(`file://${interactionCommand.fullPath}`).then((x) => x.default)) as ApplicationCommandData;
            commands.push(data);
        }

        await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!), {
            body: commands
        });
        logger.info("[/] Successfully refreshed interaction commands!");
    } catch (err) {
        logger.error(err);
        return;
    }
}