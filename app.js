//////////////////////////////////////////////////////////////////////////////////

// 				ESTE ES EL APP.JS QUE DEBE PONERSE EN EL SERVIDOR				//

//////////////////////////////////////////////////////////////////////////////////

require('dotenv').config()
const { express } = require("./App/config");
const { serve } = require("./server");
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');

let app = new express();

app.use(cors());

serve(app);

const useHttp = process.env.USE_HTTP === '1' || process.env.USE_HTTP === 'true';

const onListen = () => {
    try {
        console.log(`El Back-End de TuCarrera.site está corriendo en el puerto: ${app.get('port')}`);
    } catch (error) {
        console.log(`App error: ${error}`);
    }
};

if (useHttp) {
    http.createServer(app).listen(app.get('port'), onListen);
} else {
    //const sslFolder = '/etc/letsencrypt/live/tucarrera.co/'
    //const privateKey = fs.readFileSync(`${sslFolder}privkey.pem`);
    //const certificate = fs.readFileSync(`${sslFolder}fullchain.pem`);
    //https.createServer({ key: privateKey, cert: certificate }, app).listen(app.get('port'), onListen);
    http.createServer(app).listen(app.get('port'), onListen);
}
