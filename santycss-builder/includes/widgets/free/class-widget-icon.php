<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Icon extends Widget_Base {
    public function get_type(): string     { return 'icon'; }
    public function get_title(): string    { return __('Icon','santycss-builder'); }
    public function get_icon(): string     { return '⭐'; }
    public function get_category(): string { return 'basic'; }
    public function get_controls(): array {
        return [
            $this->text('icon','Icon (emoji or SVG)','⭐'),
            $this->number('size','Size (px)',48,12,200),
            $this->color('color','Color','#3b82f6'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
            $this->url('link','Link',''),
        ];
    }
    public function render(array $s): void {
        $icon  = esc_html($s['icon']??'⭐');
        $size  = intval($s['size']??48);
        $color = esc_attr($s['color']??'#3b82f6');
        $align = $s['align']??'center';
        $inner = "<span style=\"font-size:{$size}px;color:{$color};line-height:1;display:block;\">{$icon}</span>";
        if(!empty($s['link'])) $inner="<a href=\"".esc_url($s['link'])."\">{$inner}</a>";
        echo "<div class=\"scb-icon text-{$align}\">{$inner}</div>";
    }
}
