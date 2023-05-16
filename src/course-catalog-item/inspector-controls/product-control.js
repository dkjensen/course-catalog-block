import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import React from 'react'
import Select from "react-select/async";
import debounce from "debounce-promise";
import Fuse from 'fuse.js';

import { STORE_NAME } from '../../course-catalog/store';

function ProductControl({ value, onChange, products }) {
    const [fuse, setFuse] = useState(null);
    // const [products, setProducts] = useState([]);

    // use fuse to search
    const searchOptions = inputValue =>
        new Promise(resolve => {
            resolve(fuse.search(inputValue).map(c => ({ ...c.item })));
        });

    // call promiseOptions
    const loadOptions = inputValue => searchOptions(inputValue);

    // debouncer
    const debouncedLoadOptions = debounce(loadOptions, 300);

    useEffect(() => {
        setFuse(new Fuse(products, {
            keys: [
                { name: "label", weight: 0.7 },
                { name: "category_names", weight: 1 },
                { name: "slug", weight: 0.2 },
            ],
            valueKey: "label",
            maxPatternLength: 32,
            includeScore: true,
            maxResults: 25,
            // threshold: 0.4
        }));
        return () => setFuse(null);
    }, [products]);

    useEffect(() => {
        if ( products && fuse ) {
            fuse.setCollection(products);
        }
    }, [fuse, products]);

    const onProductChange = (newValue) => {
        console.log( newValue );
        onChange(newValue);
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            textOverflow: 'string'
        })
    };

    return (
        <BaseControl label={ __( 'Product' ) } __nextHasNoMarginBottom={ true }>
            <Select
                styles={customStyles}
                defaultOptions={products}
                value={value}
                onChange={onProductChange}
                loadOptions={value => debouncedLoadOptions(value)}
                className="course-catalog-select-container"
                classNamePrefix="course-catalog-select"
            />
        </BaseControl>
    );
}

export default compose( [
    withSelect( ( select ) => {
      return {
        products: select( STORE_NAME ).getProducts(),
      };
    } ),
  ] )( ProductControl );