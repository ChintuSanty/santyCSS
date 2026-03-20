<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Toggle extends Widget_Base {
    public function get_type(): string     { return 'toggle'; }
    public function get_title(): string    { return __('Toggle','santycss-builder'); }
    public function get_icon(): string     { return '🔀'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('title','Title','Toggle Title'),
            $this->wysiwyg('content','Content','<p>Toggle content here.</p>'),
            $this->toggle('open','Open by Default',false),
        ];
    }
    public function render(array $s): void {
        $open = !empty($s['open']);
        echo '<details class="scb-toggle background-white round-corners-10 add-border-1 border-color-gray-200 overflow-hidden"'.($open?' open':'').'>';
        echo '<summary class="make-flex align-center justify-between add-padding-16 add-padding-x-20 set-text-15 text-semibold color-gray-900" style="cursor:pointer;list-style:none;">';
        echo '<span>'.esc_html($s['title']??'').'</span><span>▼</span>';
        echo '</summary>';
        echo '<div class="add-padding-20" style="padding-top:0;">'.wp_kses_post($s['content']??'').'</div>';
        echo '</details>';
    }
}
