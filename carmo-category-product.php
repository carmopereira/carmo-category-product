<?php
/**
 * Plugin Name:       Carmo Category Product
 * Plugin URI:        https://github.com/carmopereira/carmo-category-product
 * Description:       Adds a WooCommerce product carousel block filtered by category, with configurable columns for desktop and mobile.
 * Version:           0.1.23
 * Requires at least: 6.9
 * Requires PHP:      8.2
 * Requires Plugins:  woocommerce
 * WC requires at least: 8.3
 * WC tested up to:   9.0
 * Author:            João Carmo Pereira
 * Author URI:        https://profiles.wordpress.org/carmopereira/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       carmo-category-product
 * Domain Path:       /languages
 *
 * @package CarmoCategoryProduct
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_carmo_category_product_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'create_block_carmo_category_product_block_init' );
