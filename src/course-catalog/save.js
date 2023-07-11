import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'wp-block-course-catalog',
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					className: 'wp-block-course-catalog__items',
				} ) }
			/>
		</div>
	);
}
