//////////////////////////////////////////////////////////////////////////////////

// 				ESTE ES EL APP.JS QUE DEBE PONERSE EN EL LOCAL					//

//////////////////////////////////////////////////////////////////////////////////
require('dotenv').config()
const { express } = require("./App/config");
const { serve } = require("./server");
const cors = require('cors');

let app = new express();

app.use(cors());

serve(app);

app.listen(app.get('port'), () => {
    try {
        console.log(`El Back-End de TuCarrera.site está corriendo en el puerto: ${app.get('port')}`);
    } catch (error) {
        console.log(`App error: ${error}`);
    }
});