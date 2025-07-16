const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Reproduce audio de YouTube',
  async execute(message, args) {
    const url = args[0];
    if (!url || !ytdl.validateURL(url)) {
      return message.reply('❌ Proporciona un enlace válido de YouTube.');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('🔇 Debes estar en un canal de voz.');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    });

    player.play(resource);
    connection.subscribe(player);

    message.reply('🎶 Reproduciendo...');

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      message.channel.send('✅ Canción terminada.');
    });
  }
};
