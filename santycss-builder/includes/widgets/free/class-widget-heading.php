<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Heading extends Widget_Base {
    public function get_type(): string     { return 'heading'; }
    public function get_title(): string    { return __( 'Heading', 'santycss-builder' ); }
    public function get_icon(): string     { return '🔤'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->text( 'text', 'Text', 'Your Heading Here' ),
            $this->select( 'tag', 'HTML Tag', [ 'h1'=>'H1','h2'=>'H2','h3'=>'H3','h4'=>'H4','h5'=>'H5','h6'=>'H6' ], 'h2' ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right','justify'=>'Justify' ], 'left' ),
            $this->url( 'link', 'Link (optional)', '' ),
        ];
    }

    public function get_style_controls(): array {
        $controls = array_merge(
            $this->typography_controls(),
            [
                $this->set_tab( 'style', $this->heading_control( 'Color' ) ),
                $this->set_tab( 'style', $this->color( 'color', 'Text Color', '#111827' ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Text Shadow' ) ),
                $this->set_tab( 'style', $this->toggle( 'text_shadow', 'Enable Text Shadow', false ) ),
                $this->set_tab( 'style', $this->number( 'shadow_h', 'Horizontal (px)', 0, -50, 50 ) ),
                $this->set_tab( 'style', $this->number( 'shadow_v', 'Vertical (px)',   2, -50, 50 ) ),
                $this->set_tab( 'style', $this->number( 'shadow_blur', 'Blur (px)',    4,  0, 100 ) ),
                $this->set_tab( 'style', $this->color(  'shadow_color', 'Shadow Color', 'rgba(0,0,0,0.2)' ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Quick Size' ) ),
                $this->set_tab( 'style', $this->select( 'size', 'Preset Size',
                    [ ''=>'Custom (use Typography above)','set-text-24'=>'Small','set-text-32'=>'Medium','set-text-40'=>'Large','set-text-56'=>'XL','set-text-72'=>'XXL' ], '' ) ),
                $this->set_tab( 'style', $this->select( 'weight', 'Preset Weight',
                    [ ''=>'Custom','text-bold'=>'Bold','text-semibold'=>'Semibold','text-extrabold'=>'Extra Bold','text-medium'=>'Medium' ], '' ) ),
            ]
        );
        return $controls;
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font( $s['font_family'] ?? '' );
        $tag   = $this->tag( $s['tag'] ?? 'h2' );
        $align = $s['align'] ?? 'left';

        // Build CSS classes from presets (used if no style-tab typography set)
        $size_cls   = $s['size']   ?? '';
        $weight_cls = $s['weight'] ?? '';
        $cls = $this->sc( array_filter([ 'scb-heading', $size_cls, $weight_cls, 'text-' . $align ]) );

        // Build inline style: color + style-tab typography overrides + text shadow
        $css = [];
        if ( ! empty( $s['color'] ) ) $css[] = 'color:' . esc_attr( $s['color'] );
        $typo = $this->typography_css( $s );
        if ( $typo ) $css[] = $typo;
        if ( ! empty( $s['text_shadow'] ) ) {
            $sh = intval($s['shadow_h']??0);$sv=intval($s['shadow_v']??2);
            $sb = intval($s['shadow_blur']??4);$sc=esc_attr($s['shadow_color']??'rgba(0,0,0,0.2)');
            $css[] = "text-shadow:{$sh}px {$sv}px {$sb}px {$sc}";
        }
        $style = implode( ';', $css );

        $text = esc_html( $s['text'] ?? '' );
        if ( ! empty( $s['link'] ) ) $text = '<a href="' . esc_url( $s['link'] ) . '" style="color:inherit;text-decoration:none;">' . $text . '</a>';
        echo "<{$tag} class=\"{$cls}\"" . ( $style ? " style=\"{$style}\"" : '' ) . ">{$text}</{$tag}>";
    }
}
