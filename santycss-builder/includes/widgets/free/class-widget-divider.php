<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Divider extends Widget_Base {
    public function get_type(): string     { return 'divider'; }
    public function get_title(): string    { return __( 'Divider', 'santycss-builder' ); }
    public function get_icon(): string     { return '➖'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->select( 'style', 'Style', [ 'solid'=>'Solid','dashed'=>'Dashed','dotted'=>'Dotted','double'=>'Double' ], 'solid' ),
            $this->color( 'color', 'Color', '#e5e7eb' ),
            $this->number( 'weight', 'Thickness (px)', 1, 1, 10 ),
            $this->slider( 'width', 'Width %', 100, 10, 100 ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right' ], 'center' ),
            $this->text( 'text', 'Text (optional)', '' ),
        ];
    }

    public function render( array $s ): void {
        $style  = $s['style'] ?? 'solid';
        $color  = $s['color'] ?? '#e5e7eb';
        $weight = intval( $s['weight'] ?? 1 );
        $width  = intval( $s['width'] ?? 100 );
        $align  = $s['align'] ?? 'center';
        $text   = $s['text'] ?? '';
        $margin = $align === 'left' ? '0 auto 0 0' : ( $align === 'right' ? '0 0 0 auto' : '0 auto' );
        if ( $text ) {
            echo "<div class=\"scb-divider-text make-flex align-center gap-16\" style=\"width:{$width}%;margin:{$margin};\">";
            echo "<div style=\"flex:1;height:{$weight}px;background:{$color};border-top:{$weight}px {$style} {$color};\"></div>";
            echo '<span class="set-text-12 color-gray-400 text-nowrap">' . esc_html( $text ) . '</span>';
            echo "<div style=\"flex:1;height:{$weight}px;background:{$color};border-top:{$weight}px {$style} {$color};\"></div>";
            echo '</div>';
        } else {
            echo "<hr class=\"scb-divider\" style=\"border:none;border-top:{$weight}px {$style} {$color};width:{$width}%;margin:{$margin};\">";
        }
    }
}
