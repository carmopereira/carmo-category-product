/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	Spinner,
	Notice,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		categoryId,
		columnsDesktop,
		columnsMobile,
		productsToShow,
		excerptLength,
		titleTag,
		hideViewCartLink,
	} = attributes;

	const blockProps = useBlockProps();

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
					{ ! hasResolvedCategories && <Spinner /> }

					{ hasResolvedCategories && categories?.length === 0 && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'Não foram encontradas categorias de produto. Confirme que o WooCommerce está ativo.',
								'carmo-category-product'
							) }
						</Notice>
					) }

					{ hasResolvedCategories && categories?.length > 0 && (
						<SelectControl
							label={ __(
								'Categoria de produto',
								'carmo-category-product'
							) }
							value={ categoryId }
							options={ categoryOptions }
							onChange={ ( value ) =>
								setAttributes( { categoryId: Number( value ) } )
							}
						/>
					) }

					<SelectControl
						label={ __(
							'Elemento do título',
							'carmo-category-product'
						) }
						help={ __(
							'O título mostra automaticamente o nome da categoria escolhida.',
							'carmo-category-product'
						) }
						value={ titleTag }
						options={ [
							{ label: __( 'H1', 'carmo-category-product' ), value: 'h1' },
							{ label: __( 'H2', 'carmo-category-product' ), value: 'h2' },
							{ label: __( 'H3', 'carmo-category-product' ), value: 'h3' },
							{
								label: __( 'Span (sem heading)', 'carmo-category-product' ),
								value: 'span',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { titleTag: value } )
						}
					/>

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
				<ServerSideRender
					block="create-block/carmo-category-product"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
