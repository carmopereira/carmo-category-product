# Carmo Category Product

A WordPress block that displays a WooCommerce product carousel filtered by category, with configurable columns for desktop and mobile.

The block renders the real WooCommerce Product Collection block tree, so the "Add to Cart" button is the native one, including the live "View cart" behaviour.

## Features

- Product category picker, or all categories
- Independent column counts for desktop and mobile
- Configurable number of products; only in-stock products are shown
- Short description with a character limit that never cuts a word in half
- Automatic title from the category name, with a selectable HTML tag
- Touch scrolling with scroll-snap, plus optional prev/next buttons
- Margin, padding, wide and full alignment support

## Requirements

- WordPress 6.9 or later
- PHP 8.2 or later
- WooCommerce 8.3 or later

## Installation

Copy this folder to `wp-content/plugins/carmo-category-product` and activate the plugin. The compiled assets in `build/` are committed, so no build step is needed.

## Development

```bash
npm install
npm start
```

`npm run build` bumps the patch version and syncs it to the plugin header, `block.json` and `readme.txt`. `npm run plugin-zip` creates the installable zip.

## License

GPLv2 or later. See [LICENSE](LICENSE).
