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
        $s       = $section['settings'] ?? [];
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
        $s       = $column['settings'] ?? [];
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

        // Inner Section — rendered structurally, not by the widget class
        if ( $type === 'inner-section' ) {
            self::render_inner_section( $widget_data );
            return;
        }

        $widget = Widget_Manager::instance()->get( $type );
        if ( ! $widget ) return;

        // ── Build wrapper attributes from Advanced-tab settings ────────────────
        $wrapper_style   = self::build_wrapper_style( $settings );
        $wrapper_classes = self::build_wrapper_classes( $settings );
        $css_id          = ! empty($settings['_css_id']) ? ' id="' . esc_attr( sanitize_html_class($settings['_css_id']) ) . '"' : '';
        $anim            = ! empty($settings['_entrance_animation']) && $settings['_entrance_animation'] !== 'none'
                           ? esc_attr($settings['_entrance_animation']) : '';
        $anim_dur        = intval($settings['_anim_duration'] ?? 600);
        $anim_del        = intval($settings['_anim_delay']    ?? 0);
        $data_anim       = $anim ? " data-scb-anim=\"{$anim}\" data-scb-dur=\"{$anim_dur}\" data-scb-del=\"{$anim_del}\"" : '';

        echo '<div class="scb-widget ' . esc_attr($wrapper_classes) . '"'
             . $css_id . $data_anim
             . ( $wrapper_style ? ' style="' . esc_attr($wrapper_style) . '"' : '' ) . '>';
        $widget->render( $settings );
        echo '</div>';
    }

    private static function render_inner_section( array $widget_data ): void {
        $s       = $widget_data['settings']      ?? [];
        $cols    = $widget_data['inner_columns'] ?? [];
        $gap     = $s['column_gap']  ?? '20';
        $align   = $s['align_items'] ?? 'stretch';
        $cnt     = count($cols);
        $frac    = $cnt > 0 ? '1-of-' . $cnt : '1-of-2';
        echo '<div class="scb-inner-section make-flex flex-wrap gap-' . esc_attr($gap) . '" style="align-items:' . esc_attr($align) . ';">';
        foreach ( $cols as $col ) {
            $col_cls = ( $cnt > 1 ) ? 'set-width-' . $frac : 'set-width-full';
            echo '<div class="scb-inner-col ' . esc_attr($col_cls) . '">';
            foreach ( $col['widgets'] ?? [] as $nested ) {
                self::render_widget( $nested );
            }
            echo '</div>';
        }
        echo '</div>';
    }

    // ── Advanced wrapper style builder ─────────────────────────────────────────

    private static function build_wrapper_style( array $s ): string {
        $css = [];

        // Spacing
        if ( !empty($s['_pt']) || $s['_pt'] === 0 ) $css[] = 'padding-top:'    . intval($s['_pt']) . 'px';
        if ( !empty($s['_pr']) || $s['_pr'] === 0 ) $css[] = 'padding-right:'  . intval($s['_pr']) . 'px';
        if ( !empty($s['_pb']) || $s['_pb'] === 0 ) $css[] = 'padding-bottom:' . intval($s['_pb']) . 'px';
        if ( !empty($s['_pl']) || $s['_pl'] === 0 ) $css[] = 'padding-left:'   . intval($s['_pl']) . 'px';
        if ( isset($s['_mt']) && $s['_mt'] != 0 )   $css[] = 'margin-top:'     . intval($s['_mt']) . 'px';
        $mb = isset($s['_mb']) ? intval($s['_mb']) : 24;
        $css[] = 'margin-bottom:' . $mb . 'px';

        // Background
        $bg_type = $s['_bg_type'] ?? 'none';
        if ( $bg_type === 'color' && !empty($s['_bg_color']) ) {
            $css[] = 'background:' . esc_attr($s['_bg_color']);
        } elseif ( $bg_type === 'gradient' ) {
            $from  = esc_attr($s['_bg_grad_from'] ?? '#667eea');
            $to    = esc_attr($s['_bg_grad_to']   ?? '#764ba2');
            $angle = intval($s['_bg_grad_angle']   ?? 135);
            $css[] = "background:linear-gradient({$angle}deg,{$from},{$to})";
        } elseif ( $bg_type === 'image' && !empty($s['_bg_image']['url']) ) {
            $url  = esc_url($s['_bg_image']['url']);
            $size = esc_attr($s['_bg_size']     ?? 'cover');
            $pos  = esc_attr($s['_bg_position'] ?? 'center center');
            $att  = !empty($s['_bg_fixed']) ? 'fixed' : 'scroll';
            $css[] = "background-image:url({$url});background-size:{$size};background-position:{$pos};background-attachment:{$att}";
        }

        // Border
        $b_type = $s['_border_type'] ?? 'none';
        if ( $b_type !== 'none' ) {
            $bw = intval($s['_border_width'] ?? 1);
            $bc = esc_attr($s['_border_color'] ?? '#e2e8f0');
            $css[] = "border:{$bw}px {$b_type} {$bc}";
        }
        $tl = intval($s['_border_radius_tl'] ?? 0);
        $tr = intval($s['_border_radius_tr'] ?? 0);
        $br = intval($s['_border_radius_br'] ?? 0);
        $bl = intval($s['_border_radius_bl'] ?? 0);
        if ( $tl || $tr || $br || $bl ) {
            $css[] = "border-radius:{$tl}px {$tr}px {$br}px {$bl}px";
        }

        // Shadow
        if ( !empty($s['_box_shadow']) ) {
            $sh    = intval($s['_shadow_h']      ?? 0);
            $sv    = intval($s['_shadow_v']      ?? 4);
            $sb    = intval($s['_shadow_blur']   ?? 10);
            $ss    = intval($s['_shadow_spread'] ?? 0);
            $sc    = esc_attr($s['_shadow_color'] ?? 'rgba(0,0,0,0.1)');
            $inset = !empty($s['_shadow_inset']) ? 'inset ' : '';
            $css[] = "box-shadow:{$inset}{$sh}px {$sv}px {$sb}px {$ss}px {$sc}";
        }

        // Opacity & Transform
        $opacity = isset($s['_opacity']) ? intval($s['_opacity']) : 100;
        if ( $opacity !== 100 ) $css[] = 'opacity:' . ($opacity / 100);
        $transforms = [];
        $rotate = intval($s['_rotate'] ?? 0);
        $scale  = intval($s['_scale']  ?? 100);
        $skewx  = intval($s['_skew_x'] ?? 0);
        $skewy  = intval($s['_skew_y'] ?? 0);
        if ( $rotate ) $transforms[] = "rotate({$rotate}deg)";
        if ( $scale !== 100 ) $transforms[] = 'scale(' . ($scale/100) . ')';
        if ( $skewx ) $transforms[] = "skewX({$skewx}deg)";
        if ( $skewy ) $transforms[] = "skewY({$skewy}deg)";
        if ( $transforms ) $css[] = 'transform:' . implode(' ', $transforms);

        return implode(';', $css);
    }

    private static function build_wrapper_classes( array $s ): string {
        $cls = [];
        if ( !empty($s['_hide_desktop']) ) $cls[] = 'scb-hide-desktop';
        if ( !empty($s['_hide_tablet'])  ) $cls[] = 'scb-hide-tablet';
        if ( !empty($s['_hide_mobile'])  ) $cls[] = 'scb-hide-mobile';
        if ( !empty($s['_css_class']) ) {
            foreach ( explode(' ', $s['_css_class']) as $c ) {
                $c = sanitize_html_class(trim($c));
                if ($c) $cls[] = $c;
            }
        }
        return implode(' ', $cls);
    }

    // ── Section helpers ────────────────────────────────────────────────────────

    private static function section_classes( array $s ): string {
        $cls = [];
        $cls[] = 'add-padding-y-' . ( $s['padding_y'] ?? '60' );
        $cls[] = 'add-padding-x-' . ( $s['padding_x'] ?? '20' );
        if ( ! empty( $s['bg_color'] ) )   $cls[] = 'background-' . $s['bg_color'];
        if ( ! empty( $s['text_color'] ) ) $cls[] = 'color-'      . $s['text_color'];
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
