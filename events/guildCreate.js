import supabase from '../utils/supabase.js';

export default async function (client, guild) {
  try {
    console.log(`Joined guild: ${guild.name}`);

    const { data: existingGuild, error: selectError } = await supabase
      .from('guilds')
      .select('id')
      .eq('id', guild.id)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking guild existence:', selectError);
      return;
    }

    if (!existingGuild) {
      const { data: insertedGuild, error: insertError } = await supabase
        .from('guilds')
        .insert([
          {
            id: guild.id,
            name: guild.name,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error inserting guild:', insertError);
      } else {
        console.log('Inserted guild:', guild.name);
      }
    } else {
      console.log('Guild already exists in the database');
    }
  } catch (error) {
    console.error('Error processing guildCreate event:', error);
  }
}
