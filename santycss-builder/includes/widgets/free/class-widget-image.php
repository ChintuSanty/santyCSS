<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Image extends Widget_Base {
    public function get_type(): string     { return 'image'; }
    public function get_title(): string    { return __( 'Image', 'santycss-builder' ); }
    public function get_icon(): string     { return '🖼️'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->image( 'image', 'Image' ),
            $this->text( 'alt', 'Alt Text', '' ),
            $this->text( 'caption', 'Caption', '' ),
            $this->url( 'link', 'Link', '' ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right' ], 'center' ),
            $this->select( 'size', 'Width', [ 'set-width-full'=>'Full','set-width-1-of-2'=>'Half','set-width-1-of-3'=>'Third','auto'=>'Auto' ], 'set-width-full' ),
            $this->number( 'border_radius', 'Border Radius (px)', 0, 0, 100 ),
        ];
    }

    public function render( array $s ): void {
        $url   = esc_url( $s['image']['url'] ?? '' );
        $alt   = esc_attr( $s['alt'] ?? '' );
        $align = $s['align'] ?? 'center';
        $w_cls = $s['size'] !== 'auto' ? ( $s['size'] ?? 'set-width-full' ) : '';
        $r     = intval( $s['border_radius'] ?? 0 );
        $style = $r ? "border-radius:{$r}px;" : '';
        $wrap  = "make-flex justify-{$align}";
        if ( ! $url ) { echo '<div class="scb-placeholder-img">📷 No image selected</div>'; return; }
        $img = "<img src=\"{$url}\" alt=\"{$alt}\" class=\"scb-image {$w_cls}\" style=\"{$style}display:block;\">";
        if ( ! empty( $s['link'] ) ) $img = '<a href="' . esc_url( $s['link'] ) . '">' . $img . '</a>';
        echo '<figure class="' . esc_attr( $wrap ) . ' add-margin-bottom-0">';
        echo $img;
        if ( ! empty( $s['caption'] ) ) echo '<figcaption class="set-text-13 color-gray-500 text-center add-margin-top-8">' . esc_html( $s['caption'] ) . '</figcaption>';
        echo '</figure>';
    }
}
