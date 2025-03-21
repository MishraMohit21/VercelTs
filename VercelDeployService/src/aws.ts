import { S3 } from "aws-sdk"
import { dir } from 'console'
import fs from "fs";
import path, { resolve } from "path";

import { accessKeyId, secretAccessKey, endpoint } from "./sec/keys"


const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint: endpoint,
    s3ForcePathStyle: true, 
    region: "auto",
    signatureVersion: "v4"
})

export async function downlaodFromS3_R2(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercelclone",
        Prefix: prefix

    }).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercelclone",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}


const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localPath: string) => {
    try {
        const fileContent = fs.readFileSync(localPath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: "vercelclone",
            Key: fileName,
        }).promise();

        return response.Location;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};


export function copyFinalDist(id: string) {

    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })

}