//------------------------------------------------------------------

const io = require('socket.io')();

const port = 3002;

//------------------------------------------------------------------

class SocketIO {

    static start() {
        io.on('connection', SocketIO.onConnection);
        io.listen(port);
        console.log("socket.io listening on port: " + port);
    }

    static onConnection(client) {
        client.on('subscribeToPatient', (patientId) => {
            console.log('client is subscribing to patient id: ', patientId);
            client.join(patientId);
        });
        client.on('disconnect', () => console.log("client disconnected!"));
    }

    static notify(patientId, messageName, messageData) {
        io.to(patientId).emit(messageName,messageData);
    }

}

//------------------------------------------------------------------

module.exports = SocketIO;

//------------------------------------------------------------------