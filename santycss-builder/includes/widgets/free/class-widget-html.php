<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Html extends Widget_Base {
    public function get_type(): string     { return 'html'; }
    public function get_title(): string    { return __('HTML','santycss-builder'); }
    public function get_icon(): string     { return '🧩'; }
    public function get_category(): string { return 'basic'; }
    public function get_controls(): array  { return [ $this->textarea('code','HTML Code','<p>Custom HTML here</p>') ]; }
    public function render(array $s): void { echo wp_kses_post($s['code']??''); }
}
