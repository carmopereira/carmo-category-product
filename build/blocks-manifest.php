<?php
// This file is generated. Do not modify it manually.
return array(
	'carmo-category-product' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/carmo-category-product',
		'version' => '0.1.23',
		'title' => 'Carmo Category Product',
		'category' => 'widgets',
		'icon' => 'slides',
		'description' => 'Carousel de produtos WooCommerce filtrado por categoria, com número de colunas configurável para desktop e mobile.',
		'example' => array(
			
		),
		'attributes' => array(
			'categoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'columnsDesktop' => array(
				'type' => 'number',
				'default' => 4
			),
			'columnsMobile' => array(
				'type' => 'number',
				'default' => 2
			),
			'productsToShow' => array(
				'type' => 'number',
				'default' => 8
			),
			'excerptLength' => array(
				'type' => 'number',
				'default' => 80
			),
			'titleTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'hideViewCartLink' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'textdomain' => 'carmo-category-product',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'carmo-product-excerpt' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'carmo-category-product/product-excerpt',
		'version' => '0.1.0',
		'title' => 'Carmo Product Excerpt',
		'category' => 'woocommerce',
		'icon' => 'excerpt-view',
		'description' => 'Descrição do produto truncada por caracteres, sem cortar palavras a meio. Uso interno do bloco Carmo Category Product dentro do Product Collection.',
		'usesContext' => array(
			'postId'
		),
		'attributes' => array(
			'excerptLength' => array(
				'type' => 'number',
				'default' => 80
			)
		),
		'supports' => array(
			'html' => false,
			'inserter' => false
		),
		'textdomain' => 'carmo-category-product',
		'render' => 'file:./render.php'
	)
);
