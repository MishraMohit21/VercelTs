import { createClient, commandOptions } from "redis";
const subscriber  = createClient();
subscriber.connect();


import { downlaodFromS3_R2, copyFinalDist } from "./aws";
import { buildProject } from "./buildSetup";


async function main() {
    // console.log(__dirname);
    while(1) {

        const response = await subscriber.brPop(
            commandOptions({isolated: true}), 
            'build-queue',
            0
        );
        console.log(response);
        const id = response?.element;


        if (id) {

            await downlaodFromS3_R2(`output/${id}`);
            console.log("Downloaded");
            await buildProject(id || "");
            console.log("Build Complete");
            await copyFinalDist(id || "");
            
        }
    }
    
}



main();