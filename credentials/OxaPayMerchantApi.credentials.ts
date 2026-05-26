import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OxaPayMerchantApi implements ICredentialType {
	name = 'OxaPayMerchantApi';

	displayName = 'OxaPay Merchant API Key';
	documentationUrl = 'https://docs.oxapay.com/api-reference/payment';

	properties: INodeProperties[] = [
		{
			displayName: 'Merchant API Key',
			name: 'merchantApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName:
				'You can obtain your Merchant API Key on <a href="https://app.oxapay.com/merchant-service" target="_blank">OxaPay Merchant Service</a>.',
			name: 'OxaPayMerchantNotice',
			type: 'notice',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				merchant_api_key: '={{$credentials.merchantApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.oxapay.com/v1',
			url: '/payment',
			method: 'GET',
			headers: {
				merchant_api_key: '={{$credentials.merchantApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};
}