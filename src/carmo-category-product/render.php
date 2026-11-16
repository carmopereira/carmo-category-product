<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * This block renders the real `woocommerce/product-collection` block tree
 * (Product Template > Product Image, Post Title, Product Excerpt, Product
 * Price, Product Button) and wraps it with carousel markup/CSS, so the
 * add-to-cart button and every other inner block behave exactly like the
 * native WooCommerce "Product Collection" block.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! class_exists( 'WooCommerce' ) ) {
	if ( current_user_can( 'activate_plugins' ) ) {
		echo '<p>' . esc_html__( 'O WooCommerce tem de estar ativo para mostrar este carousel de produtos.', 'carmo-category-product' ) . '</p>';
	}
	return;
}

if ( ! class_exists( 'WP_Block_Type_Registry' ) || ! WP_Block_Type_Registry::get_instance()->is_registered( 'woocommerce/product-collection' ) ) {
	if ( current_user_can( 'activate_plugins' ) ) {
		echo '<p>' . esc_html__( 'Esta versão do WooCommerce não tem o bloco Product Collection disponível, necessário para este carousel.', 'carmo-category-product' ) . '</p>';
	}
	return;
}

$category_id      = isset( $attributes['categoryId'] ) ? absint( $attributes['categoryId'] ) : 0;
$columns_desktop   = isset( $attributes['columnsDesktop'] ) ? max( 1, absint( $attributes['columnsDesktop'] ) ) : 4;
$columns_mobile    = isset( $attributes['columnsMobile'] ) ? max( 1, absint( $attributes['columnsMobile'] ) ) : 2;
$products_to_show  = isset( $attributes['productsToShow'] ) ? max( 1, absint( $attributes['productsToShow'] ) ) : 8;
$excerpt_length    = isset( $attributes['excerptLength'] ) ? absint( $attributes['excerptLength'] ) : 80;

$allowed_title_tags = array( 'h1', 'h2', 'h3', 'span' );
$title_tag           = isset( $attributes['titleTag'] ) ? $attributes['titleTag'] : 'h2';
if ( ! in_array( $title_tag, $allowed_title_tags, true ) ) {
	$title_tag = 'h2';
}

$hide_view_cart_link = ! empty( $attributes['hideViewCartLink'] );

// Product source: a category (default) or a hand-picked list of products.
$source      = ( isset( $attributes['source'] ) && 'handpicked' === $attributes['source'] ) ? 'handpicked' : 'category';
$product_ids = array();

if ( 'handpicked' === $source && ! empty( $attributes['productIds'] ) && is_array( $attributes['productIds'] ) ) {
	$product_ids = array_values( array_unique( array_filter( array_map( 'absint', $attributes['productIds'] ) ) ) );
}

if ( 'handpicked' === $source && ! $product_ids ) {
	// Nothing picked yet: say so in the editor preview, show nothing on the site.
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		echo '<p>' . esc_html__( 'Escolha produtos nas definições do bloco para os mostrar neste carousel.', 'carmo-category-product' ) . '</p>';
	}
	return;
}

$carousel_title = '';
$tax_query      = array();

if ( 'handpicked' === $source ) {
	$category_id   = 0;
	$carousel_title = isset( $attributes['customTitle'] ) ? trim( wp_strip_all_tags( (string) $attributes['customTitle'] ) ) : '';
}

if ( $category_id ) {
	$term = get_term( $category_id, 'product_cat' );
	if ( $term && ! is_wp_error( $term ) ) {
		$carousel_title = $term->name;
		$tax_query      = array( 'product_cat' => array( $category_id ) );
	}
}

$product_template_inner_blocks = array(
	array(
		'blockName'    => 'woocommerce/product-image',
		'attrs'        => array(
			'showSaleBadge'           => true,
			'imageSizing'             => 'single',
			'isDescendentOfQueryLoop' => true,
		),
		'innerBlocks'  => array(
			array(
				'blockName'    => 'woocommerce/product-sale-badge',
				'attrs'        => array( 'align' => 'right' ),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			),
		),
		'innerHTML'    => '',
		'innerContent' => array( null ),
	),
	array(
		'blockName'    => 'core/post-title',
		'attrs'        => array(
			'isLink'   => true,
			'fontSize' => 'medium',
		),
		'innerBlocks'  => array(),
		'innerHTML'    => '',
		'innerContent' => array(),
	),
	array(
		'blockName'    => 'carmo-category-product/product-excerpt',
		'attrs'        => array( 'excerptLength' => $excerpt_length ),
		'innerBlocks'  => array(),
		'innerHTML'    => '',
		'innerContent' => array(),
	),
	array(
		'blockName'    => 'woocommerce/product-price',
		'attrs'        => array(
			'isDescendentOfQueryLoop' => true,
			'textAlign'               => 'left',
			'fontSize'                => 'small',
		),
		'innerBlocks'  => array(),
		'innerHTML'    => '',
		'innerContent' => array(),
	),
	array(
		'blockName'    => 'woocommerce/product-button',
		'attrs'        => array(
			'isDescendentOfQueryLoop' => true,
			'textAlign'               => 'left',
			'fontSize'                => 'small',
		),
		'innerBlocks'  => array(),
		'innerHTML'    => '',
		'innerContent' => array(),
	),
);

$product_template_block = array(
	'blockName'    => 'woocommerce/product-template',
	'attrs'        => array(),
	'innerBlocks'  => $product_template_inner_blocks,
	'innerHTML'    => '',
	'innerContent' => array_fill( 0, count( $product_template_inner_blocks ), null ),
);

$product_collection_attrs = array(
	'queryId'       => 0,
	'query'         => array(
		'perPage'                       => $product_ids ? count( $product_ids ) : $products_to_show,
		'pages'                         => 0,
		'offset'                        => 0,
		'postType'                      => 'product',
		// Hand-picked products keep the order they were picked in.
		'order'                         => $product_ids ? 'asc' : 'desc',
		'orderBy'                       => $product_ids ? 'post__in' : 'date',
		'search'                        => '',
		'exclude'                       => array(),
		'inherit'                       => false,
		'taxQuery'                      => $tax_query,
		'isProductCollectionBlock'      => true,
		'featured'                      => false,
		'woocommerceOnSale'             => false,
		'woocommerceStockStatus'        => array( 'instock' ),
		'woocommerceAttributes'         => array(),
		'woocommerceHandPickedProducts' => $product_ids,
		'filterable'                    => false,
	),
	'tagName'       => 'div',
	'displayLayout' => array(
		'type'          => 'flex',
		'columns'       => $columns_desktop,
		'shrinkColumns' => true,
	),
	'dimensions'    => array( 'widthType' => 'fill' ),
	'hideControls'  => array( 'inherit', 'hand-picked', 'filterable' ),
);

if ( $product_ids ) {
	$product_collection_attrs['collection'] = 'woocommerce/product-collection/hand-picked';
} elseif ( $category_id ) {
	$product_collection_attrs['collection'] = 'woocommerce/product-collection/by-category';
}

$product_collection_block = array(
	'blockName'    => 'woocommerce/product-collection',
	'attrs'        => $product_collection_attrs,
	'innerBlocks'  => array( $product_template_block ),
	'innerHTML'    => '',
	'innerContent' => array( null ),
);

$rendered_collection = render_block( $product_collection_block );

if ( '' === trim( (string) $rendered_collection ) ) {
	return;
}

// With a single column the card would fill the whole track and nothing would
// hint that there is more to the right, so these classes make the card a bit
// narrower and let the next one peek in.
$wrapper_classes = 'carmo-carousel';
if ( $hide_view_cart_link ) {
	$wrapper_classes .= ' carmo-carousel--hide-view-cart';
}
if ( 1 === $columns_mobile ) {
	$wrapper_classes .= ' carmo-carousel--peek-mobile';
}
if ( 1 === $columns_desktop ) {
	$wrapper_classes .= ' carmo-carousel--peek-desktop';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => $wrapper_classes,
		'style' => sprintf(
			'--carmo-columns-desktop:%d;--carmo-columns-mobile:%d;',
			$columns_desktop,
			$columns_mobile
		),
	)
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $carousel_title ) : ?>
		<<?php echo esc_html( $title_tag ); ?> class="carmo-carousel__title">
			<?php echo esc_html( $carousel_title ); ?>
		</<?php echo esc_html( $title_tag ); ?>>
	<?php endif; ?>
	<div class="carmo-carousel__viewport">
		<button type="button" class="carmo-carousel__nav carmo-carousel__nav--prev" aria-label="<?php esc_attr_e( 'Produtos anteriores', 'carmo-category-product' ); ?>">
			<span aria-hidden="true">&#8249;</span>
		</button>
		<div class="carmo-carousel__collection">
			<?php echo $rendered_collection; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<button type="button" class="carmo-carousel__nav carmo-carousel__nav--next" aria-label="<?php esc_attr_e( 'Produtos seguintes', 'carmo-category-product' ); ?>">
			<span aria-hidden="true">&#8250;</span>
		</button>
	</div>
</div>
