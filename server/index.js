// server/index.js
'use strict';

// Questo è il nostro server barebone, ridotto all'osso per iniziare

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Il server di Kioku e' in ascolto sulla porta: ${PORT}!`);
});