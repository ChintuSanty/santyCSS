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
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right' ], 'left' ),
            $this->select( 'size', 'Size', [ 'set-text-24'=>'Small','set-text-32'=>'Medium','set-text-40'=>'Large','set-text-56'=>'XL','set-text-72'=>'XXL' ], 'set-text-40' ),
            $this->select( 'weight', 'Weight', [ 'text-bold'=>'Bold','text-semibold'=>'Semibold','text-extrabold'=>'Extra Bold','text-medium'=>'Medium' ], 'text-bold' ),
            $this->color( 'color', 'Color', '#111827' ),
            $this->url( 'link', 'Link (optional)', '' ),
        ];
    }

    public function render( array $s ): void {
        $tag   = $this->tag( $s['tag'] ?? 'h2' );
        $align = $s['align'] ?? 'left';
        $cls   = $this->sc([ $s['size'] ?? 'set-text-40', $s['weight'] ?? 'text-bold', 'text-' . $align ]);
        $style = ! empty( $s['color'] ) ? 'color:' . esc_attr( $s['color'] ) . ';' : '';
        $text  = esc_html( $s['text'] ?? '' );
        if ( ! empty( $s['link'] ) ) $text = '<a href="' . esc_url( $s['link'] ) . '" style="color:inherit;text-decoration:none;">' . $text . '</a>';
        echo "<{$tag} class=\"scb-heading {$cls}\" style=\"{$style}\">{$text}</{$tag}>";
    }
}
