<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Button extends Widget_Base {
    public function get_type(): string     { return 'button'; }
    public function get_title(): string    { return __( 'Button', 'santycss-builder' ); }
    public function get_icon(): string     { return '🔘'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->text( 'text', 'Button Text', 'Click Me' ),
            $this->url( 'url', 'Link', '#' ),
            $this->select( 'style', 'Style', [ 'primary'=>'Primary','secondary'=>'Secondary','outline'=>'Outline','ghost'=>'Ghost','danger'=>'Danger' ], 'primary' ),
            $this->select( 'size', 'Size', [ 'size-small'=>'Small','size-medium'=>'Medium','size-large'=>'Large' ], 'size-medium' ),
            $this->select( 'shape', 'Shape', [ ''=>'Default','shape-pill'=>'Pill','shape-rounded'=>'Rounded' ], 'shape-rounded' ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right' ], 'left' ),
            $this->text( 'icon', 'Icon (emoji)', '' ),
            $this->select( 'icon_pos', 'Icon Position', [ 'left'=>'Left','right'=>'Right' ], 'left' ),
            $this->toggle( 'new_tab', 'Open in New Tab', false ),
            $this->toggle( 'full_width', 'Full Width', false ),
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls(),
            [
                $this->set_tab( 'style', $this->heading_control( 'Normal State' ) ),
                $this->set_tab( 'style', $this->color( 'btn_bg',     'Background Color', '' ) ),
                $this->set_tab( 'style', $this->color( 'btn_color',  'Text Color',       '' ) ),
                $this->set_tab( 'style', $this->color( 'btn_border_color', 'Border Color', '' ) ),
                $this->set_tab( 'style', $this->number( 'btn_border_width', 'Border Width (px)', 0, 0, 20 ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Hover State' ) ),
                $this->set_tab( 'style', $this->color( 'btn_hover_bg',    'Hover Background', '' ) ),
                $this->set_tab( 'style', $this->color( 'btn_hover_color', 'Hover Text Color', '' ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Border Radius' ) ),
                $this->set_tab( 'style', $this->number( 'btn_radius', 'Radius (px)', 0, 0, 100 ) ),
                $this->set_tab( 'style', $this->heading_control( 'Padding' ) ),
                $this->set_tab( 'style', $this->number( 'btn_pt', 'Top (px)',    0, 0, 100 ) ),
                $this->set_tab( 'style', $this->number( 'btn_pr', 'Right (px)',  0, 0, 100 ) ),
                $this->set_tab( 'style', $this->number( 'btn_pb', 'Bottom (px)', 0, 0, 100 ) ),
                $this->set_tab( 'style', $this->number( 'btn_pl', 'Left (px)',   0, 0, 100 ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Box Shadow' ) ),
                $this->set_tab( 'style', $this->toggle( 'btn_shadow', 'Enable Shadow', false ) ),
                $this->set_tab( 'style', $this->number( 'btn_shadow_h',    'Horizontal', 0, -100, 100 ) ),
                $this->set_tab( 'style', $this->number( 'btn_shadow_v',    'Vertical',   4,  -100, 100 ) ),
                $this->set_tab( 'style', $this->number( 'btn_shadow_blur', 'Blur',      12,  0, 100 ) ),
                $this->set_tab( 'style', $this->color(  'btn_shadow_color','Shadow Color', 'rgba(0,0,0,0.15)' ) ),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font( $s['font_family'] ?? '' );
        $text     = esc_html( $s['text'] ?? 'Click Me' );
        $url      = esc_url( $s['url'] ?? '#' );
        $style    = $s['style']  ?? 'primary';
        $size     = $s['size']   ?? 'size-medium';
        $shape    = $s['shape']  ?? 'shape-rounded';
        $align    = $s['align']  ?? 'left';
        $icon     = esc_html( $s['icon'] ?? '' );
        $icon_pos = $s['icon_pos'] ?? 'left';
        $new_tab  = ! empty( $s['new_tab'] ) ? ' target="_blank" rel="noopener"' : '';
        $fw       = ! empty( $s['full_width'] ) ? 'set-width-full justify-center' : '';
        $btn_cls  = "make-button style-{$style} {$size} {$shape} {$fw}";
        $label    = $icon ? ( $icon_pos === 'left' ? "{$icon} {$text}" : "{$text} {$icon}" ) : $text;

        // Build custom inline style from style-tab controls
        $css = [];
        if ( ! empty($s['btn_bg']) )           $css[] = 'background:' . esc_attr($s['btn_bg']);
        if ( ! empty($s['btn_color']) )        $css[] = 'color:' . esc_attr($s['btn_color']);
        if ( ! empty($s['btn_border_color']) ) {
            $bw = intval($s['btn_border_width'] ?? 1);
            $css[] = "border:{$bw}px solid " . esc_attr($s['btn_border_color']);
        }
        if ( !empty($s['btn_radius']) )        $css[] = 'border-radius:' . intval($s['btn_radius']) . 'px';
        $pt = intval($s['btn_pt']??0);$pr=intval($s['btn_pr']??0);$pb=intval($s['btn_pb']??0);$pl=intval($s['btn_pl']??0);
        if ($pt||$pr||$pb||$pl) $css[] = "padding:{$pt}px {$pr}px {$pb}px {$pl}px";
        if ( ! empty($s['btn_shadow']) ) {
            $sh = intval($s['btn_shadow_h']??0);$sv=intval($s['btn_shadow_v']??4);
            $sb = intval($s['btn_shadow_blur']??12);$sc=esc_attr($s['btn_shadow_color']??'rgba(0,0,0,0.15)');
            $css[] = "box-shadow:{$sh}px {$sv}px {$sb}px {$sc}";
        }
        $typo = $this->typography_css( $s );
        if ( $typo ) $css[] = $typo;
        $inline = implode( ';', $css );

        // Hover style via <style> tag
        $uid = '';
        $hover_css = '';
        if ( ! empty($s['btn_hover_bg']) || ! empty($s['btn_hover_color']) ) {
            $uid  = 'scb-btn-' . uniqid();
            $h_css = [];
            if ( !empty($s['btn_hover_bg']) )    $h_css[] = 'background:' . esc_attr($s['btn_hover_bg']) . '!important';
            if ( !empty($s['btn_hover_color']) )  $h_css[] = 'color:' . esc_attr($s['btn_hover_color']) . '!important';
            $hover_css = '<style>#' . $uid . ':hover{' . implode(';', $h_css) . ';}</style>';
        }

        echo $hover_css;
        echo "<div class=\"scb-button-wrap make-flex justify-{$align}\">";
        echo '<a href="' . $url . '" class="' . esc_attr($btn_cls) . '"'
             . ( $uid ? " id=\"{$uid}\"" : '' )
             . ( $inline ? ' style="' . esc_attr($inline) . '"' : '' )
             . $new_tab . '>' . $label . '</a>';
        echo '</div>';
    }
}
