<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Call_To_Action_Free extends Widget_Base {
    public function get_type(): string     { return 'cta-free'; }
    public function get_title(): string    { return __('Call to Action','santycss-builder'); }
    public function get_icon(): string     { return '📣'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('title','Title','Ready to get started?'),
            $this->textarea('description','Description','Join thousands of developers building with SantyCSS.'),
            $this->text('btn_text','Button Text','Get Started'),
            $this->url('btn_url','Button URL','#'),
            $this->color('bg_color','Background','#1e40af'),
            $this->color('text_color','Text Color','#ffffff'),
            $this->number('radius','Border Radius',16,0,40),
        ];
    }
    public function render(array $s): void {
        $bg=esc_attr($s['bg_color']??'#1e40af');$tc=esc_attr($s['text_color']??'#ffffff');$r=intval($s['radius']??16);
        echo "<div class=\"scb-cta text-center add-padding-48\" style=\"background:{$bg};color:{$tc};border-radius:{$r}px;\">";
        echo '<h2 class="set-text-36 text-bold add-margin-bottom-16">'.esc_html($s['title']??'').'</h2>';
        echo '<p class="set-text-18 add-margin-bottom-32" style="opacity:.85;">'.esc_html($s['description']??'').'</p>';
        echo '<a href="'.esc_url($s['btn_url']??'#').'" class="make-button style-secondary size-large shape-pill">'.esc_html($s['btn_text']??'Get Started').'</a>';
        echo '</div>';
    }
}
