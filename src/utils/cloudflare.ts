
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


/* 
export const uploadFileToR2 = async (filePathToBeStoredOnR2: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath)
    const s3 = new S3({
        endpoint: "https://23a625beb1804b877dae152ca9df5253.r2.cloudflarestorage.com",
        credentials: fromEnv(),
        region: 'apac'
    })
    try{
        const parallelUpload = new Upload({
            client: s3,
            params: {
                Body: fileContent,
                Bucket: 'vercel',
                Key: filePathToBeStoredOnR2
            }
        })

        parallelUpload.on('httpUploadProgress', (progress) => {
            console.log(progress)
        })

        await parallelUpload.done()
    }catch(err){
        console.log(err)
    }
} */

/* 
export async function main() {
  // Call fromEnv to get credentials from environment variables
  const credentialsProvider = await fromEnv();
  // Call the credentials provider function to get the credentials
  const credentials = await credentialsProvider();

  // Log the credentials (Note: In a real application, you wouldn't log credentials)
  console.log(credentials);

  // Use the credentials in the S3 client
  const s3 = new S3({
    endpoint: "https://23a625beb1804b877dae152ca9df5253.r2.cloudflarestorage.com",
    credentials: fromEnv()
  });


  // Now you can use the S3 client for your operations
} */