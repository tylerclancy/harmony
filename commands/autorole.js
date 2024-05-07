import supabase from '../utils/supabase.js';
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Manage autoroles for the server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a role to the autorole list.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to add as an autorole.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from the autorole list.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to remove from autoroles.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List the current autoroles.')
    ),
  requiredPermissions: ['ManageRoles'],

  async execute(interaction) {
    if (!interaction.member.permissions.has(this.requiredPermissions)) {
      return interaction.reply({
        content: `You do not have the ${this.requiredPermissions} permission.`,
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'add':
        try {
          const role = interaction.options.getRole('role');

          const { data: existingAutorole, error: selectError } = await supabase
            .from('autoroles')
            .select('role_id')
            .eq('guild_id', interaction.guildId)
            .eq('role_id', role.id)
            .single();

          if (existingAutorole) {
            return interaction.reply({
              content: `The role <@&${role.id}> is already an autorole.`,
              ephemeral: true,
            });
          }

          const { data: insertData, error: insertError } = await supabase
            .from('autoroles')
            .insert({
              guild_id: interaction.guildId,
              role_id: role.id,
              created_at: new Date().toISOString(),
            })
            .select();

          if (insertError) {
            console.error('Error adding autorole:', insertError);
            return interaction.reply({
              content: 'An error occurred while adding the autorole.',
              ephemeral: true,
            });
          }

          await interaction.reply({
            content: `The role <@&${role.id}> has been added as an autorole.`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error processing add subcommand:', error);
          await interaction.reply({
            content: 'An error occurred while processing the command.',
            ephemeral: true,
          });
        }
        break;

      case 'remove':
        try {
          const role = interaction.options.getRole('role');

          const { data: existingAutorole, error: selectError } = await supabase
            .from('autoroles')
            .select('role_id')
            .eq('guild_id', interaction.guildId)
            .eq('role_id', role.id)
            .single();

          if (!existingAutorole) {
            return interaction.reply({
              content: `The role <@&${role.id}> is not an autorole.`,
              ephemeral: true,
            });
          }

          const { data: deleteData, error: deleteError } = await supabase
            .from('autoroles')
            .delete()
            .eq('guild_id', interaction.guildId)
            .eq('role_id', role.id);

          if (deleteError) {
            console.error('Error removing autorole:', deleteError);
            return interaction.reply({
              content: 'An error occurred while removing the autorole.',
              ephemeral: true,
            });
          }

          await interaction.reply({
            content: `The role <@&${role.id}> has been removed from autoroles.`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error processing remove subcommand:', error);
          await interaction.reply({
            content: 'An error occurred while processing the command.',
            ephemeral: true,
          });
        }
        break;

      case 'list':
        try {
          const { data: autoroles, error: selectError } = await supabase
            .from('autoroles')
            .select('role_id')
            .eq('guild_id', interaction.guildId);

          if (selectError) {
            console.error('Error retrieving autoroles:', selectError);
            return interaction.reply({
              content: 'An error occurred while retrieving the autoroles.',
              ephemeral: true,
            });
          }

          if (autoroles.length === 0) {
            return interaction.reply({
              content: 'No autoroles are currently set.',
              ephemeral: true,
            });
          }

          const autorolesList = autoroles
            .map((autorole) => `<@&${autorole.role_id}>`)
            .join(', ');

          await interaction.reply({
            content: `Current autoroles: ${autorolesList}`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error processing list subcommand:', error);
          await interaction.reply({
            content: 'An error occurred while processing the command.',
            ephemeral: true,
          });
        }
        break;

      default:
        await interaction.reply({
          content: 'Invalid subcommand.',
          ephemeral: true,
        });
    }
  },
};
