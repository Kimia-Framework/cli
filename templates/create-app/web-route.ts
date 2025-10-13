import { HttpRoute } from "@kimia-framework/core/interfaces";
import { AppMiddleware } from "../app/middlewares/middlewares";
import { AppView } from "../app/views/views";
export const ROUTES: HttpRoute<AppView, AppMiddleware>[] = [
  {
    path: "/",
    template: "layout/base",
  },
];
