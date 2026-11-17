/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Disabled,
	FormTokenField,
	PanelBody,
	RangeControl,
	SelectControl,
	Spinner,
	Notice,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Token shown in the product picker: the product name plus its ID, so two
 * products with the same name stay distinguishable and the ID can be read
 * back from the token.
 *
 * @param {Object} product Product record from the REST API.
 * @return {string} Token label.
 */
function getProductToken( product ) {
	const title = decodeEntities( product?.title?.rendered || '' ).trim();

	return `${ title || __( '(sem nome)', 'carmo-category-product' ) } (#${
		product.id
	})`;
}

/**
 * Reads the product ID back from a token produced by getProductToken().
 *
 * @param {string} token Token label.
 * @return {number} Product ID, or 0 when the token carries none.
 */
function getTokenProductId( token ) {
	const match = /\(#(\d+)\)$/.exec( String( token ).trim() );

	return match ? Number( match[ 1 ] ) : 0;
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	// This block is a product collection of its own. Inside WooCommerce's
	// Product Collection block, which hides itself when it has no Product
	// Template with results, the whole section disappears on the site.
	const isInsideProductCollection = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockParentsByBlockName(
				clientId,
				'woocommerce/product-collection'
			).length > 0,
		[ clientId ]
	);

	const {
		source,
		productIds,
		customTitle,
		eyebrow,
		eyebrowClass,
		categoryId,
		columnsDesktop,
		columnsMobile,
		productsToShow,
		excerptLength,
		titleTag,
		cardsAlign,
		hideViewCartLink,
	} = attributes;

	const blockProps = useBlockProps();
	const isHandPicked = source === 'handpicked';
	const [ productSearch, setProductSearch ] = useState( '' );

	// Products for the hand-picked picker: the ones already chosen (to show
	// their names) and the ones matching what is being typed.
	const { pickedProducts, foundProducts } = useSelect(
		( select ) => {
			if ( ! isHandPicked ) {
				return { pickedProducts: [], foundProducts: [] };
			}

			const { getEntityRecords } = select( coreStore );
			const base = { status: 'publish', _fields: 'id,title' };

			return {
				pickedProducts: productIds.length
					? getEntityRecords( 'postType', 'product', {
							...base,
							include: productIds,
							per_page: Math.min( productIds.length, 100 ),
					  } )
					: [],
				foundProducts: getEntityRecords( 'postType', 'product', {
					...base,
					search: productSearch,
					per_page: 20,
				} ),
			};
		},
		[ isHandPicked, productIds, productSearch ]
	);

	const pickedTokenById = Object.fromEntries(
		( pickedProducts || [] ).map( ( product ) => [
			product.id,
			getProductToken( product ),
		] )
	);
	const productTokens = productIds.map(
		( id ) => pickedTokenById[ id ] || `(#${ id })`
	);
	const productSuggestions = ( foundProducts || [] )
		.filter( ( product ) => ! productIds.includes( product.id ) )
		.map( getProductToken );

	const { categories, hasResolvedCategories } = useSelect( ( select ) => {
		const query = { per_page: -1, hide_empty: false };

		return {
			categories: select( coreStore ).getEntityRecords(
				'taxonomy',
				'product_cat',
				query
			),
			hasResolvedCategories: select( coreStore ).hasFinishedResolution(
				'getEntityRecords',
				[ 'taxonomy', 'product_cat', query ]
			),
		};
	}, [] );

	const categoryOptions = [
		{
			label: __( 'Todas as categorias', 'carmo-category-product' ),
			value: 0,
		},
		...( categories || [] ).map( ( category ) => ( {
			label: category.name,
			value: category.id,
		} ) ),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Definições do carousel',
						'carmo-category-product'
					) }
				>
					<SelectControl
						label={ __(
							'Origem dos produtos',
							'carmo-category-product'
						) }
						value={ source }
						options={ [
							{
								label: __(
									'Categoria de produto',
									'carmo-category-product'
								),
								value: 'category',
							},
							{
								label: __(
									'Produtos escolhidos',
									'carmo-category-product'
								),
								value: 'handpicked',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { source: value } )
						}
					/>

					{ isHandPicked && (
						<>
							<FormTokenField
								label={ __(
									'Produtos',
									'carmo-category-product'
								) }
								value={ productTokens }
								suggestions={ productSuggestions }
								onInputChange={ setProductSearch }
								onChange={ ( tokens ) => {
									// Clear the search so the suggestions list resets
									// after a product is picked.
									setProductSearch( '' );
									setAttributes( {
										productIds: [
											...new Set(
												tokens
													.map( getTokenProductId )
													.filter( Boolean )
											),
										],
									} );
								} }
								__experimentalValidateInput={ ( token ) =>
									getTokenProductId( token ) > 0
								}
								__experimentalExpandOnFocus
								__experimentalShowHowTo={ false }
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<p className="carmo-carousel-editor__help">
								{ __(
									'Escreva para procurar produtos. Aparecem no carousel pela ordem em que os escolher.',
									'carmo-category-product'
								) }
							</p>
							<TextControl
								label={ __(
									'Título (opcional)',
									'carmo-category-product'
								) }
								value={ customTitle }
								onChange={ ( value ) =>
									setAttributes( { customTitle: value } )
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					) }

					{ ! isHandPicked && ! hasResolvedCategories && <Spinner /> }

					{ ! isHandPicked &&
						hasResolvedCategories &&
						categories?.length === 0 && (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Não foram encontradas categorias de produto. Confirme que o WooCommerce está ativo.',
									'carmo-category-product'
								) }
							</Notice>
						) }

					{ ! isHandPicked &&
						hasResolvedCategories &&
						categories?.length > 0 && (
							<SelectControl
								label={ __(
									'Categoria de produto',
									'carmo-category-product'
								) }
								value={ categoryId }
								options={ categoryOptions }
								onChange={ ( value ) =>
									setAttributes( {
										categoryId: Number( value ),
									} )
								}
							/>
						) }

					<TextControl
						label={ __(
							'Subtítulo (opcional)',
							'carmo-category-product'
						) }
						help={ __(
							'Texto curto por cima do título, por exemplo «Produtos».',
							'carmo-category-product'
						) }
						value={ eyebrow }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>

					{ !! eyebrow && (
						<TextControl
							label={ __(
								'Classe CSS do subtítulo',
								'carmo-category-product'
							) }
							help={ __(
								'Opcional. Uma ou mais classes do tema para dar estilo ao subtítulo, separadas por espaços.',
								'carmo-category-product'
							) }
							value={ eyebrowClass }
							onChange={ ( value ) =>
								setAttributes( { eyebrowClass: value } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }

					<SelectControl
						label={ __(
							'Elemento do título',
							'carmo-category-product'
						) }
						help={
							isHandPicked
								? __(
										'Usado quando preenche o título acima.',
										'carmo-category-product'
								  )
								: __(
										'O título mostra automaticamente o nome da categoria escolhida.',
										'carmo-category-product'
								  )
						}
						value={ titleTag }
						options={ [
							{
								label: __( 'H1', 'carmo-category-product' ),
								value: 'h1',
							},
							{
								label: __( 'H2', 'carmo-category-product' ),
								value: 'h2',
							},
							{
								label: __( 'H3', 'carmo-category-product' ),
								value: 'h3',
							},
							{
								label: __(
									'Span (sem heading)',
									'carmo-category-product'
								),
								value: 'span',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { titleTag: value } )
						}
					/>

					{ ! isHandPicked && (
						<RangeControl
							label={ __(
								'Produtos a mostrar',
								'carmo-category-product'
							) }
							value={ productsToShow }
							onChange={ ( value ) =>
								setAttributes( { productsToShow: value } )
							}
							min={ 2 }
							max={ 24 }
						/>
					) }

					<RangeControl
						label={ __(
							'Colunas (desktop)',
							'carmo-category-product'
						) }
						value={ columnsDesktop }
						onChange={ ( value ) =>
							setAttributes( { columnsDesktop: value } )
						}
						min={ 1 }
						max={ 6 }
					/>

					<RangeControl
						label={ __(
							'Colunas (mobile)',
							'carmo-category-product'
						) }
						value={ columnsMobile }
						onChange={ ( value ) =>
							setAttributes( { columnsMobile: value } )
						}
						min={ 1 }
						max={ 3 }
					/>

					<SelectControl
						label={ __(
							'Alinhamento dos cards',
							'carmo-category-product'
						) }
						help={ __(
							'Onde ficam os cards quando não chegam para encher a linha.',
							'carmo-category-product'
						) }
						value={ cardsAlign }
						options={ [
							{
								label: __( 'Esquerda', 'carmo-category-product' ),
								value: 'left',
							},
							{
								label: __( 'Centro', 'carmo-category-product' ),
								value: 'center',
							},
							{
								label: __( 'Direita', 'carmo-category-product' ),
								value: 'right',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { cardsAlign: value } )
						}
					/>

					<RangeControl
						label={ __(
							'Limite de caracteres da descrição',
							'carmo-category-product'
						) }
						help={ __(
							'Define 0 para não mostrar descrição.',
							'carmo-category-product'
						) }
						value={ excerptLength }
						onChange={ ( value ) =>
							setAttributes( { excerptLength: value } )
						}
						min={ 0 }
						max={ 300 }
						step={ 10 }
					/>

					<ToggleControl
						label={ __(
							'Mostrar link "Ver carrinho" após adicionar',
							'carmo-category-product'
						) }
						checked={ ! hideViewCartLink }
						onChange={ ( value ) =>
							setAttributes( { hideViewCartLink: ! value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ isInsideProductCollection && (
					<Notice status="error" isDismissible={ false }>
						{ __(
							'Este carousel está dentro de um bloco Product Collection e por isso não aparece no site: o WooCommerce esconde a coleção inteira. Move-o para fora, por exemplo para um Grupo.',
							'carmo-category-product'
						) }
					</Notice>
				) }
				{ /*
				 * The preview is the real front-end markup, full of product
				 * links and add-to-cart buttons. Left clickable, a click
				 * navigates the editor canvas iframe away and crashes the
				 * editor, so the preview is made inert.
				 */ }
				<Disabled>
					<ServerSideRender
						block="create-block/carmo-category-product"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
