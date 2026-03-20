<?php
namespace SCB;

defined( 'ABSPATH' ) || exit;

class Builder {

    public static function init(): void {
        add_action( 'add_meta_boxes',     [ __CLASS__, 'add_meta_box' ] );
        add_action( 'save_post',          [ __CLASS__, 'save_post' ] );
        add_action( 'admin_enqueue_scripts', [ __CLASS__, 'admin_assets' ] );
        add_action( 'wp_ajax_scb_save',   [ __CLASS__, 'ajax_save' ] );
        add_action( 'wp_ajax_scb_load',   [ __CLASS__, 'ajax_load' ] );
        add_action( 'admin_footer',       [ __CLASS__, 'builder_markup' ] );
    }

    public static function add_meta_box(): void {
        $post_types = apply_filters( 'scb_supported_post_types', [ 'page', 'post' ] );
        add_meta_box(
            'scb-builder',
            __( 'SantyCSS Builder', 'santycss-builder' ),
            [ __CLASS__, 'meta_box_html' ],
            $post_types,
            'normal',
            'high'
        );
    }

    public static function meta_box_html( \WP_Post $post ): void {
        $enabled = (bool) get_post_meta( $post->ID, '_scb_enabled', true );
        wp_nonce_field( 'scb_save', 'scb_nonce' );
        ?>
        <div id="scb-meta-box" data-post-id="<?php echo esc_attr( $post->ID ); ?>">
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-weight:600;">
                <input type="checkbox" id="scb-enabled" name="scb_enabled" value="1" <?php checked( $enabled ); ?>>
                <?php _e( 'Enable SantyCSS Builder for this page', 'santycss-builder' ); ?>
            </label>
            <div id="scb-launch-wrap" style="<?php echo $enabled ? '' : 'opacity:.5;pointer-events:none'; ?>">
                <button type="button" id="scb-open-builder" class="button button-primary button-hero" style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:18px;">⚡</span>
                    <?php _e( 'Open SantyCSS Builder', 'santycss-builder' ); ?>
                </button>
                <p class="description" style="margin-top:8px;">
                    <?php _e( 'Visual drag-and-drop editor powered by SantyCSS — plain-English utility classes.', 'santycss-builder' ); ?>
                </p>
            </div>
            <input type="hidden" id="scb-data" name="scb_data" value="<?php echo esc_attr( get_post_meta( $post->ID, '_scb_data', true ) ); ?>">
        </div>
        <script>
        document.getElementById('scb-enabled').addEventListener('change', function(){
            document.getElementById('scb-launch-wrap').style.cssText = this.checked ? '' : 'opacity:.5;pointer-events:none';
        });
        document.getElementById('scb-open-builder').addEventListener('click', function(){
            SCBBuilder.open(<?php echo (int) $post->ID; ?>);
        });
        </script>
        <?php
    }

    public static function save_post( int $post_id ): void {
        if ( ! isset( $_POST['scb_nonce'] ) ) return;
        if ( ! wp_verify_nonce( $_POST['scb_nonce'], 'scb_save' ) ) return;
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
        if ( ! current_user_can( 'edit_post', $post_id ) ) return;

        update_post_meta( $post_id, '_scb_enabled', isset( $_POST['scb_enabled'] ) ? 1 : 0 );
        if ( isset( $_POST['scb_data'] ) ) {
            $data = wp_unslash( $_POST['scb_data'] );
            // Validate JSON
            json_decode( $data );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                update_post_meta( $post_id, '_scb_data', $data );
            }
        }
    }

    public static function ajax_save(): void {
        check_ajax_referer( 'scb_nonce', 'nonce' );
        $post_id = absint( $_POST['post_id'] ?? 0 );
        if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
            wp_send_json_error( 'Permission denied' );
        }
        $data = wp_unslash( $_POST['data'] ?? '' );
        json_decode( $data );
        if ( json_last_error() !== JSON_ERROR_NONE ) {
            wp_send_json_error( 'Invalid JSON' );
        }
        update_post_meta( $post_id, '_scb_data', $data );
        update_post_meta( $post_id, '_scb_enabled', 1 );
        wp_send_json_success( [ 'saved' => true ] );
    }

    public static function ajax_load(): void {
        check_ajax_referer( 'scb_nonce', 'nonce' );
        $post_id = absint( $_GET['post_id'] ?? 0 );
        if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
            wp_send_json_error( 'Permission denied' );
        }
        wp_send_json_success( [
            'data'    => get_post_meta( $post_id, '_scb_data', true ) ?: '{"sections":[]}',
            'widgets' => Widget_Manager::instance()->get_definitions(),
        ] );
    }

    public static function admin_assets( string $hook ): void {
        if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) return;
        $screen = get_current_screen();
        $supported = apply_filters( 'scb_supported_post_types', [ 'page', 'post' ] );
        if ( ! $screen || ! in_array( $screen->post_type, $supported, true ) ) return;

        wp_enqueue_media();
        wp_enqueue_style( 'santycss',    SCB_ASSETS . 'vendor/santy.min.css', [], SCB_VERSION );
        wp_enqueue_style( 'scb-builder', SCB_ASSETS . 'css/builder.css',      [], SCB_VERSION );
        wp_enqueue_script( 'scb-builder', SCB_ASSETS . 'js/builder.js',       [], SCB_VERSION, true );

        wp_localize_script( 'scb-builder', 'SCB_CONFIG', [
            'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
            'nonce'    => wp_create_nonce( 'scb_nonce' ),
            'assetsUrl'=> SCB_ASSETS,
            'isPro'    => apply_filters( 'scb_is_pro', false ),
            'widgets'  => Widget_Manager::instance()->get_definitions(),
            'l10n'     => [
                'saved'     => __( 'Saved!', 'santycss-builder' ),
                'saving'    => __( 'Saving…', 'santycss-builder' ),
                'proLabel'  => __( 'PRO', 'santycss-builder' ),
                'dragHere'  => __( 'Drag a widget here', 'santycss-builder' ),
                'addSection'=> __( '+ Add Section', 'santycss-builder' ),
            ],
        ] );
    }

    public static function builder_markup(): void {
        $screen = get_current_screen();
        if ( ! $screen || ! in_array( $screen->base, [ 'post' ], true ) ) return;
        // The full builder overlay is rendered by builder.js — no PHP markup needed
    }
}
