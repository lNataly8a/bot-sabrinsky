const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot está encendido');
});

function keepAlive() {
  app.listen(3000, () => {
    console.log('🟢 Servidor web activo para mantener Replit vivo');
  });
}

module.exports = { keepAlive };


