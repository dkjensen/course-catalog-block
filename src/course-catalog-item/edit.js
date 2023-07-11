import { find as _find } from 'lodash';

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ExternalLink,
	TextControl,
	BaseControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import './editor.scss';
import ProductControl from './inspector-controls/product-control';

import { STORE_NAME } from '../course-catalog/store';

function Edit( props ) {
	const { attributes, setAttributes, products } = props;

	const { product, title, titleSuffix, creditHours } = attributes;

	useEffect( () => {
		if ( product?.value && null == product?.label ) {
			const foundProduct = _find(
				products,
				( el ) =>
					el?.value === product.value || el?.id === product.value
			);

			if ( foundProduct ) {
				setAttributes( { product: foundProduct } );
			}
		}
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<ProductControl
						value={ product }
						products={ products }
						onChange={ ( val ) =>
							setAttributes( { product: val } )
						}
					/>
					{ product && (
						<>
							<BaseControl>
								<p>
									{ __( 'ID' ) }: { product.value }
								</p>
								<ExternalLink href={ product.permalink }>
									{ __( 'View Product' ) }
								</ExternalLink>
							</BaseControl>
							<TextControl
								label={ __( 'Title Text' ) }
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
							/>
							<TextControl
								label={ __( 'After Title Text' ) }
								value={ titleSuffix }
								onChange={ ( value ) =>
									setAttributes( { titleSuffix: value } )
								}
							/>
							<TextControl
								label={ __( 'Credit Hours Text' ) }
								value={ creditHours }
								onChange={ ( value ) =>
									setAttributes( { creditHours: value } )
								}
								help={ __(
									'Use {x} to dynamically render the number of credit hours'
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			{ ! product && (
				<p
					{ ...useBlockProps( {
						className: 'wp-block-course-catalog-item',
					} ) }
				>
					{ __( 'Please select a product' ) }
				</p>
			) }
			{ product && (
				<div
					{ ...useBlockProps( {
						className: 'wp-block-course-catalog-item',
					} ) }
				>
					<div className="wp-block-course-catalog-item__title">
						<a href="#">{ title ? title : product.label }</a>
						{ titleSuffix && (
							<span className="wp-block-course-catalog-item__title-suffix">
								{ titleSuffix }
							</span>
						) }
					</div>
					<div className="wp-block-course-catalog-item__credits">
						{ creditHours ? creditHours : __( '{x} Credit Hours' ) }
					</div>
					<div className="wp-block-course-catalog-item__details">
						<a href="#">{ __( 'Details' ) }</a>
					</div>
					<div className="wp-block-course-catalog-item__price">
						$xx.xx
					</div>
					<div className="wp-block-course-catalog-item__cart">
						<div className="is-layout-flex wp-block-buttons">
							<div className="wp-block-button">
								<a
									href="#"
									className="wp-block-button__link wp-element-button"
								>
									{ __( 'Add to cart' ) } &gt;
								</a>
							</div>
						</div>
					</div>
				</div>
			) }
		</>
	);
}

export default compose( [
	withSelect( ( select ) => {
		return {
			products: select( STORE_NAME ).getProducts(),
		};
	} ),
] )( Edit );
