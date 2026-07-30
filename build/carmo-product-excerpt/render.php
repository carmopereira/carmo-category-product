<?php
/**
 * Renders a character-limited product excerpt (no mid-word cuts) for the
 * current product in a WooCommerce Product Collection loop.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

if ( empty( $block->context['postId'] ) ) {
	return;
}

$wc_product = wc_get_product( $block->context['postId'] );

if ( ! $wc_product instanceof WC_Product ) {
	return;
}

$excerpt_length = isset( $attributes['excerptLength'] ) ? absint( $attributes['excerptLength'] ) : 80;

if ( 0 === $excerpt_length ) {
	return;
}

$description = $wc_product->get_short_description();
if ( '' === $description ) {
	$description = $wc_product->get_description();
}
$description = wp_strip_all_tags( $description );

if ( '' === $description ) {
	return;
}

if ( mb_strlen( $description ) > $excerpt_length ) {
	$truncated  = mb_substr( $description, 0, $excerpt_length );
	$last_space = mb_strrpos( $truncated, ' ' );
	if ( false !== $last_space ) {
		$truncated = mb_substr( $truncated, 0, $last_space );
	}
	$description = rtrim( $truncated, " \t\n\r\0\x0B.,;:-" ) . '…';
}

printf(
	'<p %1$s>%2$s</p>',
	get_block_wrapper_attributes( array( 'class' => 'carmo-product-card__excerpt' ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	esc_html( $description )
);
