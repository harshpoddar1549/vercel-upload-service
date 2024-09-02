import { Request, Response } from "express"
import { sessionGenerator } from "../utils/sessionGenerator"
import simpleGit from 'simple-git'
import { FileHandler} from "../utils/fileHandler"
import { createClient } from "redis"

/* Connecting to the Redis server */
const producer = createClient()
producer.on('error', (err) => console.log('Redis Client Error: ', err))
producer.connect().then(()=> console.log(`[INFO] Redis Server connected successfully. `)).catch((err)=> console.log(err))

export const DeployController = {
    uploadRepoUrl: async (req: Request, res:Response) => {
        const session = sessionGenerator()
        const url = req.body.repoUrl
        const env = req.body.env
        console.log("env:", env)
        try{
            /* Cloning the git repo */
            await simpleGit().clone(url, `./repos/${session}`)

            /* Reading all the files from the clones repo */
            const pathToClonedRepo = FileHandler.getRepoDirPathForLocalUpload(session)
            /* If env.length != 0 add the .env file in it */
            FileHandler.addEnvFile(env, pathToClonedRepo)
            /*  */
            const allFilesUploadedArr = FileHandler.getAllFiles(pathToClonedRepo)

            /* Uploading Files to R2 Bucket */
            FileHandler.uploadFilesfromLocalToR2(allFilesUploadedArr).then(async (status) => {
                /* Inserting the session id into the queue or the redis list */

                console.log("status:::", status)
                
                /* b. push the value from the end */
                producer.lPush("build-queue", session)
            
            }).catch((err) => console.log(err))

            
            /* Sending a json response */
            res.status(200).json({
                sessionId: session,
                repoUrl: url,
                allFilesUploaded: true
            })
        }catch(err){
            console.log(err)
        }
        
    }
}