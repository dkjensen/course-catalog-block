import { useRef, useCallback, createContext } from '@wordpress/element';
import React from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';

import MenuItem from './menu-item';

export const MenuContext = createContext( {} );

const MenuList = ( { options, children, getValue } ) => {
	const listRef = useRef( null );
	const sizeMap = useRef( {} );
	const setSize = useCallback( ( index, size ) => {
		sizeMap.current = { ...sizeMap.current, [ index ]: size };
	}, [] );
	const getSize = useCallback( ( index ) => {
		return sizeMap.current[ index ] || 50;
	}, [] );
	const lineHeight = 80;
	const maxHeight =
		Math.min( children.length * lineHeight, 300 ) || lineHeight;

	return (
		<MenuContext.Provider value={ { setSize } }>
			<List
				height={ maxHeight }
				itemCount={ children.length }
				itemSize={ getSize }
				width="100%"
				ref={ listRef }
			>
				{ ( { index, style } ) => (
					<div style={ style }>
						<MenuItem index={ index } message={ index } />
					</div>
				) }
			</List>
		</MenuContext.Provider>
	);
};

MenuList.propTypes = {
	options: PropTypes.array.isRequired,
	children: PropTypes.any.isRequired,
	getValue: PropTypes.func.isRequired,
};

export default MenuList;
