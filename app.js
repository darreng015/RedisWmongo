import createClient from "redis";
import express from 'express';
import { MongoClient } from "mongodb";
let app = express();
const port = process.env.PORT ||8100
const url = "mongodb://localhost:27017";
const mClient = new MongoClient(url);
const rClient = createClient({host: 'localhost', port:6379});

//connect redis
rClient.on('err', err=> console.log(err));

// connect mongo
async function main(){
    await mClient.connect();
}

const collection = mClient.db('node').collection('products')

app.get('/data', async(req,res)=>{
    await rClient.connect()
    let uInput = req.query.color.trim();
    let result = await rClient.get(uInput);
    if(result){
        const output = JSON.parse(result);
        res.send(output);
    }else{
        // if not in redis, from mongo
        const output = [];
        let query = {Color:uInput} 
        const cursor = collection.find({Color:uInput});
        for await(const data of cursor){
            output.push(data);
        }
        await ClientSession.set(uInput, JSON.stringify({source:"Redis cache", output}),{EX:12, NX:true}); 
        cursor.closed;
        res.send({source:"MongoDB", output});
    }
    await rClient.disconnect();
})

app.listen(port,(err)=>{
    main();
    console.log(`Server is running on port ${port}`);
})