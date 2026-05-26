"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxaPayTrigger = void 0;
const crypto = __importStar(require("crypto"));
const PAYMENT_TYPES = new Set(['invoice', 'white_label', 'static_address', 'payment_link', 'donation']);
const PAYOUT_TYPES = new Set(['payout']);
function normalizeHex(input) {
    return String(input ?? '').trim().toLowerCase();
}
function timingSafeEqualHex(a, b) {
    const aa = normalizeHex(a);
    const bb = normalizeHex(b);
    if (!aa || !bb)
        return false;
    // hex must have even length
    if (aa.length % 2 !== 0 || bb.length % 2 !== 0)
        return false;
    try {
        const ab = Buffer.from(aa, 'hex');
        const bbBuf = Buffer.from(bb, 'hex');
        if (ab.length !== bbBuf.length)
            return false;
        return crypto.timingSafeEqual(ab, bbBuf);
    }
    catch {
        return false;
    }
}
function getHeaderInsensitive(headers, name) {
    const needle = name.toLowerCase();
    for (const [k, v] of Object.entries(headers ?? {})) {
        if (k.toLowerCase() === needle) {
            if (Array.isArray(v))
                return String(v[0] ?? '');
            return String(v ?? '');
        }
    }
    return '';
}
function toRawBodyBuffer(maybeRaw) {
    if (Buffer.isBuffer(maybeRaw))
        return maybeRaw;
    if (typeof maybeRaw === 'string')
        return Buffer.from(maybeRaw, 'utf8');
    return undefined;
}
function sendPlain(resp, statusCode, text) {
    resp.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    resp.end(text);
}
class OxaPayTrigger {
    constructor() {
        this.description = {
            displayName: 'OxaPay Trigger',
            name: 'oxapayTrigger',
            icon: 'file:oxapay.svg',
            group: ['trigger'],
            version: 1,
            description: 'OxaPay Crypto Payment gateway',
            defaults: { name: 'OxaPay Trigger' },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'OxaPayMerchantApi',
                    displayName: 'Merchant API Key',
                    required: true,
                    displayOptions: {
                        show: {
                            verifyHmac: [true],
                            webhookType: ['payment', 'auto'],
                        },
                    },
                },
                {
                    name: 'OxaPayPayoutApi',
                    displayName: 'Payout API Key',
                    required: true,
                    displayOptions: {
                        show: {
                            verifyHmac: [true],
                            webhookType: ['payout', 'auto'],
                        },
                    },
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'oxapay',
                },
            ],
            properties: [
                {
                    displayName: 'Trigger On',
                    name: 'webhookType',
                    type: 'options',
                    options: [
                        { name: 'All Transactions', value: 'auto' },
                        { name: 'Payments', value: 'payment' },
                        { name: 'Payouts', value: 'payout' },
                    ],
                    default: 'auto',
                },
                {
                    displayName: 'When using All Transactions, configure both Merchant and Payout API credentials',
                    name: 'webhookTypeNotice',
                    type: 'notice',
                    default: '',
                },
                {
                    displayName: 'Verify HMAC',
                    name: 'verifyHmac',
                    type: 'boolean',
                    default: true,
                    description: 'Validate HMAC (sha512) signature header using the proper API key as shared secret.',
                },
            ],
        };
    }
    async webhook() {
        const webhookTypeParam = this.getNodeParameter('webhookType');
        const verify = this.getNodeParameter('verifyHmac');
        const headerName = 'HMAC';
        const req = this.getRequestObject();
        const resp = this.getResponseObject();
        const headers = this.getHeaderData();
        const body = this.getBodyData();
        // Detect kind from payload.type when possible
        const payloadType = String(body?.type ?? '').toLowerCase();
        let resolvedKind;
        if (payloadType && PAYOUT_TYPES.has(payloadType))
            resolvedKind = 'payout';
        else if (payloadType && PAYMENT_TYPES.has(payloadType))
            resolvedKind = 'payment';
        else if (webhookTypeParam !== 'auto')
            resolvedKind = webhookTypeParam;
        if (webhookTypeParam !== 'auto' &&
            resolvedKind &&
            resolvedKind !== webhookTypeParam) {
            sendPlain(resp, 200, 'ok');
            return { noWebhookResponse: true };
        }
        // n8n may expose it as req.rawBody or body._rawBody depending on setup.
        let rawBody = toRawBodyBuffer(req?.rawBody) ?? toRawBodyBuffer(body?._rawBody);
        // Try to read raw body if API exists (some n8n versions)
        if (!rawBody && verify && typeof req?.readRawBody === 'function') {
            await req.readRawBody();
            rawBody = toRawBodyBuffer(req?.rawBody);
        }
        const received = normalizeHex(getHeaderInsensitive(headers, 'HMAC'));
        if (verify) {
            if (!resolvedKind) {
                sendPlain(resp, 400, 'Unable to detect webhook type. Check payload.type or set Webhook Type explicitly.');
                return { noWebhookResponse: true };
            }
            if (!rawBody) {
                // Keeping this as 500 because it's a server/config issue
                sendPlain(resp, 500, 'Raw body is not available for HMAC verification. Configure n8n/proxy to keep raw request body.');
                return { noWebhookResponse: true };
            }
            if (!received) {
                sendPlain(resp, 400, 'Missing HMAC header on webhook request.');
                return { noWebhookResponse: true };
            }
            let secret = '';
            if (resolvedKind === 'payment') {
                const creds = await this.getCredentials('OxaPayMerchantApi');
                secret = String(creds?.merchantApiKey ?? '');
            }
            else {
                const creds = await this.getCredentials('OxaPayPayoutApi');
                secret = String(creds?.payoutApiKey ?? '');
            }
            if (!secret) {
                sendPlain(resp, 500, `Missing credentials for ${resolvedKind} webhook verification.`);
                return { noWebhookResponse: true };
            }
            const computed = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
            if (!timingSafeEqualHex(computed, received)) {
                sendPlain(resp, 400, 'Invalid HMAC signature.');
                return { noWebhookResponse: true };
            }
        }
        // OxaPay requires HTTP 200 with body "ok" to mark delivery successful.
        sendPlain(resp, 200, 'ok');
        return {
            noWebhookResponse: true,
            workflowData: [
                [
                    {
                        json: {
                            webhookType: resolvedKind ?? 'unknown',
                            selectedWebhookType: webhookTypeParam,
                            body,
                        },
                    },
                ],
            ],
        };
    }
}
exports.OxaPayTrigger = OxaPayTrigger;
//# sourceMappingURL=OxaPayTrigger.node.js.map