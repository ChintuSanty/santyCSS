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

    public function render( array $s ): void {
        $text      = esc_html( $s['text'] ?? 'Click Me' );
        $url       = esc_url( $s['url'] ?? '#' );
        $style     = $s['style'] ?? 'primary';
        $size      = $s['size'] ?? 'size-medium';
        $shape     = $s['shape'] ?? 'shape-rounded';
        $align     = $s['align'] ?? 'left';
        $icon      = esc_html( $s['icon'] ?? '' );
        $icon_pos  = $s['icon_pos'] ?? 'left';
        $new_tab   = ! empty( $s['new_tab'] ) ? ' target="_blank" rel="noopener"' : '';
        $fw        = ! empty( $s['full_width'] ) ? 'set-width-full justify-center' : '';
        $btn_cls   = "make-button style-{$style} {$size} {$shape} {$fw}";
        $label     = $icon ? ( $icon_pos === 'left' ? "{$icon} {$text}" : "{$text} {$icon}" ) : $text;
        echo "<div class=\"scb-button-wrap make-flex justify-{$align}\">";
        echo "<a href=\"{$url}\" class=\"{$btn_cls}\"{$new_tab}>{$label}</a>";
        echo '</div>';
    }
}
