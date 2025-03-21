import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { createClient } from "redis";


import { generateID } from "./functions";
import { getAllFiles } from "./files";
import { uploadFile } from "./aws"


const publisher = createClient();
publisher.connect();


const app = express();
app.use(cors());    
app.use(express.json());




app.post("/deploy", async (req, res) => {
    

    const repoUrl  = req.body.repoUrl;
    const id = generateID();  // Generate a random ID for the user project;

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`)); // Store the project in the output folder with the ID as the folder name;

    const files = getAllFiles(path.join(__dirname, `output/${id}`)); // Get the list of all the files in the fetched project now the reason for this is as there is no straight way to transfer the folder/directory onto the S3 server of aws

    // Ok Now lets just upload all the files to the aws bucket
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
    
    // now the last step that is to send this to a redis queue
    if (id) publisher.lPush("build-queue", id);
    else console.log("No Id Generated");


    
    res.json({
        id: id
    })

});


app.listen(3000);
