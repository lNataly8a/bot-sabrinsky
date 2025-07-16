require('dotenv').config(); // Habilita el uso de .env
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, InteractionType } = require('discord.js');
const { registerSlashCommands } = require('./slashCommands');
const { keepAlive } = require('./keep_alive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();

// Cargar comandos clásicos (!play, !ping, etc.)
const comandosPath = path.join(__dirname, 'comandos');
const archivosComando = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));

for (const archivo of archivosComando) {
  const comando = require(`./comandos/${archivo}`);
  client.commands.set(comando.name, comando);
}

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const nombreComando = args.shift().toLowerCase();

  const comando = client.commands.get(nombreComando);
  if (!comando) return;

  try {
    await comando.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Error al ejecutar el comando.');
  }
});

// Slash command: /active-dev-badge
client.on('interactionCreate', async interaction => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;

  if (interaction.commandName === 'active-dev-badge') {
    await interaction.reply({
      content: '✅ Actividad de desarrollador registrada.',
      ephemeral: true
    });
  }
});

client.once('ready', async () => {
  console.log(`✅ Bot encendido como ${client.user.tag}`);
  await registerSlashCommands(); // Registrar comandos slash
});

client.login(process.env.TOKEN);
//captura errores no manejados
process.on('unhandledRejection', (reason) => {
  console.error('🔴 Error no capturado:', reason);
});
//Mantiene Replit activo
keepAlive();
