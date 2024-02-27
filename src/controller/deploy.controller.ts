import { Request, Response } from "express"
import { sessionGenerator } from "../utils/sessionGenerator"
import simpleGit from 'simple-git'
import { FileHandler} from "../utils/fileHandler"
import { createClient } from "redis"

export const DeployController = {
    uploadRepoUrl: async (req: Request, res:Response) => {
        const session = sessionGenerator()
        const url = req.body.repoUrl
        try{
            /* Cloning the git repo */
            await simpleGit().clone(url, `./repos/${session}`)

            /* Reading all the files from the clones repo */
            const pathToClonedRepo = FileHandler.getRepoDirPathForLocalUpload(session)
            const allFilesUploadedArr = FileHandler.getAllFiles(pathToClonedRepo)

            /* Uploading Files to R2 Bucket */
            await FileHandler.uploadFilesfromLocalToR2(allFilesUploadedArr)

            /* Inserting the session id into the queue or the redis list */
            
            /* a. create the client and connect to redis */
            const producer = await createClient()
            producer.on('error', (err) => console.log('Redis Client Error: ', err))
            await producer.connect()

            /* b. push the value from the end */
            producer.lPush("build-queue", session)
            
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