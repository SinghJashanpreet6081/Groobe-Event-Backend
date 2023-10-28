const express = require('express');
const app = express();
var cors = require('cors')

app.use(cors())
//local hosting at 8000
const port = process.env.PORT || 8000;
//get understand if json data comes
app.use(express.json());

require("./src/dbConn/conn");

 const router = require("./src/routers/dataRouters");
 app.use(router);

app.listen(port, () => {
    console.log(`App is running at ${port}`);
})