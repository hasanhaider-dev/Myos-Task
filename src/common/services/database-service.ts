import "reflect-metadata";
import mongoose, { Mongoose, Model } from "mongoose";
import { Service } from "typedi";

import config from "../../config";
import { logger } from "../../utils/logger";
import { DbResponseModel } from "../models";
import { PagingModel } from "../models/paging-model";

@Service()
export class DatabaseService {
    public async initializeAndConnectDB(): Promise<Mongoose> {
        const password = encodeURIComponent(config.database.password);
        const DB_URL = `mongodb://${config.database.username}:${password}@${config.database.host}:${config.database.port}/${config.database.name}?authSource=admin`;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // eslint-disable-next-line @typescript-eslint/camelcase
            auto_reconnect: true,
            autoIndex: false, // Don't build indexes
            poolSize: config.database.poolSize, // Maintain up to 10 socket connections
        };
        return mongoose.connect(DB_URL, options);
    }

    public async addItem(model: any, payload: unknown): Promise<DbResponseModel> {
        try {
            logger.info(
                "DATABASE_SERVICE.addItem: Adding new item in: " +
                model.collection.collectionName,
                payload
            );
            const savedItem = await new model(payload).save();
            if (savedItem) {
                const result: DbResponseModel = { result: savedItem, success: true }
                logger.info(
                    "DATABASE_SERVICE.addItem: Recieved saved item from: " +
                    model.collection.collectionName,
                    savedItem
                );
                return {
                    success: true,
                    result: result,
                };
            }
        } catch (error) {
            logger.error(
                "DATABASE_SERVICE.addItem: Error occured while adding item in: " +
                model.collection.collectionName,
                error
            );

            return {
                success: false,
                error: error,
            };
        }
    }


    public async getManyItems(
        model: Model<unknown>,
        query: unknown,
        projectPayload?: unknown
    ): Promise<DbResponseModel> {
        try {
            logger.info(
                "DATABASE_SERVICE.getManyItems: getting many items from: " +
                model.collection.collectionName,
                query
            );
            const result = projectPayload
                ? await model.find(query, projectPayload).lean()
                : await model.find(query).lean();
            if (result) {
                logger.info(
                    "DATABASE_SERVICE.getManyItems: Recieved query result from: " +
                    model.collection.collectionName,
                    result
                );
                return {
                    success: true,
                    result: result,
                };
            }
        } catch (error) {
            logger.error(
                "DATABASE_SERVICE.getSingleItem: Error occured while getting many items in: " +
                model.collection.collectionName,
                error
            );

            return {
                success: false,
                error: error,
            };
        }
    }

    public async addManyItems(
        model: Model<unknown>,
        payload: []
    ): Promise<DbResponseModel> {
        try {
            logger.info(
                "DATABASE_SERVICE.addManyItems: adding many items in: " +
                model.collection.collectionName,
                payload
            );

            const result = await model.insertMany(payload, { ordered: true });

            if (result) {
                logger.info(
                    "DATABASE_SERVICE.addManyItems: Added many items in " +
                    model.collection.collectionName,
                    result
                );
                return {
                    success: true,
                    result: result,
                };
            }
        } catch (error) {
            logger.error(
                "DATABASE_SERVICE.addManyItems: Error occured while adding many items in: " +
                model.collection.collectionName,
                error
            );

            return {
                success: false,
                error: error,
            };
        }
    }

	public async getPagedItems(
        model: any, query: any, projectPayload: any
    ): Promise<DbResponseModel> {
		try {
			logger.info(
				'DATABASE_SERVICE.getManyItems: getting filtered from: ' +
				model.collection.collectionName,
				query,
			);

			const limit = parseInt(query.limit || config.pager.defaultLimit);
			const page = parseInt(query.page || config.pager.defaultPage);
			const skip = limit * (page - 1);


			let sortingOption: any = {};
			if (query.sortBy) {
				sortingOption[query.sortBy] = query.sortOrder;
			}
			else {
				sortingOption = { [`${config.pager.defaultSortBy}`]: config.pager.defaultSortOrder };
			}

			delete query.limit;
			delete query.page;
			delete query.sortBy;
			delete query.sortOrder;

			const [total, result] = await Promise.all([
				model.countDocuments(query),
				model.find(query, projectPayload).skip(skip).limit(limit).sort(sortingOption).lean(),
			])

			if (result && result.length) {

				const pagingModel = new PagingModel();
				pagingModel.total = total;
				pagingModel.totalPages = Math.ceil(total / limit);
				pagingModel.pageNumber = page;
				pagingModel.pageSize = limit;
				pagingModel.sortBy = sortingOption;

				logger.info(
					'DATABASE_SERVICE.getFilteredItems: Recieved query result from: ' +
					model.collection.collectionName,
					result,
					pagingModel
				);
                return {
                    success: true,
                    result: {pagingModel, result},
                    
                };
			}

		} catch (error) {
			logger.error(
				'DATABASE_SERVICE.getFilteredItems: Error occured while getting filtered items in: ' +
				model.collection.collectionName,
				error,
			);
            return {
                success: false,
                error: error,
            };
		}
	}
}
