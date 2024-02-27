
import { S3 } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs'

export const CloudFlare = {
    uploadFileToR2: async (filePathToBeStoredOnR2: string, localFilePath: string) => {
        const fileContent = fs.readFileSync(localFilePath)
        const s3 = new S3({
            endpoint: process.env.CLOUDFLARE_ENDPOINT,
            credentials: fromEnv(),
            region: process.env.BUCKET_REGION
        })
        try{
            const parallelUpload = new Upload({
                client: s3,
                params: {
                    Body: fileContent,
                    Bucket: process.env.BUCKET_NAME,
                    Key: filePathToBeStoredOnR2
                }
            })
    
            parallelUpload.on('httpUploadProgress', (progress) => {
                console.log(progress)
            })
    
            const status = await parallelUpload.done()

            //console.log(status)
        }catch(err){
            console.log(err)
        }
    }
}