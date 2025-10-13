import { HttpRoute } from "@kimia-framework/core/interfaces";
import { AppMiddleware } from "../app/middlewares/middlewares";
import { AppAPI } from "../app/apis/apis";
export const ROUTES: HttpRoute<AppAPI, AppMiddleware>[] = [];
