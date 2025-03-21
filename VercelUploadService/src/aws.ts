import { S3 } from "aws-sdk";
import fs from "fs";
import { accessKeyId, secretAccessKey, endpoint } from "./sec/keys"


const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint: endpoint
})

export const uploadFile = async (fileName: string, localPath: string) => {
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
