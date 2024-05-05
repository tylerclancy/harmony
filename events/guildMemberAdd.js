export default async function (client, member) {
  try {
    console.log(`Member joined: ${member.user.tag}`);
  } catch (error) {
    console.error('Error processing guildMemberAdd event:', error);
  }
}
