<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Shortcode extends Widget_Base {
    public function get_type(): string     { return 'shortcode'; }
    public function get_title(): string    { return __('Shortcode','santycss-builder'); }
    public function get_icon(): string     { return '[/]'; }
    public function get_category(): string { return 'basic'; }
    public function get_controls(): array  { return [ $this->text('shortcode','Shortcode','[your_shortcode]') ]; }
    public function render(array $s): void { echo do_shortcode($s['shortcode']??''); }
}
