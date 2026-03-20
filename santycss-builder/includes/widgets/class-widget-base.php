<?php
namespace SCB\Widgets;

defined( 'ABSPATH' ) || exit;

abstract class Widget_Base {

    abstract public function get_type(): string;
    abstract public function get_title(): string;
    abstract public function get_icon(): string;
    abstract public function get_category(): string;
    abstract public function get_controls(): array;
    abstract public function render( array $settings ): void;

    public function get_tier(): string { return 'free'; }  // 'free' | 'pro'
    public function get_defaults(): array {
        $defaults = [];
        foreach ( $this->get_controls() as $ctrl ) {
            if ( isset( $ctrl['default'] ) ) {
                $defaults[ $ctrl['key'] ] = $ctrl['default'];
            }
        }
        return $defaults;
    }

    // ── Control builders ────────────────────────────────────────────────────

    protected function text( string $key, string $label, string $default = '' ): array {
        return [ 'type' => 'text', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function textarea( string $key, string $label, string $default = '' ): array {
        return [ 'type' => 'textarea', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function wysiwyg( string $key, string $label, string $default = '' ): array {
        return [ 'type' => 'wysiwyg', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function number( string $key, string $label, int $default = 0, int $min = 0, int $max = 9999, int $step = 1 ): array {
        return [ 'type' => 'number', 'key' => $key, 'label' => $label, 'default' => $default, 'min' => $min, 'max' => $max, 'step' => $step ];
    }

    protected function select( string $key, string $label, array $options, string $default = '' ): array {
        return [ 'type' => 'select', 'key' => $key, 'label' => $label, 'options' => $options, 'default' => $default ];
    }

    protected function color( string $key, string $label, string $default = '#000000' ): array {
        return [ 'type' => 'color', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function image( string $key, string $label ): array {
        return [ 'type' => 'image', 'key' => $key, 'label' => $label, 'default' => [ 'url' => '', 'id' => 0 ] ];
    }

    protected function url( string $key, string $label, string $default = '#' ): array {
        return [ 'type' => 'url', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function toggle( string $key, string $label, bool $default = false ): array {
        return [ 'type' => 'toggle', 'key' => $key, 'label' => $label, 'default' => $default ];
    }

    protected function slider( string $key, string $label, int $default = 50, int $min = 0, int $max = 100 ): array {
        return [ 'type' => 'slider', 'key' => $key, 'label' => $label, 'default' => $default, 'min' => $min, 'max' => $max ];
    }

    protected function repeater( string $key, string $label, array $item_controls, array $default = [] ): array {
        return [ 'type' => 'repeater', 'key' => $key, 'label' => $label, 'item_controls' => $item_controls, 'default' => $default ];
    }

    protected function divider_control(): array {
        return [ 'type' => 'divider' ];
    }

    protected function heading_control( string $label ): array {
        return [ 'type' => 'heading', 'label' => $label ];
    }

    // ── Render helpers ───────────────────────────────────────────────────────

    protected function sc( array $classes ): string {
        return implode( ' ', array_filter( $classes ) );
    }

    protected function get( array $settings, string $key, $fallback = '' ) {
        return $settings[ $key ] ?? $fallback;
    }

    protected function tag( string $settings_tag, array $allowed = [ 'h1','h2','h3','h4','h5','h6','p','div','span' ] ): string {
        return in_array( $settings_tag, $allowed, true ) ? $settings_tag : 'div';
    }
}
