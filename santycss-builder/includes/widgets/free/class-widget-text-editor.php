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
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls(),
            [
                $this->set_tab( 'style', $this->heading_control( 'Color' ) ),
                $this->set_tab( 'style', $this->color( 'color', 'Text Color', '#374151' ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Links' ) ),
                $this->set_tab( 'style', $this->color( 'link_color', 'Link Color', '#3b82f6' ) ),
                $this->set_tab( 'style', $this->toggle( 'link_underline', 'Link Underline', true ) ),
                $this->set_tab( 'style', $this->divider_control() ),
                $this->set_tab( 'style', $this->heading_control( 'Columns' ) ),
                $this->set_tab( 'style', $this->select( 'columns', 'Text Columns',
                    [ '1'=>'1','2'=>'2','3'=>'3' ], '1' ) ),
                $this->set_tab( 'style', $this->number( 'column_gap', 'Column Gap (px)', 24, 0, 80 ) ),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font( $s['font_family'] ?? '' );
        $align = $s['align'] ?? 'left';
        $css   = [];
        if ( ! empty( $s['color'] ) ) $css[] = 'color:' . esc_attr( $s['color'] );
        $typo  = $this->typography_css( $s );
        if ( $typo ) $css[] = $typo;
        $cols  = intval( $s['columns'] ?? 1 );
        if ( $cols > 1 ) {
            $css[] = 'column-count:' . $cols;
            $css[] = 'column-gap:' . intval( $s['column_gap'] ?? 24 ) . 'px';
        }
        $link_color     = $s['link_color'] ?? '';
        $link_underline = isset( $s['link_underline'] ) ? (bool)$s['link_underline'] : true;
        $style  = implode( ';', $css );
        $extra_css = $link_color ? "<style>.scb-text-editor a{color:{$link_color};" . ($link_underline?'text-decoration:underline;':'text-decoration:none;') . "}</style>" : '';
        echo $extra_css;
        echo '<div class="scb-text-editor text-' . esc_attr( $align ) . '" style="' . esc_attr( $style ) . '">';
        echo wp_kses_post( $s['content'] ?? '' );
        echo '</div>';
    }
}
