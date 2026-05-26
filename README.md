# OxaPay for n8n

Official OxaPay integration for n8n.

This project provides **OxaPay** nodes for n8n so you can automate crypto payment flows, payouts, swaps, common OxaPay account utilities, and webhook-driven workflows directly inside n8n.

## Overview

With this integration, you can connect n8n workflows to the OxaPay API and build automations such as:

* Create a crypto payment invoice from an order
* Receive payment updates through webhooks
* Fetch payment and payout details
* Query balances, prices, currencies, and networks
* Generate swaps and retrieve swap rates
* Trigger downstream workflows when OxaPay sends payment or payout callbacks

The project currently includes:

* **OxaPay** node

  * Payment operations
  * Payout operations
  * Swap operations
  * Common operations
* **OxaPay Trigger** node

  * Receive OxaPay webhooks

---

## Operations

### Payment

* Generate Invoice
* Generate White Label payment details
* Generate Static Address
* Revoke Static Address
* List Static Addresses
* Get Payment Information
* Search Payments
* Get Payment Statistics
* Get Accepted Currencies
* Custom Payment API Call

### Payout

* Generate Payout
* Get Payout Information
* Search Payouts
* Custom Payout API Call

### Swap

* Generate Swap
* Calculate Swap
* Get Swap Rate
* Search Swaps
* Get Swap Pairs
* Custom Swap API Call

### Common

* Get Account Balances
* Get Prices
* Get Supported Currencies
* Get Supported Fiat Currencies
* Get Supported Networks
* Get System Status
* Custom Common API Call

### Trigger

* Listen for **payment** webhooks
* Listen for **payout** webhooks
* Auto-detect webhook type from payload

---

## Supported Credentials

This integration uses three OxaPay credential types.

### OxaPay Merchant API Key

Used for payment-related operations, such as creating invoices, retrieving payment information, searching payments, and validating payment webhooks.

You can create or manage your Merchant API Key from the OxaPay Merchant Service page:

https://app.oxapay.com/merchant-service

### OxaPay Payout API Key

Used for payout-related operations, such as creating payouts, retrieving payout information, searching payouts, and validating payout webhooks.

You can create or manage your Payout API Key from the OxaPay Payout Service page:

https://app.oxapay.com/payout-service

### OxaPay General API Key

Used for common and swap-related operations, such as retrieving balances, prices, currencies, networks, system status, and performing swap operations.

You can create or manage your General API Key from the OxaPay Settings page:

https://app.oxapay.com/settings

## Requirements

Before using this integration, make sure you have:

* A working **n8n** instance
* An **OxaPay account**
* At least one of the following API keys depending on your use case:

  * Merchant API Key
  * Payout API Key
  * General API Key

---

## Installation

In your n8n instance:

1. Go to **Settings**
2. Open **Community Nodes**
3. Select **Install**
4. Enter the package name:

```text
n8n-nodes-oxapay
```

5. Confirm the installation

For more details, see the n8n community nodes installation guide:

https://docs.n8n.io/integrations/community-nodes/installation/

---

## Example Use Cases

### 1. Create invoice from an order

Workflow idea:

1. Receive a new order from Shopify, WooCommerce, or a form
2. Use **OxaPay → Payment → Generate Invoice**
3. Send the invoice URL to the customer by email or chat

### 2. Update order status when a payment is completed

Workflow idea:

1. Use **OxaPay Trigger** to receive payment updates
2. Check the payment status in the webhook payload
3. Update your CRM, database, or ecommerce platform
4. Notify your team on Telegram, Slack, or Discord

### 3. Run automated payouts

Workflow idea:

1. Receive approved payout requests from your internal system
2. Use **OxaPay → Payout → Generate Payout**
3. Log the payout result in Airtable, Notion, or Google Sheets

### 4. Monitor balances and rates

Workflow idea:

1. Run a scheduled workflow in n8n
2. Use **OxaPay → Common → Get Account Balances**
3. Use **OxaPay → Common → Get Prices**
4. Send a daily treasury summary to your team

### 5. Use swaps in automated treasury flows

Workflow idea:

1. Watch for treasury thresholds or incoming balances
2. Use **Calculate Swap** or **Get Swap Rate**
3. Trigger **Generate Swap** when policy conditions are met

---

## Example Workflows

Example n8n workflow files are available in the `examples/` directory:

- `create-invoice.workflow.json` — Create an OxaPay invoice from sample order data.
- `payment-webhook.workflow.json` — Receive OxaPay payment webhook events and branch based on payment status.
- `payout.workflow.json` — Create a payout request from sample recipient data.
- `white-label-payment.workflow.json` — Generate OxaPay white-label payment details from sample order data.
- `swap-rate.workflow.json` — Retrieve the swap rate for a supported currency pair.

---

## Development

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```
Run lint checks:

```bash
npm run lint
```
Create a local package for testing:

```bash
npm pack
```

## Troubleshooting

### The webhook fails HMAC verification

Check the following:

* the correct credential type is selected
* the correct API key is configured
* your proxy or n8n setup preserves the raw request body
* the sender is actually OxaPay
* the incoming `HMAC` header is present

### Payment operations fail with authentication errors

Make sure you are using the **Merchant API Key** credential for payment operations.

### Payout operations fail with authentication errors

Make sure you are using the **Payout API Key** credential for payout operations.

### Swap operations fail

Make sure you are using the **General API Key** credential where required.

---

## License

MIT

---

## Links

* OxaPay website: [https://oxapay.com/](https://oxapay.com/)
* OxaPay docs: [https://docs.oxapay.com/](https://docs.oxapay.com/)

---

## Disclaimer

This project is an OxaPay integration for n8n and should be tested carefully before production use, especially for payout flows, webhook validation, and financial automation logic.
