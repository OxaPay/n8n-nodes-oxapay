"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxaPayGeneralApi = void 0;
class OxaPayGeneralApi {
    constructor() {
        this.name = 'OxaPayGeneralApi';
        this.displayName = 'OxaPay General API Key';
        this.documentationUrl = 'https://docs.oxapay.com/api-reference/swap';
        this.properties = [
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
                displayName: 'You can obtain your General API Key on <a href="https://app.oxapay.com/settings" target="_blank">OxaPay Settings</a>.',
                name: 'OxaPayGeneralNotice',
                type: 'notice',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    general_api_key: '={{$credentials.generalApiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
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
}
exports.OxaPayGeneralApi = OxaPayGeneralApi;
//# sourceMappingURL=OxaPayGeneralApi.credentials.js.map