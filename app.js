import { createClient } from "redis";
import express from 'express';
import Mongo,{ MongoClient } from "mongodb";
let app = express();
const url = "mongodb://localhost:27017";
const mClient = new MongoClient(url);
const rClient = createClient({host: 'localhost', port:6379});

//connect redis
rClient.on('err', err=> console.log(err));

// connect mongo
async function main(){
    await mClient.connect();
}



app.get('/data', async(req,res)=>{
    await rClient.connect()
    let uInput = req.query.color.trim();
    let result = await clientInformation.get(uInput);
    if(result){
        const output = JSON.parse(result);
        res.send(output);
    }else{
        // if not in redis, from mongo
        const output = [];
        let query = {Color:uInput} 
        const data = 
    }
})