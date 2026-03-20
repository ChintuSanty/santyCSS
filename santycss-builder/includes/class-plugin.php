<?php
namespace SCB;

defined( 'ABSPATH' ) || exit;

final class Plugin {

    private static $instance = null;

    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    private function load_dependencies() {
        require_once SCB_DIR . 'includes/class-widget-manager.php';
        require_once SCB_DIR . 'includes/class-builder.php';
        require_once SCB_DIR . 'includes/class-renderer.php';
        require_once SCB_DIR . 'includes/widgets/class-widget-base.php';
        // Load all free widgets
        foreach ( glob( SCB_DIR . 'includes/widgets/free/*.php' ) as $file ) {
            require_once $file;
        }
        // Load pro widgets (gated at render time)
        foreach ( glob( SCB_DIR . 'includes/widgets/pro/*.php' ) as $file ) {
            require_once $file;
        }
    }

    private function init_hooks() {
        add_action( 'init',            [ $this, 'register_post_meta' ] );
        add_action( 'plugins_loaded',  [ $this, 'register_widgets' ] );
        add_action( 'admin_menu',      [ $this, 'add_menu' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'frontend_assets' ] );
        add_filter( 'the_content',     [ Renderer::class, 'maybe_render' ] );
        Builder::init();
    }

    public function register_post_meta() {
        $post_types = apply_filters( 'scb_supported_post_types', [ 'page', 'post' ] );
        foreach ( $post_types as $pt ) {
            register_post_meta( $pt, '_scb_data', [
                'single'        => true,
                'type'          => 'string',
                'auth_callback' => fn() => current_user_can( 'edit_posts' ),
                'show_in_rest'  => false,
            ] );
            register_post_meta( $pt, '_scb_enabled', [
                'single'        => true,
                'type'          => 'boolean',
                'auth_callback' => fn() => current_user_can( 'edit_posts' ),
            ] );
        }
    }

    public function register_widgets() {
        $mgr = Widget_Manager::instance();
        // Free widgets
        $mgr->register( new Widgets\Free\Heading() );
        $mgr->register( new Widgets\Free\Text_Editor() );
        $mgr->register( new Widgets\Free\Image() );
        $mgr->register( new Widgets\Free\Button() );
        $mgr->register( new Widgets\Free\Video() );
        $mgr->register( new Widgets\Free\Divider() );
        $mgr->register( new Widgets\Free\Spacer() );
        $mgr->register( new Widgets\Free\Icon() );
        $mgr->register( new Widgets\Free\Image_Box() );
        $mgr->register( new Widgets\Free\Icon_Box() );
        $mgr->register( new Widgets\Free\Testimonial() );
        $mgr->register( new Widgets\Free\Tabs() );
        $mgr->register( new Widgets\Free\Accordion() );
        $mgr->register( new Widgets\Free\Toggle() );
        $mgr->register( new Widgets\Free\Social_Icons() );
        $mgr->register( new Widgets\Free\Progress_Bar() );
        $mgr->register( new Widgets\Free\Countdown() );
        $mgr->register( new Widgets\Free\Alert() );
        $mgr->register( new Widgets\Free\Image_Carousel() );
        $mgr->register( new Widgets\Free\Counter() );
        $mgr->register( new Widgets\Free\Google_Maps() );
        $mgr->register( new Widgets\Free\Html() );
        $mgr->register( new Widgets\Free\Shortcode() );
        $mgr->register( new Widgets\Free\Posts_Grid() );
        $mgr->register( new Widgets\Free\Star_Rating() );
        $mgr->register( new Widgets\Free\Call_To_Action_Free() );
        // Pro widgets
        $mgr->register( new Widgets\Pro\Contact_Form() );
        $mgr->register( new Widgets\Pro\Hero_Slider() );
        $mgr->register( new Widgets\Pro\Flip_Box() );
        $mgr->register( new Widgets\Pro\Call_To_Action() );
        $mgr->register( new Widgets\Pro\Portfolio_Gallery() );
        $mgr->register( new Widgets\Pro\Login_Form() );
        $mgr->register( new Widgets\Pro\Animated_Headline() );
        $mgr->register( new Widgets\Pro\Price_Table() );
        $mgr->register( new Widgets\Pro\Team_Member() );
        $mgr->register( new Widgets\Pro\Faq() );
        $mgr->register( new Widgets\Pro\Timeline() );
        $mgr->register( new Widgets\Pro\Stat_Cards() );
        $mgr->register( new Widgets\Pro\Woo_Products() );
        $mgr->register( new Widgets\Pro\Hotspot() );
        $mgr->register( new Widgets\Pro\Code_Highlight() );
        $mgr->register( new Widgets\Pro\Scroll_To_Top() );
    }

    public function add_menu() {
        add_options_page(
            __( 'SantyCSS Builder', 'santycss-builder' ),
            __( 'SantyCSS Builder', 'santycss-builder' ),
            'manage_options',
            'santycss-builder',
            [ $this, 'settings_page' ]
        );
    }

    public function settings_page() {
        echo '<div class="wrap"><h1>SantyCSS Builder Settings</h1><p>Version ' . esc_html( SCB_VERSION ) . '</p></div>';
    }

    public function frontend_assets() {
        global $post;
        if ( ! $post || ! get_post_meta( $post->ID, '_scb_enabled', true ) ) return;
        wp_enqueue_style( 'santycss', SCB_ASSETS . 'vendor/santy.min.css', [], SCB_VERSION );
        wp_enqueue_style( 'scb-frontend', SCB_ASSETS . 'css/frontend.css', [ 'santycss' ], SCB_VERSION );
        wp_enqueue_script( 'scb-frontend', SCB_ASSETS . 'js/frontend.js', [], SCB_VERSION, true );
    }
}
