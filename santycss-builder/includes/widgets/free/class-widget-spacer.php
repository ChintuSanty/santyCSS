<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Spacer extends Widget_Base {
    public function get_type(): string     { return 'spacer'; }
    public function get_title(): string    { return __('Spacer','santycss-builder'); }
    public function get_icon(): string     { return '↕️'; }
    public function get_category(): string { return 'basic'; }
    public function get_controls(): array  { return [ $this->number('height','Height (px)',40,0,500) ]; }
    public function render(array $s): void { echo '<div class="scb-spacer" style="height:' . intval($s['height']??40) . 'px;"></div>'; }
}
