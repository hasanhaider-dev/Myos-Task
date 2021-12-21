import "reflect-metadata";
import Boom from '@hapi/boom';
import { StatusCodes } from 'http-status-codes';
import { Service, Inject } from "typedi";

import { DatabaseService } from "../../common/services/database-service";
import { ResponseModel, RequestModel, UserModel } from "../models";

@Service()
export class DefaultService {
    @Inject()
    private databaseService: DatabaseService;
}
