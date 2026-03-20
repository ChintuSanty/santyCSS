<?php
namespace SCB;

defined( 'ABSPATH' ) || exit;

class Renderer {

    public static function maybe_render( string $content ): string {
        if ( ! is_singular() ) return $content;
        $post_id = get_the_ID();
        if ( ! get_post_meta( $post_id, '_scb_enabled', true ) ) return $content;
        $raw = get_post_meta( $post_id, '_scb_data', true );
        if ( ! $raw ) return $content;
        $data = json_decode( $raw, true );
        if ( ! $data || empty( $data['sections'] ) ) return $content;
        return self::render_page( $data );
    }

    public static function render_page( array $data ): string {
        ob_start();
        echo '<div class="scb-page">';
        foreach ( $data['sections'] as $section ) {
            self::render_section( $section );
        }
        echo '</div>';
        return ob_get_clean();
    }

    private static function render_section( array $section ): void {
        $s = $section['settings'] ?? [];
        $classes = self::section_classes( $s );
        $style   = self::section_style( $s );
        ?>
        <section id="scb-section-<?php echo esc_attr( $section['id'] ?? '' ); ?>"
                 class="scb-section <?php echo esc_attr( $classes ); ?>"
                 style="<?php echo esc_attr( $style ); ?>">
            <div class="scb-section-inner<?php echo ! empty( $s['full_width'] ) ? '' : ' scb-container'; ?>">
                <div class="scb-row make-flex gap-<?php echo esc_attr( $s['column_gap'] ?? '24' ); ?> flex-wrap">
                    <?php foreach ( $section['columns'] ?? [] as $column ) : ?>
                        <?php self::render_column( $column ); ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php
    }

    private static function render_column( array $column ): void {
        $s   = $column['settings'] ?? [];
        $col_cls = self::col_width_class( $column['width'] ?? '1-of-1' );
        ?>
        <div class="scb-column <?php echo esc_attr( $col_cls ); ?> add-padding-<?php echo esc_attr( $s['padding'] ?? '0' ); ?>">
            <?php foreach ( $column['widgets'] ?? [] as $widget_data ) : ?>
                <?php self::render_widget( $widget_data ); ?>
            <?php endforeach; ?>
        </div>
        <?php
    }

    private static function render_widget( array $widget_data ): void {
        $type     = $widget_data['type'] ?? '';
        $settings = $widget_data['settings'] ?? [];
        $widget   = Widget_Manager::instance()->get( $type );
        if ( ! $widget ) return;

        // Gate pro widgets
        if ( $widget->get_tier() === 'pro' && ! apply_filters( 'scb_is_pro', false ) ) {
            echo '<div class="scb-pro-gate"><span>⭐ ' . esc_html( $widget->get_title() ) . ' — Pro feature</span></div>';
            return;
        }

        $mb  = $settings['margin_bottom'] ?? '24';
        echo '<div class="scb-widget add-margin-bottom-' . esc_attr( $mb ) . '">';
        $widget->render( $settings );
        echo '</div>';
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static function section_classes( array $s ): string {
        $cls = [];
        $cls[] = 'add-padding-y-' . ( $s['padding_y'] ?? '60' );
        $cls[] = 'add-padding-x-' . ( $s['padding_x'] ?? '20' );
        if ( ! empty( $s['bg_color'] ) ) $cls[] = 'background-' . $s['bg_color'];
        if ( ! empty( $s['text_color'] ) ) $cls[] = 'color-' . $s['text_color'];
        return implode( ' ', $cls );
    }

    private static function section_style( array $s ): string {
        $styles = [];
        if ( ! empty( $s['bg_image'] ) ) {
            $styles[] = 'background-image:url(' . esc_url( $s['bg_image'] ) . ')';
            $styles[] = 'background-size:cover';
            $styles[] = 'background-position:center';
        }
        if ( ! empty( $s['custom_height'] ) ) $styles[] = 'min-height:' . intval( $s['custom_height'] ) . 'px';
        return implode( ';', $styles );
    }

    private static function col_width_class( string $width ): string {
        $map = [
            '1-of-1' => 'set-width-full',
            '1-of-2' => 'set-width-1-of-2',
            '1-of-3' => 'set-width-1-of-3',
            '2-of-3' => 'set-width-2-of-3',
            '1-of-4' => 'set-width-1-of-4',
            '3-of-4' => 'set-width-3-of-4',
            '1-of-5' => 'set-width-1-of-5',
            '2-of-5' => 'set-width-2-of-5',
            '3-of-5' => 'set-width-3-of-5',
            '1-of-6' => 'set-width-1-of-6',
        ];
        return $map[ $width ] ?? 'set-width-full';
    }
}
