# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-24

### Added

- Initial public release of `n8n-nodes-oxapay`.
- Added OxaPay node for merchant payment operations.
- Added OxaPay Trigger node for receiving payment and payout webhook events.
- Added support for Merchant API credentials.
- Added support for Payout API credentials.
- Added support for General API credentials.
- Added payment invoice creation.
- Added payment link creation.
- Added payment information retrieval.
- Added payment history search.
- Added payout creation.
- Added payout information retrieval.
- Added payout history search.
- Added swap quote and swap execution operations.
- Added account balance retrieval.
- Added webhook HMAC signature verification support.
- Added OxaPay node icon and metadata for n8n.

### Security

- Added credential-based API key handling for OxaPay API authentication.
- Added HMAC verification for incoming OxaPay webhook requests.