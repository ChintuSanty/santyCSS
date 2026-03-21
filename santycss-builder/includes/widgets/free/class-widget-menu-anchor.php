<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Menu_Anchor extends Widget_Base {
    public function get_type(): string     { return 'menu-anchor'; }
    public function get_title(): string    { return __('Menu Anchor','santycss-builder'); }
    public function get_icon(): string     { return '⚓'; }
    public function get_category(): string { return 'layout'; }

    public function get_controls(): array {
        return [
            $this->text('anchor_id','Anchor ID (no # or spaces)','my-section'),
            $this->text('label','Label (editor only)','Section Name'),
        ];
    }

    public function render( array $s ): void {
        $id = sanitize_key($s['anchor_id'] ?? '');
        if ( empty($id) ) {
            echo '<div class="background-amber-50 add-padding-12 round-corners-8 set-text-12 color-amber-700">Menu Anchor: no ID set</div>';
            return;
        }
        echo '<span id="' . esc_attr($id) . '" style="display:block;height:0;overflow:hidden;" aria-hidden="true"></span>';
    }
}
