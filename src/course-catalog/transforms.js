import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/table' ],
			transform: ( attributes, innerBlocks ) => {
				const innerBlocksTemplate = attributes.body.map(
					( { cells } ) => [
						'cloudcatch/course-catalog-item',
						{
							title: new DOMParser().parseFromString(
								cells[ 0 ]?.content,
								'text/html'
							)?.firstChild?.innerText,
							// creditHours: cells[ 1 ]?.content
							// 	.match( /(.*)<a.*<\/a>(.*)/ )[ 1 ]
							// 	.replace( /[\d]+/, '{x}' ),
							titleSuffix:
								cells[ 1 ]?.content.match(
									/(.*)<a.*<\/a>(.*)/
								)[ 2 ],
							product: {
								value: cells[ 2 ]?.content.match(
									/.*add-to-cart=(\d+).*/
								)[ 1 ],
							},
						},
					]
				);

				return createBlock(
					'cloudcatch/course-catalog',
					{},
					createBlocksFromInnerBlocksTemplate( innerBlocksTemplate )
				);
			},
		},
	],
};
