"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxaPayMerchantApi = void 0;
class OxaPayMerchantApi {
    constructor() {
        this.name = 'OxaPayMerchantApi';
        this.displayName = 'OxaPay Merchant API Key';
        this.documentationUrl = 'https://docs.oxapay.com/api-reference/payment';
        this.properties = [
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
                displayName: 'You can obtain your Merchant API Key on <a href="https://app.oxapay.com/merchant-service" target="_blank">OxaPay Merchant Service</a>.',
                name: 'OxaPayMerchantNotice',
                type: 'notice',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    merchant_api_key: '={{$credentials.merchantApiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
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
}
exports.OxaPayMerchantApi = OxaPayMerchantApi;
//# sourceMappingURL=OxaPayMerchantApi.credentials.js.map