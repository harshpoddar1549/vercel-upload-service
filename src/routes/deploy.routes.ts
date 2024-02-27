import { Router } from "express";
import { DeployController } from "../controller/deploy.controller";

export const deployRouter = Router()

deployRouter.post('/', DeployController.uploadRepoUrl)
