import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create and send an embed to a specified channel.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the embed to.')
        .setRequired(true)
    ),
  requiredPermissions: ['ManageMessages'],

  async execute(interaction) {
    if (!interaction.member.permissions.has(this.requiredPermissions)) {
      return interaction.reply({
        content: `You do not have the ${this.requiredPermissions} permission.`,
        ephemeral: true,
      });
      return;
    }

    const channelId = interaction.options.getChannel('channel').id;

    const modal = new ModalBuilder()
      .setCustomId(`embedModal-${channelId}`)
      .setTitle('Create Embed (JSON Input)');

    const jsonInput = new TextInputBuilder()
      .setCustomId('jsonInput')
      .setLabel('Embed JSON')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter the embed JSON here')
      .setRequired(true);

    const jsonRow = new ActionRowBuilder().addComponents(jsonInput);

    modal.addComponents(jsonRow);

    await interaction.showModal(modal);
  },
};

/*
Discord limits the modal builder to 5 components, so the below method is not possible.
*/

// import {
//   ActionRowBuilder,
//   ModalBuilder,
//   TextInputBuilder,
//   TextInputStyle,
// } from 'discord.js';

// export default {
//   name: 'embed',
//   description: 'Create and send an embed to a specified channel.',
//   options: [
//     {
//       name: 'channel',
//       description: 'The channel to send the embed to.',
//       type: 7, // Channel type
//       required: true,
//     },
//   ],
//   async execute(interaction) {
//     const channelId = interaction.options.getChannel('channel').id;

//     const modal = new ModalBuilder()
//       .setCustomId(`embedModal-${channelId}`)
//       .setTitle('Create Embed');

//     const titleInput = new TextInputBuilder()
//       .setCustomId('titleInput')
//       .setLabel('Title')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(256)
//       .setRequired(true);

//     const colorInput = new TextInputBuilder()
//       .setCustomId('colorInput')
//       .setLabel('Color (Hex Code)')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(7)
//       .setRequired(false);

//     const descriptionInput = new TextInputBuilder()
//       .setCustomId('descriptionInput')
//       .setLabel('Description')
//       .setStyle(TextInputStyle.Paragraph)
//       .setMaxLength(4000)
//       .setRequired(false);

//     const authorInput = new TextInputBuilder()
//       .setCustomId('authorInput')
//       .setLabel('Author')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(256)
//       .setRequired(false);

//     const authorUrlInput = new TextInputBuilder()
//       .setCustomId('authorUrlInput')
//       .setLabel('Author URL')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const authorIconInput = new TextInputBuilder()
//       .setCustomId('authorIconInput')
//       .setLabel('Author Icon URL')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const footerInput = new TextInputBuilder()
//       .setCustomId('footerInput')
//       .setLabel('Footer')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const thumbnailInput = new TextInputBuilder()
//       .setCustomId('thumbnailInput')
//       .setLabel('Thumbnail URL')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const imageInput = new TextInputBuilder()
//       .setCustomId('imageInput')
//       .setLabel('Image URL')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const urlInput = new TextInputBuilder()
//       .setCustomId('urlInput')
//       .setLabel('URL')
//       .setStyle(TextInputStyle.Short)
//       .setMaxLength(2048)
//       .setRequired(false);

//     const titleRow = new ActionRowBuilder().addComponents(titleInput);
//     const descriptionRow = new ActionRowBuilder().addComponents(
//       descriptionInput
//     );
//     const authorRow = new ActionRowBuilder().addComponents(
//       authorInput,
//       authorUrlInput,
//       authorIconInput
//     );
//     const thumbnailRow = new ActionRowBuilder().addComponents(
//       thumbnailInput,
//       imageInput,
//       urlInput
//     );
//     const colorFooterRow = new ActionRowBuilder().addComponents(
//       colorInput,
//       footerInput
//     );

//     modal.addComponents(
//       titleRow,
//       descriptionRow,
//       authorRow,
//       thumbnailRow,
//       colorFooterRow
//     );

//     await interaction.showModal(modal);
//   },
// };
