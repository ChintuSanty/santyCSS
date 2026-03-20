<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Text_Editor extends Widget_Base {
    public function get_type(): string     { return 'text-editor'; }
    public function get_title(): string    { return __( 'Text Editor', 'santycss-builder' ); }
    public function get_icon(): string     { return '📝'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->wysiwyg( 'content', 'Content', '<p>Start writing your content here…</p>' ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right','justify'=>'Justify' ], 'left' ),
            $this->select( 'size', 'Text Size', [ 'set-text-14'=>'Small','set-text-16'=>'Normal','set-text-18'=>'Large' ], 'set-text-16' ),
            $this->color( 'color', 'Color', '#374151' ),
        ];
    }

    public function render( array $s ): void {
        $cls   = $this->sc([ $s['size'] ?? 'set-text-16', 'text-' . ( $s['align'] ?? 'left' ), 'line-height-relaxed' ]);
        $style = ! empty( $s['color'] ) ? 'color:' . esc_attr( $s['color'] ) . ';' : '';
        echo '<div class="scb-text-editor ' . esc_attr( $cls ) . '" style="' . $style . '">';
        echo wp_kses_post( $s['content'] ?? '' );
        echo '</div>';
    }
}
