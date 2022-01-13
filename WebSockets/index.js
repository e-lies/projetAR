const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 89 });

wss.on('connection', function(ws){
    console.log("Un user s'est connecté ! ")
    ws.on('message',function(data){
        console.log("message d'un client: ",data.toString() )
        wss.clients.forEach(function(client){
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        })
    })

    ws.on('close',()=>{
        console.log("User s'est déconnecté !")
    })
})