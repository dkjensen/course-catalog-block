import { __ } from '@wordpress/i18n';
import { PanelBody, ExternalLink, TextControl, BaseControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import './editor.scss';
import ProductControl from './inspector-controls/product-control';

export default function Edit(props) {
	const { attributes, setAttributes } = props;

	const { product, title, titleSuffix, creditHours } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings')}>
					<ProductControl value={product} onChange={(val) => setAttributes({ product: val })} />
					{product && (
						<>
							<BaseControl>
								<ExternalLink href={product.permalink}>{__('View Product')}</ExternalLink>
							</BaseControl>
							<TextControl
								label={__('Title Text')}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
							/>
							<TextControl
								label={__('After Title Text')}
								value={titleSuffix}
								onChange={(value) => setAttributes({ titleSuffix: value })}
							/>
							<TextControl
								label={__('Credit Hours Text')}
								value={creditHours}
								onChange={(value) => setAttributes({ creditHours: value })}
								help={__('Use {x} to dynamically render the number of credit hours')}
							/>
						</>

					)}
				</PanelBody>
			</InspectorControls>
			{!product && (
				<p {...useBlockProps({ className: 'wp-block-course-catalog-item' })}>{__('Please select a product')}</p>
			)}
			{product && (
				<div {...useBlockProps({ className: 'wp-block-course-catalog-item' })}>
					<div className="wp-block-course-catalog-item__title">
						<a href="#">{title ? title : product.label}</a>
						{titleSuffix && (
							<span className="wp-block-course-catalog-item__title-suffix">{titleSuffix}</span>
						)}
					</div>
					<div className="wp-block-course-catalog-item__credits">{creditHours ? creditHours : __('{x} Credit Hours')}</div>
					<div className="wp-block-course-catalog-item__details"><a href="#">{__('Details')}</a></div>
					<div className="wp-block-course-catalog-item__price">$xx.xx</div>
					<div className="wp-block-course-catalog-item__cart">
						<div className="is-layout-flex wp-block-buttons">
							<div className="wp-block-button"><a href="#" className="wp-block-button__link wp-element-button">{__('Add to cart')} &gt;</a></div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
