import supabase from '../utils/supabase.js';

export default async function (client, member) {
  try {
    console.log(`Member joined: ${member.user.tag}`);

    const { data: autoroles, error: selectError } = await supabase
      .from('autoroles')
      .select('role_id')
      .eq('guild_id', member.guild.id);

    if (selectError) {
      console.error('Error retrieving autoroles:', selectError);
      return;
    }

    if (autoroles.length === 0) {
      console.log('No autoroles set for this guild.');
      return;
    }

    const roleIds = autoroles.map((autorole) => autorole.role_id);

    const roles = roleIds.map((roleId) => member.guild.roles.cache.get(roleId));

    const validRoles = roles.filter((role) => role !== undefined);

    if (validRoles.length === 0) {
      console.log('No valid autoroles found for this guild.');
      return;
    }

    try {
      await member.roles.add(validRoles);
      console.log(
        `Autoroles ${validRoles
          .map((role) => `<@&${role.id}>`)
          .join(', ')} added to ${member.user.tag}.`
      );
    } catch (error) {
      console.error('Error adding autoroles to member:', error);
    }
  } catch (error) {
    console.error('Error processing guildMemberAdd event:', error);
  }
}
