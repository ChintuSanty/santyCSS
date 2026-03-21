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

    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Text Style')),
            $this->set_tab('style', $this->color('text_color','Text Color','#9ca3af')),
            $this->set_tab('style', $this->number('text_size','Font Size (px)',12,8,32)),
            $this->set_tab('style', $this->select('text_weight','Font Weight',['400'=>'Normal','600'=>'Semibold','700'=>'Bold'],'400')),
            $this->set_tab('style', $this->select('text_transform','Text Transform',['none'=>'None','uppercase'=>'Uppercase','lowercase'=>'Lowercase','capitalize'=>'Capitalize'],'none')),
            $this->set_tab('style', $this->number('text_gap','Text Gap (px)',16,4,48)),
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
            $tc = esc_attr($s['text_color']??'#9ca3af');
            $ts = intval($s['text_size']??12);
            $tw = $s['text_weight']??'400';
            $tt = $s['text_transform']??'none';
            $tg = intval($s['text_gap']??16);
            echo "<div class=\"scb-divider-text make-flex align-center\" style=\"width:{$width}%;margin:{$margin};gap:{$tg}px;\">";
            echo "<div style=\"flex:1;height:{$weight}px;border-top:{$weight}px {$style} {$color};\"></div>";
            echo "<span style=\"font-size:{$ts}px;color:{$tc};font-weight:{$tw};text-transform:{$tt};white-space:nowrap;\">".esc_html($text)."</span>";
            echo "<div style=\"flex:1;height:{$weight}px;border-top:{$weight}px {$style} {$color};\"></div>";
            echo '</div>';
        } else {
            echo "<hr class=\"scb-divider\" style=\"border:none;border-top:{$weight}px {$style} {$color};width:{$width}%;margin:{$margin};\">";
        }
    }
}
