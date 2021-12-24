import "reflect-metadata";
import { celebrate } from "celebrate";
import { Response, Request } from "express";
import { JsonController, Req, Res, Get, Post, UseBefore, Params } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Inject } from "typedi";

import { ResponseModel } from '../models';
import { ProductsFilteringRequestModel } from "../models/product-filtering-request-model";
import { ProductsResponseModel } from "../models/products-response-model";
import validationSchema from '../models/validation-model';
import { ProductsService } from "../services";

@JsonController("/Products")
export class DefaultController {
    @Inject()
    private productsService: ProductsService;

    @Post("/get")
    @UseBefore(celebrate(validationSchema))
    @OpenAPI({
        description:
        "Controller to All products list.",
        responses: {
            "400": {
                description: "Bad request",
            },
            "200": {
                description: "Success Response",
            },
        },
    })
    public async getProducts(
      @Req() req: Request,
      @Res() res: Response
    ): Promise<Response<ResponseModel<ProductsResponseModel>>> {
        const result = await this.productsService.getProductsList();
        return res.send(result);
    }

  @Get("/filtered")
  @UseBefore(celebrate(validationSchema))
  @OpenAPI({
      description:
      "Controller to get filtered products.",
      responses: {
          "400": {
              description: "Bad request",
          },
          "200": {
              description: "Success Response",
          },
      },
      parameters: [
          {
              in: "path",
              name: "productTitle",
              required: false,
              schema: {
                  type: "string",
              },
          }, {
              in: "path",
              name: "productDescription",
              required: false,
              schema: {
                  type: "string",
              },
          },

      ],

  })
    public async filtered(
    @Res() res: Response,
    @Params() params: ProductsFilteringRequestModel
    ): Promise<Response<ResponseModel<ProductsResponseModel>>> {
        const result = await this.productsService.getFilteredProducts(params);
        return res.send(result);
    }
}
