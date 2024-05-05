import { EmbedBuilder } from 'discord.js';

export default async function (client, interaction) {
  if (
    interaction.isModalSubmit() &&
    interaction.customId.startsWith('embedModal-')
  ) {
    try {
      const channelId = interaction.customId.split('-')[1];
      const channel = await client.channels.fetch(channelId);

      const jsonInput = interaction.fields.getTextInputValue('jsonInput');
      const embedData = JSON.parse(jsonInput);

      const embed = new EmbedBuilder(embedData);

      if (!channel) {
        await interaction.reply({
          content: 'Invalid channel ID.',
          ephemeral: true,
        });
        return;
      }

      if (!channel.permissionsFor(interaction.user).has('SendMessages')) {
        await interaction.reply({
          content:
            'You do not have permission to send messages in that channel.',
          ephemeral: true,
        });
        return;
      }

      await channel.send({ embeds: [embed] });
      await interaction.reply({
        content: 'Embed sent successfully!',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error processing embed:', error);
      await interaction.reply({
        content: 'An error occurred while processing the embed.',
        ephemeral: true,
      });
    }
  } else if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}
