import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect, withSelect, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';

import './editor.scss';

const ALLOWED_BLOCKS = [ 'cloudcatch/course-catalog-item' ];

function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;

	const { getBlocksByClientId } = select( blockEditorStore );

	const { replaceInnerBlocks, selectBlock } =
		useDispatch( 'core/block-editor' );

	const RenderAddItemButton = () => {
		return (
			<button
				className="wp-block-course-catalog-add"
				onClick={ addItem }
			>
				{ __( 'Add Product' ) }
			</button>
		);
	};

	const addItem = () => {
		const parentBlock = getBlocksByClientId( clientId )[ 0 ];
		let _innerBlocks = parentBlock.innerBlocks;

		const insertedBlock = createBlock( 'cloudcatch/course-catalog-item' );

		_innerBlocks = [
			..._innerBlocks,
			...[ insertedBlock ],
		];

		replaceInnerBlocks( clientId, _innerBlocks );
		selectBlock( insertedBlock.clientId );
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wp-block-course-catalog__items',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			renderAppender: false,
			orientation: 'vertical',
		}
	);

	return (
		<div { ...useBlockProps() }>
			<div { ...innerBlocksProps } />
			<RenderAddItemButton />
		</div>
	);
}

export default withSelect( ( _select, blockData ) => {
	return {
		innerBlocks: _select( 'core/block-editor' ).getBlocks(
			blockData.clientId
		),
	};
} )( Edit );
