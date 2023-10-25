const mongoose = require('mongoose');
require('dotenv').config();
//const uri = process.env.MONGO_URI;
// const uri =`mongodb://127.0.0.1:27017/GroobeEventApis`;
const uri =process.env.uri;
//`mongodb+srv://2018919:9198102@cluster0.ahc3t9m.mongodb.net/Groobe-Landing-Page?retryWrites=true&w=majority`;

//To avoid depriciation error
mongoose.set('strictQuery', false);
mongoose.connect(uri, {
    useUnifiedTopology: true
}).then(() => {
    //console.log(uri);
    console.log("Database Connection Established!");
}).catch((err) => {
    console.log(`No DataBase Connection! ${err}`);
});
