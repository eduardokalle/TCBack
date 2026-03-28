//////////////////////////////////////////////////////////////////////////////////

// 				ESTE ES EL APP.JS QUE DEBE PONERSE EN EL SERVIDOR				//

//////////////////////////////////////////////////////////////////////////////////

require('dotenv').config()
const { express } = require("./App/config");
const { serve } = require("./server");
const https = require('https'); // https
const fs = require('fs'); // https
const cors = require('cors');

let app = new express();

app.use(cors());

const sslFolder = '/etc/letsencrypt/live/tucarrera.co/'

//const privateKey = fs.readFileSync( '/etc/ssl/private/tucarrera_co.key' ); // https
//const certificate = fs.readFileSync( '/etc/ssl/certs/tucarrera_co.crt' ); // https
//const caChain = fs.readFileSync( '/etc/apache2/ssl.crt/tucarrera_co.ca-bundle' ); // https

const privateKey = fs.readFileSync(`${sslFolder}privkey.pem`);
const certificate = fs.readFileSync(`${sslFolder}fullchain.pem`);

serve(app);

https.createServer({	 // https
    key: privateKey,	 // https
    cert: certificate,	 // https
}, app).listen(app.get('port'), () => {
    try {
        console.log(`El Back-End de TuCarrera.site está corriendo en el puerto: ${app.get('port')}`);
    } catch (error) {
        console.log(`App error: ${error}`);
    }
});
