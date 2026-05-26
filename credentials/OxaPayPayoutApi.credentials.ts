import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OxaPayPayoutApi implements ICredentialType {
	name = 'OxaPayPayoutApi';

	displayName = 'OxaPay Payout API Key';
	documentationUrl = 'https://docs.oxapay.com/api-reference/payout';

	properties: INodeProperties[] = [
		{
			displayName: 'Payout API Key',
			name: 'payoutApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName:
				'You can obtain your Payout API Key on <a href="https://app.oxapay.com/payout-service" target="_blank">OxaPay Payout Service</a>.',
			name: 'OxaPayPayoutNotice',
			type: 'notice',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				payout_api_key: '={{$credentials.payoutApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.oxapay.com/v1',
			url: '/payout',
			method: 'GET',
			headers: {
				payout_api_key: '={{$credentials.payoutApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};
}