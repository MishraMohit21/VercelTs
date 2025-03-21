import { S3 } from "aws-sdk";
import fs from "fs";


const s3 = new S3({
    region: "auto",
    accessKeyId: "f7d11d732b42843f5309fbc97c715e83",
    secretAccessKey: "3bdb0e232fd4f700371e29d19b8da86e8bc2c4e24508ff0e4641ed5f06bd0612",
    endpoint: "https://f228a0208030c4d4197fae2f2fae593a.r2.cloudflarestorage.com",
})

export const uploadFile = async (fileName: string, localPath: string) => {
    try {
        console.log("Uploading file...");

        const fileContent = fs.readFileSync(localPath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: "vercelclone",
            Key: fileName,
        }).promise();

        console.log("File uploaded successfully:", response.Location);
        return response.Location;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
