import joi = require('joi');

export = vandium;
declare function vandium(userFunc: vandium.UserFuncType): any;
declare namespace vandium {
  type UserFuncType = (event: any, context?: any, callback?: (err: Error, data: any) => void) => void;
  type AfterHandlerFuncType = (doneCallback: Function) => void;

  function after(afterHandlerFunction: AfterHandlerFuncType): void;
  function createInstance(config?: VandiumConfig): Vandium;
  function jwt(): VandiumJWTPlugin;
  function logUncaughtExceptions(enable: boolean): void;
  function stripErrors(enable: boolean): void;
  function validation(schema: Object): VandiumValidationPlugin;

  interface VandiumPlugin {
    constructor(name: string);

    execute(event: any, callback: Function): void;
    configure(config: Object): void;
    getConfiguration(): Object;
  }

  interface VandiumValidationPluginTypes {
    any(): joi.AnySchema<any>;

    array(): joi.ArraySchema;

    boolean(): joi.BooleanSchema;

    binary(): joi.BinarySchema;

    date(): joi.DateSchema;

    number(): joi.NumberSchema;

    object(): joi.ObjectSchema;

    string(options?: { trim?: boolean }): joi.StringSchema;

    uuid(): joi.StringSchema;

    email(options?: Object): joi.StringSchema;

    alternatives(): joi.AlternativesSchema;
  }

  export type VandiumValidationPluginConfig = {
    schema?: Object,
    ignore?: string[],
    allUnknown?: boolean
  }

  type VandiumValidationPluginValidator = Object;

  interface VandiumValidationPlugin extends VandiumPlugin {
    constructor();

    configure(config: VandiumValidationPluginConfig, schemaOnly?: boolean): void;
    getConfiguration(): VandiumValidationPluginConfig;
    ignore(): void;
    types(): VandiumValidationPluginTypes;
    validator(): VandiumValidationPluginValidator;
    state: {
      enabled: boolean;
      keys?: string[];
      ignored?: string;
    };
  }

  export type VandiumJWTPluginAlgorithmType = 'HS256' | 'HS384' | 'HS512' | 'RS256';

  export type VandiumJWTPluginConfig = {
    enable?: boolean,
    algorithm?: VandiumJWTPluginAlgorithmType,
    secret?: string,
    token_name?: string,
    xsrf?: boolean,
    xsrf_token_name?: string,
    xsrf_claim_name?: string
  }

  interface VandiumJWTPlugin extends VandiumPlugin {
    constructor();

    configure(config: VandiumJWTPluginConfig): void;
    getConfiguration(): VandiumJWTPluginConfig;
    isEnabled(): boolean;
    state: {
      enabled?: boolean,
      key?: string,
      algorithm?: VandiumJWTPluginAlgorithmType,
      tokenName?: string,
      xsrf?: boolean,
      xsrfToken?: string,
      xsrfClaimName?: string
    };
  }

  export type VandiumScanEnginePluginMode = 'disabled' | 'report' | 'fail';

  interface VandiumProtectPluginState {
    enabled?: boolean;
    mode?: VandiumScanEnginePluginMode;
  }

  export type VandiumScanEnginePluginConfig = {
    mode?: VandiumScanEnginePluginMode
  }

  interface VandiumScanEnginePlugin {
    constructor(name: string);

    disable(): this;
    report(): this;
    fail(): this;
    configure(config: VandiumScanEnginePluginConfig): void;
    state: VandiumProtectPluginState;
  }

  export type VandiumProtectPluginConfig = {
    mode?: VandiumScanEnginePluginMode,
    sql?: VandiumScanEnginePluginConfig
  }

  interface VandiumProtectPlugin extends VandiumPlugin {
    constructor(state: VandiumProtectPluginState);

    disable(engineName?: string): void;
    sql(): VandiumScanEnginePlugin;
    configure(config: VandiumProtectPluginConfig): void;
    getConfiguration(): VandiumProtectPluginConfig;
  }

  type VandiumConfig = {
    env?: { [key: string]: string },
    stripErrors?: boolean,
    logUncaughtExceptions?: boolean,
    stringifyErrors?: boolean,

    validation?: VandiumValidationPluginConfig,
    jwt?: VandiumJWTPluginConfig,
    protect?: VandiumProtectPluginConfig
  }

  interface Vandium {
    constructor(config?: VandiumConfig);

    configure(config?: VandiumConfig): void;
    getConfiguration(): VandiumConfig;

    handler(userFunc: UserFuncType): any;
    after(afterHandlerFun: AfterHandlerFuncType): void;
    validation: VandiumValidationPlugin;
    jwt: VandiumJWTPlugin;
    protect: VandiumProtectPlugin;
  }

  namespace jwt {
    function configure(options: VandiumJWTPluginConfig): void;
    function enable(enable: boolean): void;
  }

  namespace protect {
    const engines: {
      sql: VandiumScanEnginePlugin
    };
    const name: string;
    const state: {
      sql: VandiumProtectPluginState;
    };
    function configure(config: VandiumProtectPluginConfig): void;
    function disable(engineName?: string): void;
    function execute(event: any, callback: Function): void;
    function getConfiguration(): VandiumProtectPluginConfig;
    namespace sql {
      const enabled: boolean;
      const mode: string;
      const name: string;
      const state: VandiumProtectPluginState;

      function configure(config: VandiumScanEnginePluginConfig): void;
      function disable(): VandiumScanEnginePlugin;
      function execute(event: any, callback: Function): void;
      function fail(): VandiumScanEnginePlugin;
      function getConfiguration(): VandiumScanEnginePluginConfig;
      function report(): VandiumScanEnginePlugin;
    }
  }

  namespace types {
    function alternatives(): joi.AlternativesSchema;
    function any(): joi.AnySchema<any>;
    function array(): joi.ArraySchema;
    function binary(): joi.BinarySchema;
    function date(): joi.DateSchema;
    function email(opts?: joi.EmailOptions): joi.StringSchema;
    function number(): joi.NumberSchema;
    function object(): joi.ObjectSchema;
    function string(options?: { trim?: boolean }): joi.StringSchema;
    function uuid(): joi.StringSchema;
  }

  namespace validator {
    const isImmutable: boolean;
    const isJoi: boolean;
  }
}
