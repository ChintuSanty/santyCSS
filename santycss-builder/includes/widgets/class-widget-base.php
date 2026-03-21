<?php
namespace SCB\Widgets;

defined( 'ABSPATH' ) || exit;

abstract class Widget_Base {

    abstract public function get_type(): string;
    abstract public function get_title(): string;
    abstract public function get_icon(): string;
    abstract public function get_category(): string;
    /** Content-tab controls — override per widget */
    abstract public function get_controls(): array;
    abstract public function render( array $settings ): void;

    public function get_tier(): string { return 'free'; }

    /** Widget-specific Style-tab controls — override per widget */
    public function get_style_controls(): array { return []; }

    /** Returns ALL controls (content + style + advanced) for the builder */
    public function get_all_controls(): array {
        return array_merge(
            $this->get_controls(),
            $this->get_style_controls(),
            $this->get_advanced_controls()
        );
    }

    public function get_defaults(): array {
        $defaults = [];
        foreach ( $this->get_all_controls() as $ctrl ) {
            if ( isset( $ctrl['key'], $ctrl['default'] ) ) {
                $defaults[ $ctrl['key'] ] = $ctrl['default'];
            }
        }
        return $defaults;
    }

    // ── Tab helpers ──────────────────────────────────────────────────────────

    /** Tag a control to appear in a specific tab ('content'|'style'|'advanced') */
    protected function set_tab( string $tab, array $ctrl ): array {
        $ctrl['tab'] = $tab;
        return $ctrl;
    }

    // ── Control builders (Content tab by default) ────────────────────────────

    protected function text( string $key, string $label, string $default = '' ): array {
        return [ 'type'=>'text', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function textarea( string $key, string $label, string $default = '' ): array {
        return [ 'type'=>'textarea', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function wysiwyg( string $key, string $label, string $default = '' ): array {
        return [ 'type'=>'wysiwyg', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function number( string $key, string $label, int $default = 0, int $min = 0, int $max = 9999, int $step = 1 ): array {
        return [ 'type'=>'number', 'key'=>$key, 'label'=>$label, 'default'=>$default, 'min'=>$min, 'max'=>$max, 'step'=>$step ];
    }
    protected function select( string $key, string $label, array $options, string $default = '' ): array {
        return [ 'type'=>'select', 'key'=>$key, 'label'=>$label, 'options'=>$options, 'default'=>$default ];
    }
    protected function color( string $key, string $label, string $default = '#000000' ): array {
        return [ 'type'=>'color', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function image( string $key, string $label ): array {
        return [ 'type'=>'image', 'key'=>$key, 'label'=>$label, 'default'=>[ 'url'=>'', 'id'=>0 ] ];
    }
    protected function url( string $key, string $label, string $default = '#' ): array {
        return [ 'type'=>'url', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function toggle( string $key, string $label, bool $default = false ): array {
        return [ 'type'=>'toggle', 'key'=>$key, 'label'=>$label, 'default'=>$default ];
    }
    protected function slider( string $key, string $label, int $default = 50, int $min = 0, int $max = 100 ): array {
        return [ 'type'=>'slider', 'key'=>$key, 'label'=>$label, 'default'=>$default, 'min'=>$min, 'max'=>$max ];
    }
    protected function repeater( string $key, string $label, array $item_controls, array $default = [] ): array {
        return [ 'type'=>'repeater', 'key'=>$key, 'label'=>$label, 'item_controls'=>$item_controls, 'default'=>$default ];
    }
    protected function divider_control(): array {
        return [ 'type'=>'divider' ];
    }
    protected function heading_control( string $label ): array {
        return [ 'type'=>'heading', 'label'=>$label ];
    }

    // ── Typography helpers ────────────────────────────────────────────────────

    /** Standard font-family options */
    protected function font_families(): array {
        return [
            ''                                    => 'Default (Theme)',
            'Arial, Helvetica, sans-serif'        => 'Arial',
            'Georgia, "Times New Roman", serif'   => 'Georgia',
            '"Trebuchet MS", sans-serif'          => 'Trebuchet MS',
            '"Courier New", monospace'            => 'Courier New',
            'Roboto, sans-serif'                  => 'Roboto',
            '"Open Sans", sans-serif'             => 'Open Sans',
            'Lato, sans-serif'                    => 'Lato',
            'Montserrat, sans-serif'              => 'Montserrat',
            'Poppins, sans-serif'                 => 'Poppins',
            'Inter, sans-serif'                   => 'Inter',
            'Nunito, sans-serif'                  => 'Nunito',
            'Raleway, sans-serif'                 => 'Raleway',
            '"Playfair Display", serif'           => 'Playfair Display',
            '"Source Code Pro", monospace'        => 'Source Code Pro',
            'Ubuntu, sans-serif'                  => 'Ubuntu',
            'Oswald, sans-serif'                  => 'Oswald',
            '"Merriweather", serif'               => 'Merriweather',
            '"Dancing Script", cursive'           => 'Dancing Script',
            '"Pacifico", cursive'                 => 'Pacifico',
        ];
    }

    /**
     * Returns an array of Style-tab typography controls.
     * $prefix allows scoping (e.g. 'title' → 'title_font_size').
     */
    protected function typography_controls( string $prefix = '' ): array {
        $p = $prefix ? $prefix . '_' : '';
        $controls = [
            $this->heading_control( $prefix ? ucfirst($prefix) . ' Typography' : 'Typography' ),
            $this->select( $p.'font_family',    'Font Family',     $this->font_families(),   '' ),
            $this->number( $p.'font_size',      'Font Size (px)',  0, 0, 200 ),
            $this->select( $p.'font_weight',    'Font Weight',
                [ ''=>'Default','100'=>'Thin','300'=>'Light','400'=>'Regular',
                  '500'=>'Medium','600'=>'Semibold','700'=>'Bold','800'=>'Extra Bold','900'=>'Black' ], '' ),
            $this->select( $p.'font_style',     'Font Style',
                [ ''=>'Default', 'normal'=>'Normal', 'italic'=>'Italic', 'oblique'=>'Oblique' ], '' ),
            $this->select( $p.'text_transform', 'Text Transform',
                [ ''=>'Default','none'=>'None','uppercase'=>'UPPERCASE','lowercase'=>'lowercase','capitalize'=>'Capitalize' ], '' ),
            $this->select( $p.'text_decoration','Text Decoration',
                [ ''=>'Default','none'=>'None','underline'=>'Underline','line-through'=>'Line Through' ], '' ),
            $this->number( $p.'line_height',    'Line Height (× em)', 0, 0, 5 ),
            $this->number( $p.'letter_spacing', 'Letter Spacing (px)', 0, -10, 50 ),
            $this->number( $p.'word_spacing',   'Word Spacing (px)',   0, -10, 50 ),
            $this->divider_control(),
        ];
        return array_map( fn($c) => $this->set_tab( 'style', $c ), $controls );
    }

    /** Build CSS string from typography settings (call in render()) */
    protected function typography_css( array $s, string $prefix = '' ): string {
        $p   = $prefix ? $prefix . '_' : '';
        $css = [];
        if ( !empty($s[$p.'font_family']) )                           $css[] = 'font-family:'     . $s[$p.'font_family'];
        if ( !empty($s[$p.'font_size'])   && $s[$p.'font_size'] > 0 ) $css[] = 'font-size:'       . intval($s[$p.'font_size']) . 'px';
        if ( !empty($s[$p.'font_weight']) )                           $css[] = 'font-weight:'     . $s[$p.'font_weight'];
        if ( !empty($s[$p.'font_style'])  && $s[$p.'font_style']!=='' )  $css[] = 'font-style:'  . $s[$p.'font_style'];
        if ( !empty($s[$p.'text_transform']) && $s[$p.'text_transform']!=='' ) $css[] = 'text-transform:' . $s[$p.'text_transform'];
        if ( !empty($s[$p.'text_decoration']) && $s[$p.'text_decoration']!=='' ) $css[] = 'text-decoration:' . $s[$p.'text_decoration'];
        if ( !empty($s[$p.'line_height'])    && $s[$p.'line_height'] > 0 )   $css[] = 'line-height:'     . floatval($s[$p.'line_height']);
        if ( !empty($s[$p.'letter_spacing']) && $s[$p.'letter_spacing'] != 0 ) $css[] = 'letter-spacing:' . $s[$p.'letter_spacing'] . 'px';
        if ( !empty($s[$p.'word_spacing'])   && $s[$p.'word_spacing'] != 0 )   $css[] = 'word-spacing:'   . $s[$p.'word_spacing'] . 'px';
        return implode( ';', $css );
    }

    // ── Advanced tab controls (wrapper-level) ─────────────────────────────────

    public function get_advanced_controls(): array {
        $controls = [
            /* Spacing */
            $this->heading_control( 'Padding' ),
            $this->number( '_pt', 'Top (px)',    0, 0, 500 ),
            $this->number( '_pr', 'Right (px)',  0, 0, 500 ),
            $this->number( '_pb', 'Bottom (px)', 0, 0, 500 ),
            $this->number( '_pl', 'Left (px)',   0, 0, 500 ),
            $this->heading_control( 'Margin' ),
            $this->number( '_mt', 'Top (px)',    0, -500, 500 ),
            $this->number( '_mb', 'Bottom (px)', 24, -500, 500 ),
            $this->divider_control(),

            /* Background */
            $this->heading_control( 'Background' ),
            $this->select( '_bg_type', 'Type', [ 'none'=>'None','color'=>'Color','gradient'=>'Gradient','image'=>'Image' ], 'none' ),
            $this->color(  '_bg_color',       'Background Color',   '' ),
            $this->color(  '_bg_grad_from',   'Gradient Color 1',   '#667eea' ),
            $this->color(  '_bg_grad_to',     'Gradient Color 2',   '#764ba2' ),
            $this->slider( '_bg_grad_angle',  'Gradient Angle',     135, 0, 360 ),
            $this->image(  '_bg_image',       'Background Image' ),
            $this->select( '_bg_size',        'Image Size',         [ 'cover'=>'Cover','contain'=>'Contain','auto'=>'Auto' ], 'cover' ),
            $this->select( '_bg_position',    'Image Position',
                [ 'center center'=>'Center','top center'=>'Top','bottom center'=>'Bottom',
                  'left center'=>'Left','right center'=>'Right' ], 'center center' ),
            $this->toggle( '_bg_fixed',       'Fixed Background',   false ),
            $this->divider_control(),

            /* Border */
            $this->heading_control( 'Border' ),
            $this->select( '_border_type',   'Border Type',
                [ 'none'=>'None','solid'=>'Solid','dashed'=>'Dashed','dotted'=>'Dotted','double'=>'Double' ], 'none' ),
            $this->number( '_border_width',  'Width (px)',   1, 0, 20 ),
            $this->color(  '_border_color',  'Color',       '#e2e8f0' ),
            $this->number( '_border_radius_tl', 'Radius TL (px)', 0, 0, 200 ),
            $this->number( '_border_radius_tr', 'Radius TR (px)', 0, 0, 200 ),
            $this->number( '_border_radius_br', 'Radius BR (px)', 0, 0, 200 ),
            $this->number( '_border_radius_bl', 'Radius BL (px)', 0, 0, 200 ),
            $this->divider_control(),

            /* Shadow */
            $this->heading_control( 'Box Shadow' ),
            $this->toggle( '_box_shadow',     'Enable Shadow',    false ),
            $this->number( '_shadow_h',       'Horizontal (px)',  0, -100, 100 ),
            $this->number( '_shadow_v',       'Vertical (px)',    4, -100, 100 ),
            $this->number( '_shadow_blur',    'Blur (px)',       10, 0, 200 ),
            $this->number( '_shadow_spread',  'Spread (px)',      0, -50, 50 ),
            $this->color(  '_shadow_color',   'Color',   'rgba(0,0,0,0.1)' ),
            $this->toggle( '_shadow_inset',   'Inset',           false ),
            $this->divider_control(),

            /* Opacity & Transform */
            $this->heading_control( 'Transform' ),
            $this->slider( '_opacity',   'Opacity',       100, 0, 100 ),
            $this->number( '_rotate',    'Rotate (deg)',    0, -360, 360 ),
            $this->number( '_scale',     'Scale (%)',     100, 10, 300 ),
            $this->number( '_skew_x',   'Skew X (deg)',    0, -45, 45 ),
            $this->number( '_skew_y',   'Skew Y (deg)',    0, -45, 45 ),
            $this->divider_control(),

            /* Entrance Animation */
            $this->heading_control( 'Entrance Animation' ),
            $this->select( '_entrance_animation', 'Animation', [
                'none'         => 'None',
                'scb-fade-in'  => 'Fade In',
                'scb-fade-up'  => 'Fade In Up',
                'scb-fade-down'=> 'Fade In Down',
                'scb-fade-left'=> 'Fade In Left',
                'scb-fade-right'=> 'Fade In Right',
                'scb-zoom-in'  => 'Zoom In',
                'scb-zoom-out' => 'Zoom Out',
                'scb-bounce'   => 'Bounce',
                'scb-flip-x'   => 'Flip X',
                'scb-flip-y'   => 'Flip Y',
                'scb-slide-up' => 'Slide Up',
            ], 'none' ),
            $this->number( '_anim_duration', 'Duration (ms)', 600, 100, 5000, 100 ),
            $this->number( '_anim_delay',    'Delay (ms)',      0,   0, 5000, 100 ),
            $this->divider_control(),

            /* Custom CSS */
            $this->heading_control( 'Custom Attributes' ),
            $this->text( '_css_id',    'CSS ID',    '' ),
            $this->text( '_css_class', 'CSS Class', '' ),
            $this->divider_control(),

            /* Responsive */
            $this->heading_control( 'Responsive Visibility' ),
            $this->toggle( '_hide_desktop', 'Hide on Desktop', false ),
            $this->toggle( '_hide_tablet',  'Hide on Tablet',  false ),
            $this->toggle( '_hide_mobile',  'Hide on Mobile',  false ),
        ];
        return array_map( fn($c) => $this->set_tab( 'advanced', $c ), $controls );
    }

    // ── Render helpers ────────────────────────────────────────────────────────

    protected function sc( array $classes ): string {
        return implode( ' ', array_filter( $classes ) );
    }

    protected function get( array $settings, string $key, $fallback = '' ) {
        return $settings[ $key ] ?? $fallback;
    }

    protected function tag( string $settings_tag, array $allowed = [ 'h1','h2','h3','h4','h5','h6','p','div','span' ] ): string {
        return in_array( $settings_tag, $allowed, true ) ? $settings_tag : 'div';
    }

    /** Build Google Fonts URL for a font-family value */
    protected function maybe_enqueue_font( string $font_family ): void {
        if ( empty($font_family) ) return;
        $google_fonts = [
            'Roboto','Open Sans','Lato','Montserrat','Poppins','Inter','Nunito',
            'Raleway','Playfair Display','Ubuntu','Oswald','Merriweather',
            'Dancing Script','Pacifico','Source Code Pro',
        ];
        foreach ( $google_fonts as $gf ) {
            if ( stripos( $font_family, $gf ) !== false ) {
                $handle = 'scb-gf-' . sanitize_title($gf);
                $slug   = str_replace( ' ', '+', $gf );
                if ( ! wp_style_is( $handle, 'enqueued' ) ) {
                    wp_enqueue_style( $handle, "https://fonts.googleapis.com/css2?family={$slug}:wght@300;400;500;600;700;800&display=swap", [], null );
                }
                break;
            }
        }
    }
}
