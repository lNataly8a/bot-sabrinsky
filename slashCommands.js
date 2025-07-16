const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('active-dev-badge')
    .setDescription('Actividad de desarrollador')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerSlashCommands() {
  try {
    console.log('📦 Registrando comandos slash...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Comando /active-dev-badge registrado correctamente');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
}

module.exports = { registerSlashCommands };
