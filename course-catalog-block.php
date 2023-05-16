<?php
/**
 * Plugin Name:       Course Catalog Block
 * Description:		  Display row of WooCommerce products on the course catalog pages
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.0.0-development
 * Author:            CloudCatch LLC
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * WC tested up to:   3.1
 * Text Domain:       course-catalog-block
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_course_catalog_block_init() {
	register_block_type( __DIR__ . '/build/course-catalog' );
	register_block_type( __DIR__ . '/build/course-catalog-item', array(
		'render_callback'	=> 'create_block_course_catalog_item_render'
	) );
}
add_action( 'init', 'create_block_course_catalog_block_init' );

function create_block_course_catalog_item_render( $attributes, $content, $block ) {
	if ( ! function_exists( 'wc_get_product' ) ) {
		return '';
	}

	$product_id = 0;

	if ( isset( $attributes['product']['id'] ) ) {
		$product_id = $attributes['product']['id'];
	} elseif ( $attributes['product']['value'] ) {
		$product_id = $attributes['product']['value'];
	}

	$product = wc_get_product( $product_id );

	if ( ! $product || ! $product->get_id() ) {
		return '';
	}

	$attributes = wp_parse_args( $attributes, array(
		'title'	=> null,
		'creditHours' => null
	) );

	$credit_hours_num = create_block_get_product_course_hours( absint( $product->get_id() ) );

	$credit_hours_text = preg_replace( '/\{x\}/i', $credit_hours_num, ( $attributes['creditHours'] ?: esc_html__( '{x} Credit Hours', 'course-catalog-block' ) ) );

	ob_start();

	?>
	<div class="wp-block-course-catalog-item">
		<div class="wp-block-course-catalog-item__title"><a href="<?php echo esc_url( $product->get_permalink() ); ?>"><?php echo wp_kses_post( $attributes['title'] ?: $product->get_title() ); ?></a></div>
		<div class="wp-block-course-catalog-item__credits"><?php echo wp_kses_post( $credit_hours_text ); ?></div>
		<div class="wp-block-course-catalog-item__details"><a href="<?php echo esc_url( $product->get_permalink() ); ?>"><?php esc_html_e( 'Details', 'course-catalog-block' ); ?></a></div>
		<div class="wp-block-course-catalog-item__price"><?php echo wp_kses_post( $product->get_price_html() ); ?></div>
		<div class="wp-block-course-catalog-item__cart">
			<div class="is-layout-flex wp-block-buttons">
				<div class="wp-block-button"><a href="<?php echo esc_url( $product->add_to_cart_url() ); ?>" class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Add to cart', 'course-catalog-block' ); ?> &gt;</a></div>
			</div>
		</div>
	</div>

	<?php
	return ob_get_clean();
}

function create_block_course_catalog_block_products() {
	?>

	<script>
		var woocommerceCartUrl = '<?php echo esc_url( wc_get_cart_url() ); ?>';
	</script>

	<?php
}
add_action( 'admin_head', 'create_block_course_catalog_block_products' );


add_action( 'rest_api_init', function() {
	register_rest_route( 'bce/v1', '/products', array(
		'methods'	=> \WP_REST_Server::READABLE,
		'permission_callback' => '__return_true',
		'callback' => function() {
			global $wpdb;

			$terms = array();
			$states = include WC()->plugin_path() . '/i18n/states.php';
			$us_states = $states['US'];

			$products = wp_cache_get( 'bce_products' );

			if ( false === $products ) {
				$products = $wpdb->get_results( "
					SELECT p.ID, p.post_title, GROUP_CONCAT( 
						tr.term_taxonomy_id
						SEPARATOR ','
					) as categories
					FROM {$wpdb->posts} p
					LEFT JOIN {$wpdb->term_relationships} tr
						ON object_id = p.ID
					WHERE post_type = 'product'
					GROUP BY p.ID	
				" );

				wp_cache_set( 'bce_products', $products );
			}

			$_products = array();

			if ( $products ) {
				foreach ( $products as $product ) {
					$categories = [];
					$category_ids = array_map( 'intval', explode( ',', $product->categories ) );

					foreach ( $category_ids as $category ) {
						if ( array_key_exists( $category, $terms ) ) {
							$categories[] = $terms[ $category ];
						} else {
							$term = get_term( $category, 'product_cat' );

							$terms[ $category ] = $term->name ?? null;
							$categories[] = $terms[ $category ];
						}
					}

					$state_category = (array) array_filter( $categories, function( $category ) use ( $us_states ) {
						return in_array( $category, $us_states );
					} );

					$_product = [];

					$_product['label'] = $product->post_title . ( $state_category ? ' ( ' . implode( ', ', $state_category ) . ' )' : '' );
					$_product['permalink'] = add_query_arg( array( 'p' => $product->ID ), home_url() );
					$_product['category_names'] = $categories;
					$_product['value'] = $product->ID;

					$_products[] = $_product;
				}
			}

			return rest_ensure_response( $_products );
		}
	) );
} );

function create_block_get_product_course_hours( int $product_id ) {
    $courses = (array) get_post_meta( $product_id, '_related_course', true );

	$hours = 0;

    if ( ! empty( $courses ) ) {
        foreach( $courses as $course ) {
            $course_meta = get_post_meta( $course, '_sfwd-courses', true );

            if( is_array( $course_meta ) && ! empty( $course_meta['sfwd-courses_credit_hours'] ) ) {
                $hours += (float) $course_meta['sfwd-courses_credit_hours'];
            }
        }
    }

    return $hours;
}