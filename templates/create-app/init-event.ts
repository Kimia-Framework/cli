import { ApplicationEvent } from "@kimia-framework/core/server";
import { AppEventType } from "@kimia-framework/core/interfaces";

export class init extends ApplicationEvent {
  static override type(): AppEventType {
    return "init";
  }

  override async start() {
    console.log("init _app_title_ app!");
    return true;
  }
}
