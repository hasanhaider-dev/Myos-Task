import { PagingModel } from "./paging-model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DbResponseModel {
    success: boolean;
    result?: any;
    error?: any;
    pagingModel? : PagingModel;
}
