import { ApplicationAPI } from "@kimia-framework/core/server";
import { AppModelName } from "../models/models";
import {
  _app_title_SystemConfigKey,
  _app_title_SystemUserConfigKey,
} from "../interfaces";
import {
  absUrl,
  getConfig,
  getUserConfig,
  setConfig,
  setUserConfig,
} from "@kimia-framework/core/helpers";
import { ConfigDataType } from "@kimia-framework/core/database";
import { appMetaData } from "../../app";

export class base extends ApplicationAPI {
  /************************************** */
  /************************************** */
  get appName() {
    return appMetaData.name;
  }
  async syncAppModel(modelName: AppModelName, argvs = []) {
    return await this.syncModel<AppModelName>(modelName, argvs, this.appName);
  }
  appInfoLog(name: string, text?: any) {
    this.infoV2Log(this.appName, name, text);
  }

  appErrorLog(name: string, text?: any) {
    this.errorV2Log(this.appName, name, text);
  }
  async set_app_title_Config(
    key: _app_title_SystemConfigKey,
    value: any,
    dataType: ConfigDataType = "auto"
  ) {
    return setConfig<_app_title_SystemConfigKey, string>(
      key,
      this.appName,
      value,
      this.request.user().id,
      dataType
    );
  }

  async set_app_title_UserConfig<T = any>(
    key: _app_title_SystemUserConfigKey,
    value: T,
    userId?: number
  ) {
    if (!userId) {
      userId = this.request.user()?.id;
    }
    if (!userId) return false;
    return setUserConfig(key, userId, value, this.appName);
  }

  async get_app_title_Config<T = string>(
    key: _app_title_SystemConfigKey,
    def?: T
  ) {
    return getConfig<T, _app_title_SystemConfigKey, string>(
      key,
      this.appName,
      def,
      this.request.user()?.id
    );
  }
  async get_app_title_UserConfig<T = string>(
    key: _app_title_SystemUserConfigKey,
    def?: T,
    userId?: number
  ) {
    if (!userId) {
      userId = this.request.user()?.id;
    }
    if (!userId) return undefined;
    return getUserConfig<T>(userId, key, this.appName, def);
  }
}
