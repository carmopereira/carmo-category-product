=== Carmo Category Product ===
Contributors: carmopereira
Donate link: https://ko-fi.com/carmopereira
Tags: woocommerce, products, carousel, block, category
Requires at least: 6.9
Tested up to: 7.0
Stable tag: 0.1.31
Requires PHP: 8.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A Gutenberg block that displays a WooCommerce product carousel filtered by category, with configurable columns for desktop and mobile.

== Description ==

Carmo Category Product adds a "Product Carousel" block to the WordPress block editor. Pick a WooCommerce product category and the block builds a horizontally scrollable carousel of in-stock products from that category — swipeable on touch devices, with optional prev/next navigation buttons on desktop.

Each product card shows the featured image as a full-bleed background, the product name, a short description truncated to a configurable character limit (without cutting words mid-way), the price, and WooCommerce's native "Add to Cart" button.

Under the hood, the block renders the real WooCommerce `Product Collection` block tree (`Product Template`, `Product Image`, `Product Price`, `Product Button`, plus a small internal helper block for the character-limited excerpt) via `render_block()`, instead of a hand-built product loop. This means the add-to-cart button is the actual native WooCommerce button — including live "View cart" behaviour via the Interactivity API — not a re-implementation.

**Features**

* Product category picker (WooCommerce `product_cat` taxonomy), or a hand-picked list of products shown in the order you pick them
* Configurable number of columns for desktop and mobile, independently
* Configurable number of products to show
* Only in-stock products are queried
* Short description with a configurable character limit (never cuts a word in half)
* Title above the carousel, automatically filled with the category name, with a selectable HTML tag (H1, H2, H3, or a plain span)
* Native WooCommerce "Add to Cart" button (Product Collection / Interactivity API), with an option to hide the "View cart" link that appears after adding a product
* Optional subtitle above the title, styled by the theme through a CSS class of your choice
* Cards aligned left, center or right when there are too few to fill the row
* Touch-friendly horizontal scrolling with scroll-snap, plus optional prev/next buttons
* Wide and full alignment support

**Requirements**

This block requires [WooCommerce](https://woocommerce.com/) to be installed and active, with a version that includes the `Product Collection` block (WooCommerce 8.3 or later).

**Credits**

Built on top of the [Create Block](https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-create-block/) tool and the WooCommerce [Product Collection](https://woocommerce.com/document/woocommerce-store-editing/customizing-shop-page-catalog/product-collection-block/) block.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/carmo-category-product` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the "Plugins" screen in WordPress.
3. Make sure WooCommerce is installed and active.
4. In the block editor, add the "Carmo Category Product" block and choose a product category in the block settings sidebar.

== Frequently Asked Questions ==

= Does this work without WooCommerce? =

No. WooCommerce must be active, and it must be a version that ships the `Product Collection` block (8.3+), since the carousel renders that block internally.

= Can I show products from all categories? =

Yes, choose "All categories" in the category dropdown. In that case, no title is shown above the carousel (since there is no category name to display).

= Why don't out-of-stock products show up? =

The carousel only queries products with stock status "In stock" by design.

= Can I change the character limit for the description? =

Yes, in the block settings sidebar, under "Character limit for the description." Set it to 0 to hide the description entirely.

== Screenshots ==

1. The product carousel on the front end, with a category title and native add-to-cart buttons.
2. The block settings sidebar: category, columns, products to show, title tag, description length, and view-cart visibility.

== Changelog ==

= 0.1.31 =
* New "Uppercase title" option to show the carousel title in capital letters.

= 0.1.30 =
* On small screens, a carousel inside a Group with content width no longer doubles the side padding; the cards sit at the theme's root padding from the screen edge.

= 0.1.29 =
* New optional subtitle above the carousel title, with an optional CSS class field so the theme's own style can be applied to it.

= 0.1.28 =
* New "Cards alignment" option (left, center or right) for when there are too few products to fill the row.
* On desktop with a mouse, hovering a card darkens it, zooms the image slightly and slides the description in. Touch screens keep the description always visible.
* The editor warns when the carousel is placed inside a WooCommerce Product Collection block, where it would not show on the site.

= 0.1.27 =
* New product source option: show a hand-picked list of products instead of a category, in the order they were picked, with an optional title.
* The previous/next buttons no longer touch the page edges on desktop; the block uses the theme's root side padding at every screen size.

= 0.1.26 =
* With a single column, the card is slightly narrower so the edge of the next card shows and hints that the carousel scrolls.
* The block preview in the editor is no longer clickable; clicking a product link or button there could crash the editor.

= 0.1.25 =
* Side padding around the carousel on small screens (the theme root padding, or 1.5rem), so the cards no longer touch the screen edges.

= 0.1.24 =
* Cards now match the configured number of columns on every screen size.
* On narrow cards the "Add to cart" button moves below the price instead of covering it.
* The prev/next buttons are hidden on small screens, where the carousel is swiped.
* Declares compatibility with WooCommerce High-Performance Order Storage and the cart/checkout blocks.

= 0.1.23 =
* The product image now fills the whole card, down to the bottom edge.
* Stronger gradient at the bottom of the card so the name, price and button stay readable.
* Uses the larger product image size for a sharper card background.

= 0.1.22 =
* Margin and padding controls on the carousel block.
* The title now lines up with the first card.
* Now requires WordPress 6.9 and PHP 8.2.

= 0.1.17 =
* Product carousel filtered by WooCommerce category, with configurable columns for desktop/mobile.
* Card design with full-bleed featured image, name, character-limited description, price, and native add-to-cart button.
* Automatic title above the carousel using the category name, with a selectable HTML tag (H1/H2/H3/span).
* Only in-stock products are shown.
* Renders the real WooCommerce Product Collection block tree so the add-to-cart button matches native behaviour exactly.
* Option to hide the "View cart" link after adding a product to the cart.

== Upgrade Notice ==

= 0.1.22 =
This version requires WordPress 6.9 and PHP 8.2. Check your server before updating.
