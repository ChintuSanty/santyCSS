<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Sidebar extends Widget_Base {
    public function get_type(): string     { return 'sidebar'; }
    public function get_title(): string    { return __('Sidebar','santycss-builder'); }
    public function get_icon(): string     { return '📌'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        $sidebars = [];
        if ( function_exists('wp_get_sidebars_widgets') ) {
            foreach ( array_keys( wp_get_sidebars_widgets() ) as $sid ) {
                if ( $sid !== 'wp_inactive_widgets' ) {
                    $sidebars[$sid] = ucwords( str_replace(['-','_'],' ',$sid) );
                }
            }
        }
        if ( empty($sidebars) ) $sidebars = ['sidebar-1' => 'Primary Sidebar'];
        return [
            $this->select('sidebar_id','Sidebar', $sidebars, (string) array_key_first($sidebars)),
        ];
    }

    public function render( array $s ): void {
        $sid = $s['sidebar_id'] ?? '';
        if ( empty($sid) || ! is_active_sidebar($sid) ) {
            echo '<div class="add-padding-16 background-gray-50 round-corners-8 text-center color-gray-400 set-text-14" style="border:2px dashed #e2e8f0;">Sidebar "<strong>' . esc_html($sid) . '</strong>" not found or inactive.</div>';
            return;
        }
        echo '<div class="scb-sidebar">';
        dynamic_sidebar($sid);
        echo '</div>';
    }
}
