import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OxaPayGeneralApi implements ICredentialType {
	name = 'OxaPayGeneralApi';

	displayName = 'OxaPay General API Key';
	documentationUrl = 'https://docs.oxapay.com/api-reference/swap';

	properties: INodeProperties[] = [
		{
			displayName: 'General API Key',
			name: 'generalApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName:
				'You can obtain your General API Key on <a href="https://app.oxapay.com/settings" target="_blank">OxaPay Settings</a>.',
			name: 'OxaPayGeneralNotice',
			type: 'notice',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				general_api_key: '={{$credentials.generalApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.oxapay.com/v1',
			url: '/general/swap',
			method: 'GET',
			headers: {
				general_api_key: '={{$credentials.generalApiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};
}