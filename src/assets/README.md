# Assets Directory

This directory contains static assets used throughout the application.

## Structure

```
assets/
├── emails/           # Assets referenced in email templates (e.g., banner images, icons)
├── logos/            # Business logos and branding images
└── README.md         # This file
```

## Usage

### Email Assets
Place any images or assets that need to be referenced in email templates inside `emails/`.

> **Note:** For email compatibility, assets should be uploaded to a CDN (e.g., Cloudinary) and referenced by URL in templates. Email clients do not support embedded local file references.

### Logos
Place business logos in `logos/`. These can be uploaded via the branding API (`POST /branding/upload/logo`) which stores them on Cloudinary and returns a public URL suitable for use in emails and the storefront.
