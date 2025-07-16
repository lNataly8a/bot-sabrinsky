module.exports = {
  name: 'stop',
  description: 'Detiene la música',
  execute(message) {
    const connection = require('@discordjs/voice').getVoiceConnection(message.guild.id);
    if (connection) {
      connection.destroy();
      message.reply('🛑 Reproducción detenida.');
    } else {
      message.reply('❌ No estoy en un canal de voz.');
    }
  }
};