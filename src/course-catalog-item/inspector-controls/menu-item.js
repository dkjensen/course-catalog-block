import { useContext, useRef, useEffect } from '@wordpress/element';
import React from 'react';
import { MenuContext } from './menu-list';

const MenuItem = ( { message, index } ) => {
	const { setSize } = useContext( MenuContext );
	const root = useRef();
	useEffect( () => {
		setSize( index, root.current.getBoundingClientRect().height );
	}, [] );
	return (
		<div ref={ root } className="message">
			{ message }
		</div>
	);
};
export default MenuItem;
