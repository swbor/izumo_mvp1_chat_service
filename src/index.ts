import * as sdk from "@basaldev/blocks-backend-sdk";
import { ServiceOpts, defaultChat, MessagingAppConfig, createNodeblocksMessagingApp } from "@basaldev/blocks-messaging-service";
import * as handlers from  "./handlers/handlers";
import * as validators from  "./validators/validators";
const path = require('path');

/**
 * Access to the configs set on the NBC dashboard based no the adapter manifest(nbc.adapter.json) by process.env
 * 
 * @example
 * const foo = process.env.ADAPTER_CUSTOM_FOO;
 */

/**
 * A hook function called before the adapter is created
 * This hook can be used to customize the adapter configs
 * 
 * @param {defaultChat.ChatDefaultAdapterOptions} adapterOptions Adapter options set on the NBC dashboard
 * @param {CreateChatDefaultAdapterDependencies} adapterDependencies Adapter dependencies set on the NBC dashboard
 * @returns {[defaultChat.ChatDefaultAdapterOptions, defaultChat.CreateChatDefaultAdapterDependencies]} Updated adapter options and dependencies
 */
export function beforeCreateAdapter(
  currentOptions: defaultChat.ChatDefaultAdapterOptions,
  currentDependencies: defaultChat.CreateChatDefaultAdapterDependencies): [defaultChat.ChatDefaultAdapterOptions, defaultChat.CreateChatDefaultAdapterDependencies] {
  /**
   * Add new custom fields here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#adding-new-custom-fields
   * 
   * @example
   * const updatedOptions = {
   *   ...currentOptions,
   *   customFields: {
   *     user: [ ... ]
   *   }
   * };
   */
  const updatedOptions = {
    ...currentOptions
  };

  /**
   * Replace third-party services here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#replacing-third-party-services
   * 
   * @example
   * const updatedDependencies = {
   *   ...currentDependencies,
   *   mailService: new CustomMailProvider(),
   * };
   */
  const updatedDependencies = {
    ...currentDependencies
  };

  return [updatedOptions, updatedDependencies];
}

/**
 * A hook function called after the adapter is created
 * This hook can be used to customize the adapter instance
 * 
 * @param {defaultChat.ChatDefaultAdapter} adapter Default adapter instance
 * @returns {defaultChat.ChatDefaultAdapter} Updated adapter instance
 */
export function adapterCreated(adapter: defaultChat.ChatDefaultAdapter): defaultChat.ChatDefaultAdapter {
  /**
   * Customize handlers and validators for an existing endpoint here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#customizing-handlers-and-validators-for-an-existing-endpoint
   * 
   * @example
   * const updatedAdapter = sdk.adapter.setValidator(adapter, 'createUser', 'nameUnique', async (logger, context) => {
   *   ...
   *   return sdk.util.StatusCodes.OK;
   * });
   */
  const updatedAdapter = adapter;

  return updatedAdapter;
}

/**
 * A hook function called before the service is created
 * This hook can be used to customize the service configs
 * 
 * @param {MessagingAppConfig} currentConfigs Service configs set on the NBC dashboard
 */
export function beforeCreateService(currentConfigs: MessagingAppConfig): MessagingAppConfig {
  /**
   * Customize service options including CORS options here
   * 
   * @example
   * const updatedConfigs = {
   *   ...currentConfigs,
   *   corsOptions: {
   *     origin: '*',
   *   }
   * };
   */
  const updatedConfigs = {
    ...currentConfigs
  };

  return updatedConfigs;
}

/**
 * A hook function called after the service is created
 * This hook can be used to perform any post service creation tasks
 */
export function serviceCreated() {}

type StartServiceArgs = Parameters<ReturnType<typeof createNodeblocksMessagingApp>['startService']>;

/**
 * A hook function called before the service is started
 * This hook can be used to customize the options for starting the service
 * 
 * @param {ServiceOpts} currentOptions Service options
 * @returns {StartServiceArgs} Updated service start args
 */


//deploy - nodeblocks projects - mvp - add custom - chat service - add git repository string
//todo: here include something
export function beforeStartService(currentOptions: ServiceOpts): StartServiceArgs {
  /**
   * Add new api endpoints here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#adding-new-api-endpoints
   * 
   * @example
   * const updatedOptions = {
   *   ...currentOptions,
   *   customRoutes: [
   *     {
   *       handler: async (logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) => {
   *         ...
   *         return {
   *           data: ...,
   *           status: 200
   *         };
   *       },
   *       method: 'post' as const,
   *       path: '/coupons/use',
   *       validators: [
   *         async (logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) => {
   *           ...
   *           return 200;
   *         }
   *       ]
   *     },
   *   ]
   * };
   */
  //get grades for current day
  //get avg grades for current subject
  //get feedback for grades
          //into function context.query[]
        //context.params
        //install node js v18.something 
        //after that npm -ci
        //https://github.com/swbor/izumo_mvp1_chat_service/tree/HackIzumoTeam1-chat-init

  const updatedOptions = {
    ...currentOptions,
    customRoutes: [
      {
        handler: handlers.get_feedback_handler,
        method: 'get' as const,
        path: '/feedback',
        validators: [
          validators.get.validate_child_id
        ]
      },
      // {
      //   handler: handlers.get_avg_assessments_for_subject_handler,
      //   method: 'get' as const,
      //   path: '/assessments_for_subject/get',
      //   validators: [
      //     validators.get.validate_subject_id
      //   ]
      // },
      // {
      //   handler: handlers.get_feedback_for_assessments_handler,
      //   method: 'get' as const,
      //   path: '/assessments_for_grades/get',
      //   validators: [
      //     validators.get.validate_assessments
      //   ]
      // },
    ]
  };
  return [updatedOptions];
  
}

/**
 * A hook function called after the service is started
 * This hook can be used to perform any post service starting tasks
 */
export function serviceStarted() {}
