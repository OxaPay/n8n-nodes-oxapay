import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
type OxaPayAuthKind = 'merchant' | 'payout' | 'general' | 'generalInline' | 'common';
export declare function oxapayRequest(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions, authKind: OxaPayAuthKind, method: IHttpRequestOptions['method'], endpoint: string, options?: Partial<IHttpRequestOptions>): Promise<any>;
export declare function cleanQuery(query: Record<string, any>): Record<string, any>;
export declare function toOxaPayNodeApiError(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions, error: any, itemIndex?: number): NodeApiError;
export {};
