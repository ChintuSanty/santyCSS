<?php
/**
 * Plugin Name:       SantyCSS Builder
 * Plugin URI:        https://santycss.santy.in
 * Description:       Drag-and-drop WordPress page builder powered by SantyCSS — plain-English utility classes. Free + Pro widgets inspired by Elementor, Elementor Pro, and Elementor Essentials.
 * Version:           1.0.0
 * Author:            SantyChintu
 * Author URI:        https://santy.in
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       santycss-builder
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

defined( 'ABSPATH' ) || exit;

define( 'SCB_VERSION',   '1.0.0' );
define( 'SCB_FILE',      __FILE__ );
define( 'SCB_DIR',       plugin_dir_path( __FILE__ ) );
define( 'SCB_URL',       plugin_dir_url( __FILE__ ) );
define( 'SCB_ASSETS',    SCB_URL  . 'assets/' );

// ── Autoloader ────────────────────────────────────────────────────────────────
spl_autoload_register( function( $class ) {
    $prefix = 'SCB\\';
    if ( strpos( $class, $prefix ) !== 0 ) return;
    $rel  = str_replace( [ $prefix, '\\' ], [ '', '/' ], $class );
    $file = SCB_DIR . 'includes/' . strtolower( $rel ) . '.php';
    // Map class name to kebab-case filename
    $file = preg_replace_callback( '/([A-Z])/', fn($m) => '-' . strtolower($m[1]), $file );
    $file = str_replace( '/-', '/', ltrim( $file, '-' ) );
    if ( file_exists( $file ) ) require_once $file;
} );

require_once SCB_DIR . 'includes/class-plugin.php';

function santycss_builder() {
    return \SCB\Plugin::instance();
}
santycss_builder();
