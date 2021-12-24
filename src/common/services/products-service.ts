import "reflect-metadata";
import { StatusCodes } from "http-status-codes";
import { Service, Inject } from "typedi";

import { ResponseModel, ProductsModel } from "../models";
import { ProductsFilteringRequestModel } from "../models/product-filtering-request-model";
import { ProductsResponseModel } from "../models/products-response-model";

import { DatabaseService } from "./database-service";

@Service()
export class ProductsService {
  @Inject()
  private databaseService: DatabaseService;

  async getProductsList(): Promise<ResponseModel<ProductsResponseModel>> {
      const response: ResponseModel<ProductsResponseModel> = {
          hasError: false,
          message: "Success",
          statusCode: `${StatusCodes.OK}`,
          payload: { products: [] },
      };

      const result = await this.databaseService.getPagedItems(
          ProductsModel,
          {},
          { title: 1, description: 1, imageUrl: 1 }
      );

      if (result && result.success) {
          response.payload = {
              products: result.result,
          };
      } else {
          response.hasError = true;
          response.message = "No Records found, or there's something wrong with DB";
          response.statusCode = `${StatusCodes.INTERNAL_SERVER_ERROR}`;
      }
      return response;
  }

  async getFilteredProducts(
      payload: ProductsFilteringRequestModel
  ): Promise<ResponseModel<ProductsResponseModel>>{
      const response: ResponseModel<ProductsResponseModel> = {
          hasError: false,
          message: "Success",
          statusCode: `${StatusCodes.OK}`,
          payload: { products: [] },
      };
      const result = await this.databaseService.getPagedItems(ProductsModel, {title: payload.productTitle, description: payload.productDescription }, { title: 1, description: 1, imageUrl: 1 });

      if (result && result.success) {
          response.payload = {
              products: result.result,
          };
      } else {
          response.hasError = true;
          response.message = "No Records found, or there's something wrong with DB";
          response.statusCode = `${StatusCodes.INTERNAL_SERVER_ERROR}`;
      }
      return response;
  }
}
