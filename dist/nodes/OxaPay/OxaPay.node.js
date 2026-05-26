"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxaPay = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const helpers_1 = require("./helpers");
class OxaPay {
    constructor() {
        this.description = {
            displayName: 'OxaPay',
            name: 'oxapay',
            icon: 'file:oxapay.svg',
            group: ['transform'],
            version: 1,
            description: 'OxaPay Crypto Payment gateway',
            defaults: { name: 'OxaPay' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    displayName: 'Merchant API Key',
                    name: 'OxaPayMerchantApi',
                    required: true,
                    displayOptions: {
                        show: { resource: ['payment'] }
                    }
                },
                {
                    displayName: 'Payout API Key',
                    name: 'OxaPayPayoutApi',
                    required: true,
                    displayOptions: {
                        show: { resource: ['payout'] }
                    }
                },
                {
                    displayName: 'General API Key',
                    name: 'OxaPayGeneralApi',
                    required: true,
                    displayOptions: {
                        show: { resource: ['swap'] },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Payment', value: 'payment' },
                        { name: 'Payout', value: 'payout' },
                        { name: 'Swap', value: 'swap' },
                        { name: 'Common', value: 'common' },
                    ],
                    default: 'payment',
                },
                // ---------------------- PAYMENT ----------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['payment'] } },
                    options: [
                        {
                            name: 'Generate Invoice Link',
                            value: 'generateInvoice',
                            description: 'Generates a payment invoice and returns a payment URL based on the specified amount and options.',
                            action: 'Generate an Invoice Link',
                        },
                        {
                            name: 'Generate White Label',
                            value: 'generateWhiteLabel',
                            description: 'Generates fully branded payment details for seamless in-app payment processing without redirecting to an invoice URL.',
                            action: 'Generate a White Label Address',
                        },
                        {
                            name: 'Generate Static Address',
                            value: 'generateStaticAddress',
                            description: 'Generates a static address for a specific currency and network.',
                            action: 'Generate a Static Address',
                        },
                        {
                            name: 'Revoke Static Address',
                            value: 'revokeStaticAddress',
                            description: 'Disables the static wallet and prevents any further transactions from being credited to the specified address.',
                            action: 'Revoke a Static Address',
                        },
                        {
                            name: 'List Static Addresses',
                            value: 'listStaticAddresses',
                            description: 'Returns a list of static addresses associated with a specific business.',
                            action: 'List Static Addresses',
                        },
                        {
                            name: 'Get Payment Information',
                            value: 'getPaymentInformation',
                            description: 'Returns detailed information about a specific payment using its Track ID.',
                            action: 'Get Payment Information',
                        },
                        {
                            name: 'Search Payments',
                            value: 'listPayments',
                            description: 'Returns a list of payment transactions based on filters.',
                            action: 'Search Payments',
                        },
                        {
                            name: 'Get Payment Statistics',
                            value: 'paymentstats',
                            description: 'Returns aggregated payment statistics for a merchant grouped by cryptocurrency',
                            action: 'Get Payment Statistics',
                        },
                        {
                            name: 'Get Accepted Currencies',
                            value: 'acceptedCurrencies',
                            description: 'Returns the list of cryptocurrencies configured in your OxaPay Merchant Service for accepting payments.',
                            action: 'Get Accepted Currencies',
                        },
                        {
                            name: 'Custom Payment API Call',
                            value: 'customPaymentCall',
                            description: 'Performs an arbitrary authorized payment API call.',
                            action: 'Make a Custom Payment API Call',
                        }
                    ],
                    default: 'generateInvoice',
                },
                // ---------------------- Generate Invoice Link ----------------------
                {
                    displayName: 'Amount',
                    name: 'amount',
                    type: 'number',
                    required: true,
                    typeOptions: { numberPrecision: 8 },
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: undefined,
                    description: 'The amount for the payment. If Currency is empty, the amount is in USD. If Currency is set, the amount corresponds to the specified currency.',
                },
                {
                    displayName: 'Currency',
                    name: 'currency',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: '',
                    description: 'Specify the currency symbol if you want the invoice amount calculated with a specific currency. You can also generate invoices in fiat currencies.',
                },
                {
                    displayName: 'Lifetime',
                    name: 'lifetime',
                    type: 'number',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: 60,
                    typeOptions: {
                        minValue: 15,
                        maxValue: 2280,
                        numberPrecision: 0,
                    },
                    description: 'Set the expiration time for the payment link in minutes.',
                },
                {
                    displayName: 'Order ID',
                    name: 'order_id',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: '',
                    description: 'Specify a unique order ID for reference in your system.',
                },
                {
                    displayName: 'Callback URL',
                    name: 'callback_url',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: '',
                    description: 'The URL where payment information will be sent. Use this to receive notifications about the payment status.',
                },
                {
                    displayName: 'Return URL',
                    name: 'return_url',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateInvoice'] } },
                    default: '',
                    description: 'The URL where the payer will be redirected after a successful payment.',
                },
                {
                    displayName: 'Advanced Settings',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Optional Setting',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['generateInvoice'] },
                    },
                    options: [
                        {
                            displayName: 'Fee Paid By Payer',
                            name: 'fee_paid_by_payer',
                            type: 'options',
                            options: [
                                { name: 'Default (Merchant Setting)', value: '' },
                                { name: 'Yes (Payer Pays Fee)', value: '1' },
                                { name: 'No (Merchant Pays Fee)', value: '0' },
                            ],
                            default: '',
                            description: '1 indicates that the payer will pay the fee, while 0 indicates that the merchant will pay the fee. Default: Merchant setting.',
                        },
                        {
                            displayName: 'Sandbox Mode',
                            name: 'sandbox',
                            type: 'boolean',
                            default: false,
                            description: 'Set to true for testing and false for live transactions.',
                        },
                        {
                            displayName: 'Under Paid Coverage',
                            name: 'under_paid_coverage',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                                maxValue: 60,
                                numberPrecision: 2,
                            },
                            default: undefined,
                            description: 'Specify the acceptable inaccuracy in payment (0..60). Determines the maximum acceptable difference between requested and paid amount. Default: Merchant setting.',
                        },
                        {
                            displayName: 'To Currency',
                            name: 'to_currency',
                            type: 'string',
                            default: '',
                            description: 'The currency symbol of the cryptocurrency you want to convert to. You only can convert paid crypto currencies to USDT.',
                        },
                        {
                            displayName: 'Auto Withdrawal',
                            name: 'auto_withdrawal',
                            type: 'boolean',
                            default: false,
                            description: 'If enabled, the received currency will be sent to the address specified in your Address List on the Settings page. If disabled, the amount will be credited to your OxaPay balance.',
                        },
                        {
                            displayName: 'Mixed Payment',
                            name: 'mixed_payment',
                            type: 'boolean',
                            default: false,
                            description: "Specify whether the payer can cover the remaining amount with another currency if they pay less than the invoice amount. Default: Merchant setting.",
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            default: '',
                            description: "Provide the payer's email address for reporting purposes.",
                        },
                        {
                            displayName: 'Thanks Message',
                            name: 'thanks_message',
                            type: 'string',
                            default: '',
                            description: 'A thanks message (brief note) displayed to the payer after a successful payment.',
                        },
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                            description: 'Provide order details or any additional information that will be shown in different reports.',
                        },
                    ],
                },
                // ---------------------- Generate White Label ----------------------
                {
                    displayName: 'Pay Currency',
                    name: 'wl_pay_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: '',
                    description: 'Specify the currency symbol if you want the invoice to be paid in a specific currency. Defines the currency in which you wish to receive your settlements.',
                },
                {
                    displayName: 'Amount',
                    name: 'wl_amount',
                    type: 'number',
                    required: true,
                    typeOptions: { numberPrecision: 12 },
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: undefined,
                    description: 'The amount for the payment. If the currency field is not filled, the amount should be specified in dollars. If the currency field is filled, the amount should correspond to the specified currency.',
                },
                {
                    displayName: 'Currency',
                    name: 'wl_currency',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: '',
                    description: 'Specify the currency symbol if you want the invoice amount calculated with a specific currency. You can also create invoices in fiat currencies.',
                },
                {
                    displayName: 'Network',
                    name: 'wl_network',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: '',
                    description: 'The blockchain network on which the payment should be created. If not specified, the default network will be used.',
                },
                {
                    displayName: 'Lifetime',
                    name: 'wl_lifetime',
                    type: 'number',
                    typeOptions: {
                        minValue: 15,
                        maxValue: 2880,
                        numberPrecision: 0,
                    },
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: 60,
                    description: 'Set the expiration time for the payment link in minutes. Default: 60.',
                },
                {
                    displayName: 'Callback URL',
                    name: 'wl_callback_url',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: '',
                    description: 'The URL where payment information will be sent. Use this to receive notifications about the payment status.',
                },
                {
                    displayName: 'Order ID',
                    name: 'wl_order_id',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateWhiteLabel'] } },
                    default: '',
                    description: 'Specify a unique order ID for reference in your system.',
                },
                {
                    displayName: 'Advanced Settings',
                    name: 'wl_additionalFields',
                    type: 'collection',
                    placeholder: 'Add Optional Setting',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['generateWhiteLabel'] },
                    },
                    options: [
                        {
                            displayName: 'Fee Paid By Payer',
                            name: 'fee_paid_by_payer',
                            type: 'options',
                            options: [
                                { name: 'Default (Merchant Setting)', value: '' },
                                { name: 'Yes (Payer Pays Fee)', value: '1' },
                                { name: 'No (Merchant Pays Fee)', value: '0' },
                            ],
                            default: '',
                            description: 'Specify whether the payer will cover the invoice commission. Default: Merchant setting.',
                        },
                        {
                            displayName: 'Under Paid Coverage',
                            name: 'under_paid_coverage',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                                maxValue: 60,
                                numberPrecision: 2,
                            },
                            default: undefined,
                            description: 'Specify the acceptable inaccuracy in payment (0..60). Default: Merchant setting.',
                        },
                        {
                            displayName: 'To Currency',
                            name: 'to_currency',
                            type: 'string',
                            default: '',
                            description: 'The currency symbol of the cryptocurrency you want to convert to. You only can convert paid crypto currencies to USDT.',
                        },
                        {
                            displayName: 'Auto Withdrawal',
                            name: 'auto_withdrawal',
                            type: 'boolean',
                            default: false,
                            description: 'If enabled, the received currency will be sent to the address specified in your Address List on the Settings page. If disabled, the amount will be credited to your OxaPay balance.',
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            default: '',
                            description: "Provide the payer's email address for reporting purposes.",
                        },
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                            description: 'Provide order details or any additional information that will be shown in different reports.',
                        },
                    ],
                },
                // ---------------------- Static Address ----------------------
                {
                    displayName: 'Network',
                    name: 'sa_network',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payment'], operation: ['generateStaticAddress'] } },
                    default: '',
                    description: 'The blockchain network on which the static address should be created.',
                },
                {
                    displayName: 'Callback URL',
                    name: 'sa_callback_url',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateStaticAddress'] } },
                    default: '',
                    description: 'The URL where OxaPay will send payment notifications for the static address.',
                },
                {
                    displayName: 'Order ID',
                    name: 'sa_order_id',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['generateStaticAddress'] } },
                    default: '',
                    description: 'A unique identifier for the order, useful for internal reference.',
                },
                {
                    displayName: 'Advanced Settings',
                    name: 'sa_additionalFields',
                    type: 'collection',
                    placeholder: 'Add Optional Setting',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['generateStaticAddress'] },
                    },
                    options: [
                        {
                            displayName: 'To Currency',
                            name: 'to_currency',
                            type: 'string',
                            default: '',
                            description: 'The cryptocurrency symbol you want to convert the received payment to.',
                        },
                        {
                            displayName: 'Auto Withdrawal',
                            name: 'auto_withdrawal',
                            type: 'boolean',
                            default: false,
                            description: 'If enabled, the received amount will be automatically withdrawn to the address in your Address List. If disabled, it will be credited to your OxaPay balance.',
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            default: '',
                            description: "The payer’s email address, used for reporting purposes.",
                        },
                        {
                            displayName: 'Description',
                            name: 'description',
                            type: 'string',
                            default: '',
                            description: 'Optional details or notes about the order, shown in reports.',
                        },
                    ],
                },
                // ---------------------- Revoke Static Address ----------------------
                {
                    displayName: 'Address',
                    name: 'revoke_address',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payment'], operation: ['revokeStaticAddress'] } },
                    default: '',
                    description: 'The address of the static wallet you want to revoke.',
                },
                // ---------------------- List Static Addresses (Filters) ----------------------
                {
                    displayName: 'Filters',
                    name: 'sa_filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['listStaticAddresses'] },
                    },
                    options: [
                        {
                            displayName: 'Track ID',
                            name: 'track_id',
                            type: 'number',
                            default: undefined,
                            description: 'Filter addresses by a specific ID.',
                        },
                        {
                            displayName: 'Network',
                            name: 'network',
                            type: 'string',
                            default: '',
                            description: 'Filter addresses by the expected blockchain network for the specified cryptocurrency.',
                        },
                        {
                            displayName: 'Currency',
                            name: 'currency',
                            type: 'string',
                            default: '',
                            description: 'Filter addresses by the expected currency.',
                        },
                        {
                            displayName: 'Address',
                            name: 'address',
                            type: 'string',
                            default: '',
                            description: "Filter static addresses by the expected address. It's better to filter static addresses.",
                        },
                        {
                            displayName: 'Has Transactions',
                            name: 'have_tx',
                            type: 'boolean',
                            default: false,
                            description: 'Filter addresses that had transactions.',
                        },
                        {
                            displayName: 'Order ID',
                            name: 'order_id',
                            type: 'string',
                            default: '',
                            description: 'Filter addresses by a unique order ID for reference.',
                        },
                        {
                            displayName: 'Email',
                            name: 'email',
                            type: 'string',
                            default: '',
                            description: 'Filter addresses by the email.',
                        },
                        {
                            displayName: 'Page Number',
                            name: 'page',
                            type: 'number',
                            default: 1,
                            description: 'The page number of the results you want to retrieve. Default is 1.',
                        },
                        {
                            displayName: 'Page Size',
                            name: 'size',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 200,
                                numberPrecision: 0,
                            },
                            default: 50,
                            description: 'Number of records to display per page. Default is 50. Maximum is 200.',
                        },
                    ],
                },
                // ---------------------- Get Payment Information ----------------------
                {
                    displayName: 'Track ID',
                    name: 'payment_track_id',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payment'], operation: ['getPaymentInformation'] } },
                    default: '',
                    description: 'A unique identifier for the payment session used to track and retrieve payment details.',
                },
                // ---------------------- List Payments (Filters) ----------------------
                {
                    displayName: 'Filters',
                    name: 'payment_filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['listPayments'] },
                    },
                    options: [
                        {
                            displayName: 'Track ID',
                            name: 'track_id',
                            type: 'number',
                            default: undefined,
                            description: 'Filter payments by a specific invoice ID.',
                        },
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                { name: 'Invoice', value: 'invoice' },
                                { name: 'White Label', value: 'white_label' },
                                { name: 'Static Address', value: 'static_address' },
                            ],
                            default: '',
                            description: 'Filter payments by type.',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                { name: 'Waiting', value: 'waiting' },
                                { name: 'Paying', value: 'paying' },
                                { name: 'Paid', value: 'paid' },
                                { name: 'Manual Accept', value: 'manual_accept' },
                                { name: 'Underpaid', value: 'underpaid' },
                                { name: 'Refunding', value: 'refunding' },
                                { name: 'Refunded', value: 'refunded' },
                                { name: 'Expired', value: 'expired' },
                            ],
                            default: '',
                            description: 'Filter payments by status.',
                        },
                        {
                            displayName: 'Pay Currency',
                            name: 'pay_currency',
                            type: 'string',
                            default: '',
                            description: 'Filter payments by a specific cryptocurrency symbol in which the pay amount is specified.',
                        },
                        {
                            displayName: 'Currency',
                            name: 'currency',
                            type: 'string',
                            default: '',
                            description: 'Filter payments by a specific currency symbol.',
                        },
                        {
                            displayName: 'Network',
                            name: 'network',
                            type: 'string',
                            default: '',
                            description: 'Filter payments by the expected blockchain network for the specified cryptocurrency.',
                        },
                        {
                            displayName: 'Address',
                            name: 'address',
                            type: 'string',
                            default: '',
                            description: 'Filter payments by the expected address. It’s better to filter static addresses.',
                        },
                        {
                            displayName: 'From Date',
                            name: 'from_date',
                            type: 'number',
                            default: undefined,
                            description: 'The start of the date window to query for payments in UNIX timestamp format.',
                        },
                        {
                            displayName: 'To Date',
                            name: 'to_date',
                            type: 'number',
                            default: undefined,
                            description: 'The end of the date window to query for payments in UNIX timestamp format.',
                        },
                        {
                            displayName: 'From Amount',
                            name: 'from_amount',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                            },
                            default: undefined,
                            description: 'Filter payments with amounts greater than or equal to this value.',
                        },
                        {
                            displayName: 'To Amount',
                            name: 'to_amount',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                            },
                            default: undefined,
                            description: 'Filter payments with amounts less than or equal to this value.',
                        },
                        {
                            displayName: 'Sort By',
                            name: 'sort_by',
                            type: 'options',
                            options: [
                                { name: 'Create Date', value: 'create_date' },
                                { name: 'Pay Date', value: 'pay_date' },
                                { name: 'Amount', value: 'amount' },
                            ],
                            default: '',
                            description: 'Sort the results by the selected parameter.',
                        },
                        {
                            displayName: 'Sort Type',
                            name: 'sort_type',
                            type: 'options',
                            options: [
                                { name: 'Descending', value: 'desc' },
                                { name: 'Ascending', value: 'asc' },
                            ],
                            default: '',
                            description: 'Display the results in ascending or descending order.',
                        },
                        {
                            displayName: 'Page',
                            name: 'page',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                numberPrecision: 0,
                            },
                            default: 1,
                            description: 'The page number of the results.',
                        },
                        {
                            displayName: 'Page Size',
                            name: 'size',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 200,
                                numberPrecision: 0,
                            },
                            default: 10,
                            description: 'Number of records per page.',
                        },
                    ],
                },
                // ---------------------- Payment Stats ----------------------
                {
                    displayName: 'Filters',
                    name: 'ps_filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payment'], operation: ['paymentstats'] },
                    },
                    options: [
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                { name: 'All', value: '' },
                                { name: 'Invoice', value: 'invoice' },
                                { name: 'White Label', value: 'white_label' },
                                { name: 'Static Address', value: 'static_address' },
                            ],
                            default: '',
                            description: 'Filter payment statistics by type.',
                        },
                        {
                            displayName: 'Network',
                            name: 'network',
                            type: 'string',
                            default: '',
                            description: 'Filter payment statistics by blockchain network.',
                        },
                        {
                            displayName: 'Pay Currency',
                            name: 'currency',
                            type: 'string',
                            default: '',
                            description: 'Filter payment statistics by a specific cryptocurrency symbol in which the pay amount is specified.',
                        },
                        {
                            displayName: 'From Date',
                            name: 'from_date',
                            type: 'number',
                            default: undefined,
                            description: 'The start of the date window to query for payment statistics in UNIX timestamp format.',
                        },
                        {
                            displayName: 'To Date',
                            name: 'to_date',
                            type: 'number',
                            default: undefined,
                            description: 'The end of the date window to query for payment statistics in UNIX timestamp format.',
                        },
                    ]
                },
                // ---------------------- Custom Payment Call ----------------------
                {
                    displayName: 'HTTP Method',
                    name: 'custom_method',
                    type: 'options',
                    options: [
                        { name: 'GET', value: 'GET' },
                        { name: 'POST', value: 'POST' },
                    ],
                    displayOptions: { show: { resource: ['payment'], operation: ['customPaymentCall'] } },
                    default: 'GET',
                },
                {
                    displayName: 'Endpoint (Path Only)',
                    name: 'custom_endpoint',
                    type: 'string',
                    displayOptions: { show: { resource: ['payment'], operation: ['customPaymentCall'] } },
                    default: '/invoice',
                    description: 'Please provide only the endpoint path after /payment, for example: /invoice.',
                },
                {
                    displayName: 'Query Parameters',
                    name: 'custom_qs',
                    type: 'json',
                    displayOptions: { show: { resource: ['payment'], operation: ['customPaymentCall'], custom_method: ['GET'] } },
                    default: '{}',
                },
                {
                    displayName: 'Body (JSON)',
                    name: 'custom_body',
                    type: 'json',
                    displayOptions: { show: { resource: ['payment'], operation: ['customPaymentCall'], custom_method: ['POST'] } },
                    default: '{}',
                },
                // ---------------------- PAYOUT ----------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['payout'] } },
                    options: [
                        {
                            name: 'Generate Payout',
                            value: 'generatePayout',
                            description: 'Generates a cryptocurrency payout request, allowing you to transfer funds to a specified address.',
                            action: 'Generate Payout',
                        },
                        {
                            name: 'Get Payout Information',
                            value: 'getPayoutInfo',
                            description: 'Returns the details of a specific payout using its Track ID.',
                            action: 'Get Payout Information',
                        },
                        {
                            name: 'Search Payouts',
                            value: 'listPayouts',
                            description: 'Returns a list of payout transactions based on filters.',
                            action: 'Search Payouts',
                        },
                        {
                            name: 'Custom Payout API Call',
                            value: 'customPayoutCall',
                            description: 'Performs an arbitrary authorized Payout API call.',
                            action: 'Make a Custom Payout API Call',
                        }
                    ],
                    default: 'generatePayout',
                },
                // ---------------------- Create Payout ----------------------
                {
                    displayName: 'Address',
                    name: 'p_address',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    description: "The recipient's cryptocurrency address where the payout will be sent.",
                },
                {
                    displayName: 'Currency',
                    name: 'p_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    description: 'The symbol of the cryptocurrency to be sent (e.g., BTC, ETH, LTC, etc.).',
                },
                {
                    displayName: 'Amount',
                    name: 'p_amount',
                    type: 'number',
                    required: true,
                    typeOptions: { numberPrecision: 8 },
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: undefined,
                    description: 'The exact amount of cryptocurrency to be sent as the payout.',
                },
                {
                    displayName: 'Network',
                    name: 'p_network',
                    type: 'string',
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    description: 'The blockchain network to be used for the payout. Required for currencies with multiple supported networks.',
                },
                {
                    displayName: 'Callback URL',
                    name: 'p_callback_url',
                    type: 'string',
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    placeholder: 'https://example.com/webhook',
                    description: 'The URL for sending payment status updates.',
                },
                {
                    displayName: 'Memo',
                    name: 'p_memo',
                    type: 'string',
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    description: 'A memo or tag for transactions on supported networks (e.g., for TON).',
                },
                {
                    displayName: 'Description',
                    name: 'p_description',
                    type: 'string',
                    displayOptions: { show: { resource: ['payout'], operation: ['generatePayout'] } },
                    default: '',
                    description: 'A description or additional information for the payout, useful for reports.',
                },
                // ---------------------- Get Payout Information ----------------------
                {
                    displayName: 'Track ID',
                    name: 'payout_track_id',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['payout'], operation: ['getPayoutInfo'] } },
                    default: '',
                    description: 'Returns detailed information about a specific payout using its Track ID.',
                },
                // ---------------------- List Payouts ----------------------
                {
                    displayName: 'Filters',
                    name: 'payout_filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['payout'], operation: ['listPayouts'] },
                    },
                    options: [
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                { name: 'Internal', value: 'internal' },
                                { name: 'External', value: 'external' },
                            ],
                            default: '',
                            description: 'Filter payouts by type.',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                { name: 'Processing', value: 'processing' },
                                { name: 'Pending', value: 'pending' },
                                { name: 'Confirming', value: 'confirming' },
                                { name: 'Confirmed', value: 'confirmed' },
                                { name: 'Canceled', value: 'canceled' },
                                { name: 'Rejected', value: 'rejected' },
                            ],
                            default: '',
                            description: 'Filter payouts by status.',
                        },
                        {
                            displayName: 'Currency',
                            name: 'currency',
                            type: 'string',
                            default: '',
                            description: 'Filter payouts by a specific currency symbol.',
                        },
                        {
                            displayName: 'Network',
                            name: 'network',
                            type: 'string',
                            default: '',
                            description: 'Filter payouts by the expected blockchain network for the specified cryptocurrency.',
                        },
                        {
                            displayName: 'Address',
                            name: 'address',
                            type: 'string',
                            default: '',
                            description: 'Filter payouts by the expected address.',
                        },
                        {
                            displayName: 'From Date',
                            name: 'from_date',
                            type: 'number',
                            default: undefined,
                            description: 'The start of the date window to query for payouts in UNIX timestamp format.',
                        },
                        {
                            displayName: 'To Date',
                            name: 'to_date',
                            type: 'number',
                            default: undefined,
                            description: 'The end of the date window to query for payouts in UNIX timestamp format.',
                        },
                        {
                            displayName: 'From Amount',
                            name: 'from_amount',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                            },
                            default: undefined,
                            description: 'Filter payouts with amounts greater than or equal to this value.',
                        },
                        {
                            displayName: 'To Amount',
                            name: 'to_amount',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                            },
                            default: undefined,
                            description: 'Filter payouts with amounts less than or equal to this value.',
                        },
                        {
                            displayName: 'Sort By',
                            name: 'sort_by',
                            type: 'options',
                            options: [
                                { name: 'Create Date', value: 'create_date' },
                                { name: 'Pay Date', value: 'pay_date' },
                                { name: 'Amount', value: 'amount' },
                            ],
                            default: '',
                            description: 'Sort the results by the selected parameter.',
                        },
                        {
                            displayName: 'Sort Type',
                            name: 'sort_type',
                            type: 'options',
                            options: [
                                { name: 'Descending', value: 'desc' },
                                { name: 'Ascending', value: 'asc' },
                            ],
                            default: '',
                            description: 'Display the results in ascending or descending order.',
                        },
                        {
                            displayName: 'Page',
                            name: 'page',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                numberPrecision: 0,
                            },
                            default: 1,
                            description: 'The page number of the results.',
                        },
                        {
                            displayName: 'Page Size',
                            name: 'size',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 200,
                                numberPrecision: 0,
                            },
                            default: 10,
                            description: 'Number of records per page.',
                        },
                    ],
                },
                // ---------------------- Custom Payout Call ----------------------
                {
                    displayName: 'HTTP Method',
                    name: 'custom_method',
                    type: 'options',
                    options: [
                        { name: 'GET', value: 'GET' },
                        { name: 'POST', value: 'POST' },
                    ],
                    displayOptions: { show: { resource: ['payout'], operation: ['customPayoutCall'] } },
                    default: 'GET',
                },
                {
                    displayName: 'Endpoint (Path Only)',
                    name: 'custom_endpoint',
                    type: 'string',
                    displayOptions: { show: { resource: ['payout'], operation: ['customPayoutCall'] } },
                    default: '',
                    description: 'Please provide only the endpoint path after /payout, for example: /{track_id}.',
                },
                {
                    displayName: 'Query Parameters',
                    name: 'custom_qs',
                    type: 'json',
                    displayOptions: { show: { resource: ['payout'], operation: ['customPayoutCall'], custom_method: ['GET'] } },
                    default: '{}',
                },
                {
                    displayName: 'Body (JSON)',
                    name: 'custom_body',
                    type: 'json',
                    displayOptions: { show: { resource: ['payout'], operation: ['customPayoutCall'], custom_method: ['POST'] } },
                    default: '{}',
                },
                // ---------------------- SWAP ----------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['swap'] } },
                    options: [
                        {
                            name: 'Generate a Swap Request',
                            value: 'generateSwap',
                            description: 'Swaps your account assets.',
                            action: 'Generate Swap Request',
                        },
                        {
                            name: 'Get Swap Pairs',
                            value: 'swapPairs',
                            description: 'Returns a list of swappable cryptocurrencies along with their minimum swap amounts.',
                            action: 'Get Swap Pairs',
                        },
                        {
                            name: 'Calculate a Swap',
                            value: 'calculateSwap',
                            description: 'Calculates how much cryptocurrency you will receive when swapping one currency for another.',
                            action: 'Calculate Swap',
                        },
                        {
                            name: 'Get the Swap Rate',
                            value: 'getSwapRate',
                            description: 'Fetches real-time swap rates for cryptocurrency pairs supported by OxaPay.',
                            action: 'Get the Swap Rate',
                        },
                        {
                            name: 'Search Swaps',
                            value: 'searchSwaps',
                            description: 'Returns a list of swap transactions based on filters.',
                            action: 'Search Swaps',
                        },
                        {
                            name: 'Custom Swap API Call',
                            value: 'customSwapCall',
                            description: 'Performs an arbitrary authorized Swap API call.',
                            action: 'Make a Custom Swap API Call',
                        }
                    ],
                    default: 'generateSwap',
                },
                // ---------------------- Generate Swap ----------------------
                {
                    displayName: 'From Currency',
                    name: 's_from_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['generateSwap'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap from.',
                },
                {
                    displayName: 'To Currency',
                    name: 's_to_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['generateSwap'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap to.',
                },
                {
                    displayName: 'Amount',
                    name: 's_amount',
                    type: 'number',
                    required: true,
                    typeOptions: { numberPrecision: 8 },
                    displayOptions: { show: { resource: ['swap'], operation: ['generateSwap'] } },
                    default: undefined,
                    description: 'Specify the amount of currency you want to swap.',
                },
                // ---------------------- calculate a Swap ----------------------
                {
                    displayName: 'From Currency',
                    name: 'cs_from_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['calculateSwap'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap from.',
                },
                {
                    displayName: 'To Currency',
                    name: 'cs_to_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['calculateSwap'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap to.',
                },
                {
                    displayName: 'Amount',
                    name: 'cs_amount',
                    type: 'number',
                    required: true,
                    typeOptions: { numberPrecision: 8 },
                    displayOptions: { show: { resource: ['swap'], operation: ['calculateSwap'] } },
                    default: undefined,
                    description: 'Specify the amount of currency you want to swap.',
                },
                // ---------------------- Get the Swap Rate ----------------------
                {
                    displayName: 'From Currency',
                    name: 'gs_from_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['getSwapRate'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap from.',
                },
                {
                    displayName: 'To Currency',
                    name: 'gs_to_currency',
                    type: 'string',
                    required: true,
                    displayOptions: { show: { resource: ['swap'], operation: ['getSwapRate'] } },
                    default: '',
                    description: 'Specify the currency symbol you want to swap to.',
                },
                // ---------------------- List Swaps ----------------------
                {
                    displayName: 'Filters',
                    name: 'swap_filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: { resource: ['swap'], operation: ['searchSwaps'] },
                    },
                    options: [
                        {
                            displayName: 'Track ID',
                            name: 'track_id',
                            type: 'number',
                            default: undefined,
                            description: 'Filter specific exchange by it`s trackId.',
                        },
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                { name: 'Auto Convert', value: 'autoConvert' },
                                { name: 'Manual Swap', value: 'manualSwap' },
                                { name: 'Swap By API', value: 'swapByApi' },
                            ],
                            default: '',
                            description: 'Filter swaps by type.',
                        },
                        {
                            displayName: 'From Currency',
                            name: 'from_currency',
                            type: 'string',
                            default: '',
                            description: 'Specify the currency symbol for filtering exchanges in a specific fromCurrency.',
                        },
                        {
                            displayName: 'To Currency',
                            name: 'to_currency',
                            type: 'string',
                            default: '',
                            description: 'Specify the currency symbol for filtering exchanges in a specific toCurrency.',
                        },
                        {
                            displayName: 'From Date',
                            name: 'from_date',
                            type: 'number',
                            default: undefined,
                            description: 'The start of the date window to query for swaps in UNIX timestamp format.',
                        },
                        {
                            displayName: 'To Date',
                            name: 'to_date',
                            type: 'number',
                            default: undefined,
                            description: 'The end of the date window to query for swaps in UNIX timestamp format.',
                        },
                        {
                            displayName: 'Sort By',
                            name: 'sort_by',
                            type: 'options',
                            options: [
                                { name: 'Create Date', value: 'create_date' },
                                { name: 'Amount', value: 'amount' },
                            ],
                            default: '',
                            description: 'Sort the results by the selected parameter.',
                        },
                        {
                            displayName: 'Sort Type',
                            name: 'sort_type',
                            type: 'options',
                            options: [
                                { name: 'Descending', value: 'desc' },
                                { name: 'Ascending', value: 'asc' },
                            ],
                            default: '',
                            description: 'Display the results in ascending or descending order.',
                        },
                        {
                            displayName: 'Page',
                            name: 'page',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                numberPrecision: 0,
                            },
                            default: 1,
                            description: 'The page number of the results.',
                        },
                        {
                            displayName: 'Page Size',
                            name: 'size',
                            type: 'number',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 200,
                                numberPrecision: 0,
                            },
                            default: 10,
                            description: 'Number of records per page.',
                        },
                    ],
                },
                // ---------------------- Custom Swaps Call ----------------------
                {
                    displayName: 'HTTP Method',
                    name: 'custom_method',
                    type: 'options',
                    options: [
                        { name: 'GET', value: 'GET' },
                        { name: 'POST', value: 'POST' },
                    ],
                    displayOptions: { show: { resource: ['swap'], operation: ['customSwapCall'] } },
                    default: 'GET',
                },
                {
                    displayName: 'Endpoint (Path Only)',
                    name: 'custom_endpoint',
                    type: 'string',
                    displayOptions: { show: { resource: ['swap'], operation: ['customSwapCall'] } },
                    default: '',
                    description: 'Please provide only the endpoint path after /swap, for example: /pairs.',
                },
                {
                    displayName: 'Query Parameters',
                    name: 'custom_qs',
                    type: 'json',
                    displayOptions: { show: { resource: ['swap'], operation: ['customSwapCall'], custom_method: ['GET'] } },
                    default: '{}',
                },
                {
                    displayName: 'Body (JSON)',
                    name: 'custom_body',
                    type: 'json',
                    displayOptions: { show: { resource: ['swap'], operation: ['customSwapCall'], custom_method: ['POST'] } },
                    default: '{}',
                },
                // ---------------------- COMMON ----------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['common'] } },
                    options: [
                        {
                            name: 'Get the Account Balances',
                            value: 'getAccountBalances',
                            description: 'Returns the details of all wallets associated with a user.',
                            action: 'Get Account Balances',
                        },
                        {
                            name: 'Get Prices',
                            value: 'getPrices',
                            description: 'Returns the current prices of all cryptocurrencies supported by OxaPay.',
                            action: 'Get Prices',
                        },
                        {
                            name: 'Get Supported Currencies',
                            value: 'getSupportedCurrencies',
                            description: 'Calculates how much cryptocurrency you will receive when swapping one currency for another.',
                            action: 'Get Supported Currencies',
                        },
                        {
                            name: 'Get Supported Fiat Currencies',
                            value: 'getSupportedFiatCurrencies',
                            description: 'Returns a list of supported fiat currencies.',
                            action: 'Get Supported Fiat Currencies',
                        },
                        {
                            name: 'Get Supported Networks',
                            value: 'getSupportedNetworks',
                            description: 'Returns a list of blockchain networks supported by OxaPay for cryptocurrency transactions.',
                            action: 'Get Supported Networks',
                        },
                        {
                            name: 'Get the System Status',
                            value: 'getSystemStatus',
                            description: 'Checks the current status of the OxaPay API.',
                            action: 'Get System Status',
                        },
                        {
                            name: 'Custom Common API Call',
                            value: 'customCommonCall',
                            description: 'Performs an arbitrary authorized Common API call.',
                            action: 'Make a Custom Common API Call',
                        }
                    ],
                    default: 'getAccountBalances',
                },
                // ---------------------- Account Balances ----------------------
                {
                    displayName: 'General API Key',
                    name: 'a_general_key',
                    type: 'string',
                    typeOptions: {
                        password: true,
                    },
                    required: true,
                    displayOptions: { show: { resource: ['common'], operation: ['getAccountBalances'] } },
                    default: '',
                    description: 'Enter your OxaPay General API Key. You can obtain your General API Key on <a href="https://app.oxapay.com/settings" target="_blank">OxaPay Settings</a>.',
                },
                {
                    displayName: 'Currency',
                    name: 'a_currency',
                    type: 'string',
                    displayOptions: { show: { resource: ['common'], operation: ['getAccountBalances'] } },
                    default: '',
                    description: 'Specify a specific currency to get the balance for that currency.',
                },
                // ---------------------- Custom Commons Call ----------------------
                {
                    displayName: 'HTTP Method',
                    name: 'custom_method',
                    type: 'options',
                    options: [
                        { name: 'GET', value: 'GET' },
                        { name: 'POST', value: 'POST' },
                    ],
                    displayOptions: { show: { resource: ['common'], operation: ['customCommonCall'] } },
                    default: 'GET',
                },
                {
                    displayName: 'Endpoint (Path Only)',
                    name: 'custom_endpoint',
                    type: 'string',
                    displayOptions: { show: { resource: ['common'], operation: ['customCommonCall'] } },
                    default: '',
                    description: 'Please provide only the endpoint path after /common, for example: /currencies.',
                },
                {
                    displayName: 'Query Parameters',
                    name: 'custom_qs',
                    type: 'json',
                    displayOptions: { show: { resource: ['common'], operation: ['customCommonCall'], custom_method: ['GET'] } },
                    default: '{}',
                },
                {
                    displayName: 'Body (JSON)',
                    name: 'custom_body',
                    type: 'json',
                    displayOptions: { show: { resource: ['common'], operation: ['customCommonCall'], custom_method: ['POST'] } },
                    default: '{}',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            const bool01 = (v) => (v === undefined ? undefined : v ? '1' : '0');
            const cleanBody = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));
            const cleanQs = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));
            const parseJson = (raw, fieldName) => {
                try {
                    return JSON.parse(raw || '{}');
                }
                catch (e) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Invalid JSON in "${fieldName}"`);
                }
            };
            try {
                let response;
                // ---------------- PAYMENT ----------------
                if (resource === 'payment') {
                    const normalizeInvoiceAdditional = (af) => ({
                        ...af,
                        auto_withdrawal: af.auto_withdrawal === undefined ? undefined : bool01(af.auto_withdrawal),
                        mixed_payment: af.mixed_payment === undefined ? undefined : bool01(af.mixed_payment),
                        sandbox: af.sandbox === undefined ? undefined : bool01(af.sandbox),
                    });
                    const normalizeWhiteLabelAdditional = (af) => ({
                        ...af,
                        auto_withdrawal: af.auto_withdrawal === undefined ? undefined : bool01(af.auto_withdrawal),
                    });
                    const normalizeStaticAdditional = (af) => ({
                        ...af,
                        auto_withdrawal: af.auto_withdrawal === undefined ? undefined : bool01(af.auto_withdrawal),
                    });
                    // ---------------- Generate Invoice ----------------
                    if (operation === 'generateInvoice') {
                        const additionalFieldsRaw = this.getNodeParameter('additionalFields', i, {});
                        const additionalFields = normalizeInvoiceAdditional(additionalFieldsRaw);
                        const body = cleanBody({
                            amount: this.getNodeParameter('amount', i),
                            currency: this.getNodeParameter('currency', i),
                            lifetime: this.getNodeParameter('lifetime', i),
                            order_id: this.getNodeParameter('order_id', i),
                            callback_url: this.getNodeParameter('callback_url', i),
                            return_url: this.getNodeParameter('return_url', i),
                            // Advanced Settings (collection)
                            ...additionalFields,
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'POST', '/payment/invoice', { body });
                    }
                    // ---------------- Generate White Label ----------------
                    if (operation === 'generateWhiteLabel') {
                        const additionalFieldsRaw = this.getNodeParameter('wl_additionalFields', i, {});
                        const additionalFields = normalizeWhiteLabelAdditional(additionalFieldsRaw);
                        const body = cleanBody({
                            pay_currency: this.getNodeParameter('wl_pay_currency', i),
                            amount: this.getNodeParameter('wl_amount', i),
                            currency: this.getNodeParameter('wl_currency', i),
                            network: this.getNodeParameter('wl_network', i),
                            lifetime: this.getNodeParameter('wl_lifetime', i),
                            callback_url: this.getNodeParameter('wl_callback_url', i),
                            order_id: this.getNodeParameter('wl_order_id', i),
                            // Advanced Settings (collection)
                            ...additionalFields,
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'POST', '/payment/white-label', { body });
                    }
                    // ---------------- Generate Static Address ----------------
                    if (operation === 'generateStaticAddress') {
                        const additionalFieldsRaw = this.getNodeParameter('sa_additionalFields', i, {});
                        const additionalFields = normalizeStaticAdditional(additionalFieldsRaw);
                        const body = cleanBody({
                            network: this.getNodeParameter('sa_network', i),
                            callback_url: this.getNodeParameter('sa_callback_url', i),
                            order_id: this.getNodeParameter('sa_order_id', i),
                            // Advanced Settings (collection)
                            ...additionalFields,
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'POST', '/payment/static-address', { body });
                    }
                    // ---------------- Revoke Static Address ----------------
                    if (operation === 'revokeStaticAddress') {
                        const body = {
                            address: this.getNodeParameter('revoke_address', i),
                        };
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'POST', '/payment/static-address/revoke', { body });
                    }
                    // ---------------- List Static Addresses ----------------
                    if (operation === 'listStaticAddresses') {
                        const filters = this.getNodeParameter('sa_filters', i, {});
                        const qs = cleanQs(filters);
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'GET', '/payment/static-address', { qs });
                    }
                    // ---------------- Get Payment Information ----------------
                    if (operation === 'getPaymentInformation') {
                        const trackId = this.getNodeParameter('payment_track_id', i);
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'GET', `/payment/${encodeURIComponent(trackId)}`);
                    }
                    // ---------------- List Payments (Payment History) ----------------
                    if (operation === 'listPayments') {
                        const filters = this.getNodeParameter('payment_filters', i, {});
                        const qs = cleanQs(filters);
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'GET', '/payment', { qs });
                    }
                    // ---------------- Accepted Currencies ----------------
                    if (operation === 'acceptedCurrencies') {
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'GET', '/payment/accepted-currencies');
                    }
                    // ---------------- Payment Statistics ----------------
                    if (operation === 'paymentstats') {
                        const filters = this.getNodeParameter('ps_filters', i, {});
                        const qs = cleanQs(filters);
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', 'GET', '/payment/stats', { qs });
                    }
                    // ---------------- Custom Payment Call ----------------
                    if (operation === 'customPaymentCall') {
                        const method = this.getNodeParameter('custom_method', i);
                        const endpoint = "/payment" + this.getNodeParameter('custom_endpoint', i);
                        let body = undefined;
                        let qs = undefined;
                        if (method === 'GET') {
                            const qsRaw = this.getNodeParameter('custom_qs', i);
                            qs = cleanQs(parseJson(qsRaw, 'Query Parameters'));
                        }
                        else {
                            const bodyRaw = this.getNodeParameter('custom_body', i);
                            body = parseJson(bodyRaw, 'Body (JSON)');
                        }
                        response = await helpers_1.oxapayRequest.call(this, 'merchant', method, endpoint, { qs, body });
                    }
                }
                // ---------------- PAYOUT ----------------
                if (resource === 'payout') {
                    // ---------------- Generate Payout ----------------
                    if (operation === 'generatePayout') {
                        const body = cleanBody({
                            address: this.getNodeParameter('p_address', i),
                            currency: this.getNodeParameter('p_currency', i),
                            amount: this.getNodeParameter('p_amount', i),
                            network: this.getNodeParameter('p_network', i),
                            callback_url: this.getNodeParameter('p_callback_url', i),
                            memo: this.getNodeParameter('p_memo', i),
                            description: this.getNodeParameter('p_description', i),
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'payout', 'POST', '/payout', { body });
                    }
                    // ---------------- Get Payout Information ----------------
                    if (operation === 'getPayoutInfo') {
                        const trackId = this.getNodeParameter('payout_track_id', i);
                        response = await helpers_1.oxapayRequest.call(this, 'payout', 'GET', `/payout/${encodeURIComponent(trackId)}`);
                    }
                    // ---------------- List Payout (Payment History) ----------------
                    if (operation === 'listPayouts') {
                        const filters = this.getNodeParameter('payout_filters', i, {});
                        const qs = cleanQs(filters);
                        response = await helpers_1.oxapayRequest.call(this, 'payout', 'GET', '/payout', { qs });
                    }
                    // ---------------- Custom Payout Call ----------------
                    if (operation === 'customPayoutCall') {
                        const method = this.getNodeParameter('custom_method', i);
                        const endpoint = "/payout" + this.getNodeParameter('custom_endpoint', i);
                        let body = undefined;
                        let qs = undefined;
                        if (method === 'GET') {
                            const qsRaw = this.getNodeParameter('custom_qs', i);
                            qs = cleanQs(parseJson(qsRaw, 'Query Parameters'));
                        }
                        else {
                            const bodyRaw = this.getNodeParameter('custom_body', i);
                            body = parseJson(bodyRaw, 'Body (JSON)');
                        }
                        response = await helpers_1.oxapayRequest.call(this, 'payout', method, endpoint, { qs, body });
                    }
                }
                // ---------------- SWAP ----------------
                if (resource === 'swap') {
                    // ---------------- Generate Swap ----------------
                    if (operation === 'generateSwap') {
                        const body = cleanBody({
                            from_currency: this.getNodeParameter('s_from_currency', i),
                            to_currency: this.getNodeParameter('s_to_currency', i),
                            amount: this.getNodeParameter('s_amount', i),
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'general', 'POST', '/general/swap', { body });
                    }
                    // ---------------- calculate a Swap ----------------
                    if (operation === 'calculateSwap') {
                        const body = cleanBody({
                            from_currency: this.getNodeParameter('cs_from_currency', i),
                            to_currency: this.getNodeParameter('cs_to_currency', i),
                            amount: this.getNodeParameter('cs_amount', i),
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'general', 'POST', '/general/swap/calculate', { body });
                    }
                    // ---------------- Get the Swap Rate ----------------
                    if (operation === 'getSwapRate') {
                        const body = cleanBody({
                            from_currency: this.getNodeParameter('gs_from_currency', i),
                            to_currency: this.getNodeParameter('gs_to_currency', i),
                        });
                        response = await helpers_1.oxapayRequest.call(this, 'general', 'POST', '/general/swap/rate', { body });
                    }
                    // ---------------- Swap Pairs ----------------
                    if (operation === 'swapPairs') {
                        response = await helpers_1.oxapayRequest.call(this, 'general', 'GET', '/general/swap/pairs');
                    }
                    // ---------------- List Swap (Swap History) ----------------
                    if (operation === 'searchSwaps') {
                        const filters = this.getNodeParameter('swap_filters', i, {});
                        const qs = cleanQs(filters);
                        response = await helpers_1.oxapayRequest.call(this, 'general', 'GET', '/general/swap', { qs });
                    }
                    // ---------------- Custom Swap Call ----------------
                    if (operation === 'customSwapCall') {
                        const method = this.getNodeParameter('custom_method', i);
                        const endpoint = "/general/swap" + this.getNodeParameter('custom_endpoint', i);
                        let body = undefined;
                        let qs = undefined;
                        if (method === 'GET') {
                            const qsRaw = this.getNodeParameter('custom_qs', i);
                            qs = cleanQs(parseJson(qsRaw, 'Query Parameters'));
                        }
                        else {
                            const bodyRaw = this.getNodeParameter('custom_body', i);
                            body = parseJson(bodyRaw, 'Body (JSON)');
                        }
                        response = await helpers_1.oxapayRequest.call(this, 'general', method, endpoint, { qs, body });
                    }
                }
                // ---------------- COMMON ----------------
                if (resource === 'common') {
                    // ---------------- Account Balance ----------------
                    if (operation === 'getAccountBalances') {
                        const a_general_key = this.getNodeParameter('a_general_key', i);
                        const a_currency = this.getNodeParameter('a_currency', i);
                        const qs = cleanQs({ general_api_key: a_general_key, currency: a_currency });
                        response = await helpers_1.oxapayRequest.call(this, 'generalInline', 'GET', '/general/account/balance', { qs });
                    }
                    // ---------------- Get Price ----------------
                    if (operation === 'getPrices') {
                        response = await helpers_1.oxapayRequest.call(this, 'common', 'GET', '/common/prices');
                    }
                    // ---------------- Get Supported Currencies ----------------
                    if (operation === 'getSupportedCurrencies') {
                        response = await helpers_1.oxapayRequest.call(this, 'common', 'GET', '/common/currencies');
                    }
                    // ---------------- Get Supported Fiat Currencies ----------------
                    if (operation === 'getSupportedFiatCurrencies') {
                        response = await helpers_1.oxapayRequest.call(this, 'common', 'GET', '/common/fiats');
                    }
                    // ---------------- Get Supported Networks ----------------
                    if (operation === 'getSupportedNetworks') {
                        response = await helpers_1.oxapayRequest.call(this, 'common', 'GET', '/common/networks');
                    }
                    // ---------------- Get System Status ----------------
                    if (operation === 'getSystemStatus') {
                        response = await helpers_1.oxapayRequest.call(this, 'common', 'GET', '/common/monitor');
                    }
                    // ---------------- Custom Common Call ----------------
                    if (operation === 'customCommonCall') {
                        const method = this.getNodeParameter('custom_method', i);
                        const endpoint = "/common" + this.getNodeParameter('custom_endpoint', i);
                        let body = undefined;
                        let qs = undefined;
                        if (method === 'GET') {
                            const qsRaw = this.getNodeParameter('custom_qs', i);
                            qs = cleanQs(parseJson(qsRaw, 'Query Parameters'));
                        }
                        else {
                            const bodyRaw = this.getNodeParameter('custom_body', i);
                            body = parseJson(bodyRaw, 'Body (JSON)');
                        }
                        response = await helpers_1.oxapayRequest.call(this, 'common', method, endpoint, { qs, body });
                    }
                }
                if (response === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unhandled operation: ${resource}.${operation}`);
                }
                returnData.push({ json: response });
            }
            catch (err) {
                const error = err?.response || err?.statusCode || err?.options?.url
                    ? helpers_1.toOxaPayNodeApiError.call(this, err, i)
                    : new n8n_workflow_1.NodeOperationError(this.getNode(), err?.message ?? 'OxaPay request failed', {
                        itemIndex: i,
                    });
                if (this.continueOnFail()) {
                    const errorDetails = {
                        message: error.message,
                        description: error.description,
                        statusCode: err?.statusCode ?? err?.response?.statusCode ?? err?.response?.status,
                    };
                    returnData.push({
                        json: {
                            error: errorDetails,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.OxaPay = OxaPay;
//# sourceMappingURL=OxaPay.node.js.map