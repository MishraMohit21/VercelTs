import { createClient, commandOptions } from "redis";
const subscriber  = createClient();
subscriber.connect();


import { downlaodFromS3_R2 } from "./aws";


async function main() {

    while(1) {

        const response = await subscriber.brPop(
            commandOptions({isolated: true}), 
            'build-queue',
            0
        );
        // console.log(response);
        const id = response?.element;

        await downlaodFromS3_R2(`/output/${id}`);
        
    }
    
}



main();