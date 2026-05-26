"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxaPayPayoutApi = void 0;
class OxaPayPayoutApi {
    constructor() {
        this.name = 'OxaPayPayoutApi';
        this.displayName = 'OxaPay Payout API Key';
        this.documentationUrl = 'https://docs.oxapay.com/api-reference/payout';
        this.properties = [
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
                displayName: 'You can obtain your Payout API Key on <a href="https://app.oxapay.com/payout-service" target="_blank">OxaPay Payout Service</a>.',
                name: 'OxaPayPayoutNotice',
                type: 'notice',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    payout_api_key: '={{$credentials.payoutApiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
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
}
exports.OxaPayPayoutApi = OxaPayPayoutApi;
//# sourceMappingURL=OxaPayPayoutApi.credentials.js.map