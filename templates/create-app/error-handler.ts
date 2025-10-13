import { HttpErrorHandler, HttpStatusCode } from "@kimia-framework/core/server";
export class AppErrorHandler extends HttpErrorHandler {
  async webHandler(code: HttpStatusCode, data?: object) {
    return await super.webHandler(code, data);
  }
}
