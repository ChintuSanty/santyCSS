<?php
namespace SCB;

defined( 'ABSPATH' ) || exit;

class Widget_Manager {

    private static $instance = null;
    private array $widgets = [];

    public static function instance(): self {
        if ( is_null( self::$instance ) ) self::$instance = new self();
        return self::$instance;
    }

    public function register( Widgets\Widget_Base $widget ): void {
        $this->widgets[ $widget->get_type() ] = $widget;
    }

    public function get( string $type ): ?Widgets\Widget_Base {
        return $this->widgets[ $type ] ?? null;
    }

    public function all(): array {
        return $this->widgets;
    }

    /** Returns all widget definitions as JSON-safe array for the builder UI */
    public function get_definitions(): array {
        $defs = [];
        foreach ( $this->widgets as $type => $widget ) {
            $defs[] = [
                'type'     => $type,
                'title'    => $widget->get_title(),
                'icon'     => $widget->get_icon(),
                'category' => $widget->get_category(),
                'tier'     => $widget->get_tier(),
                'controls' => $widget->get_all_controls(),
                'defaults' => $widget->get_defaults(),
            ];
        }
        return $defs;
    }
}
