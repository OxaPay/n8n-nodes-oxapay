import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';

import { NodeApiError, NodeOperationError } from 'n8n-workflow';

type OxaPayAuthKind = 'merchant' | 'payout' | 'general' | 'generalInline' | 'common';

export async function oxapayRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	authKind: OxaPayAuthKind,
	method: IHttpRequestOptions['method'],
	endpoint: string,
	options: Partial<IHttpRequestOptions> = {},
) {
	const baseUrl = 'https://api.oxapay.com/v1';
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string> | undefined),
	};

	if (authKind === 'generalInline') {
		const qs = (options.qs ?? {}) as Record<string, any>;
		const { general_api_key, ...restQs } = qs;

		if (!general_api_key) {
			throw new NodeOperationError(this.getNode(), 'General API Key is required for this operation.');
		}

		headers.general_api_key = String(general_api_key);
		options.qs = restQs;
	}

	headers.origin = 'oxa-n8n-app-v-1.0.0';

	const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

	const requestOptions: IHttpRequestOptions = {
		method,
		url,
		json: true,
		...options,
		headers,
	};

	let response: any;

	if (authKind === 'merchant') {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'OxaPayMerchantApi',
			requestOptions,
		);
	} else if (authKind === 'payout') {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'OxaPayPayoutApi',
			requestOptions,
		);
	} else if (authKind === 'general') {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'OxaPayGeneralApi',
			requestOptions,
		);
	} else {
		response = await this.helpers.httpRequest(requestOptions);
	}
	
	const apiStatus = Number((response as any)?.status);
	if (!Number.isNaN(apiStatus) && apiStatus !== 200) {
		const msg = getOxaPayErrorMessage(response) || `OxaPay error (status ${apiStatus})`;

		const fakeErr: any = new Error(msg);
		fakeErr.statusCode = apiStatus;
		fakeErr.response = { statusCode: apiStatus, body: response };
		fakeErr.options = { method, url, headers };
		throw fakeErr;
	}

	return response;
}

export function cleanQuery(query: Record<string, any>) {
	const q: Record<string, any> = {};
	for (const [k, v] of Object.entries(query)) {
		if (v === undefined || v === null || v === '') continue;
		q[k] = v;
	}
	return q;
}

function getOxaPayErrorMessage(body: any): string | undefined {
	const e = body?.error?.message;
	if (typeof e === 'string' && e.trim()) return e.trim();

	const m = body?.message;
	if (typeof m === 'string' && m.trim()) return m.trim();

	return undefined;
}

function scrubApiKeys(headers: any) {
	if (!headers || typeof headers !== 'object') return headers;
	const h = { ...headers };
	delete h.merchant_api_key;
	delete h.payout_api_key;
	delete h.general_api_key;
	return h;
}

export function toOxaPayNodeApiError(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	error: any,
	itemIndex?: number,
) {
	const statusCode =
		error?.statusCode ??
		error?.response?.statusCode ??
		error?.response?.status ??
		error?.httpCode;

	const body =
		error?.response?.body ??
		error?.response?.data ??
		error?.body ??
		error?.error;

	const preferred =
		(statusCode && Number(statusCode) !== 200) ? getOxaPayErrorMessage(body) : undefined;

	let userMessage =
		preferred ||
		(statusCode === 401 || statusCode === 403
			? 'Unauthorized: API key is invalid or does not have access to this endpoint.'
			: statusCode === 429
				? 'Rate Limited: Too many requests. Please retry later.'
				: typeof statusCode === 'number' && statusCode >= 500
					? 'OxaPay server error: Please try again later.'
					: 'OxaPay request failed');

	const safeErr = { ...error };
	if (safeErr?.options?.headers) {
		safeErr.options = { ...safeErr.options, headers: scrubApiKeys(safeErr.options.headers) };
	}

	const descriptionParts: string[] = [];
	if (body?.error?.type) descriptionParts.push(String(body.error.type));
	if (body?.error?.key) descriptionParts.push(`key=${String(body.error.key)}`);

	return new NodeApiError(this.getNode(), safeErr, {
		message: userMessage,
		description: descriptionParts.length ? descriptionParts.join(' | ') : undefined,
		itemIndex,
	});
}