import path from 'path'
import fs from 'fs'
import { CloudFlare } from './cloudflare'


export const FileHandler = {
    getAllFiles : (dirPath:string):string[] => {
        let results:string[] = []
        fs.readdirSync(dirPath).forEach((file) => {
            const completePathOfFile = path.join(dirPath, file)
            const stat = fs.statSync(path.join(dirPath, file))
            if(stat && stat.isDirectory()){
                results = results.concat(FileHandler.getAllFiles(completePathOfFile))
            }else{
                results.push(completePathOfFile)
            }
        })
        return results
    },
    getRepoDirPathForLocalUpload : (sessionId: string):string => {
        const pathToRepo = path.join(__dirname.replace('/dist/utils',''),'repos', sessionId)
        return pathToRepo
    },
    uploadFilesfromLocalToR2 :  async (filePathArr: string[]) => {
        await filePathArr.forEach(async (file)=>{
            const filePath = FileHandler.getRepoDirPathForR2Upload(file)
            await CloudFlare.uploadFileToR2(filePath, file)
        })
    },
    getRepoDirPathForR2Upload: (localFilePath: string):string => {
        const pathOnR2 = localFilePath.match(/repos\/.*$/)
        return pathOnR2 ? pathOnR2[0] : ""
    }
}
/* 
export const getAllFiles = (dirPath:string):string[] => {
    let results:string[] = []
    fs.readdirSync(dirPath).forEach((file) => {
        const completePathOfFile = path.join(dirPath, file)
        const stat = fs.statSync(path.join(dirPath, file))
        if(stat && stat.isDirectory()){
            results = results.concat(getAllFiles(completePathOfFile))
        }else{
            results.push(completePathOfFile)
        }
    })
    return results
}

export const getRepoDirPath = (sessionId: string):string => {
    const pathToRepo = path.join(__dirname.replace('/dist/utils',''),'repos', sessionId)
    return pathToRepo
}
 */