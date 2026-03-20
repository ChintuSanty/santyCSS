<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Icon_Box extends Widget_Base {
    public function get_type(): string     { return 'icon-box'; }
    public function get_title(): string    { return __('Icon Box','santycss-builder'); }
    public function get_icon(): string     { return '📦'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('icon','Icon (emoji)','⭐'),
            $this->color('icon_bg','Icon Background','#eff6ff'),
            $this->number('icon_size','Icon Size (px)',32,12,96),
            $this->text('title','Title','Box Title'),
            $this->textarea('description','Description','Your description here.'),
            $this->url('link','Link',''),
            $this->select('layout','Layout',['top-center'=>'Icon Top Center','top-left'=>'Icon Top Left','left'=>'Icon Left Inline'],'top-center'),
        ];
    }
    public function render(array $s): void {
        $icon    = esc_html($s['icon']??'⭐');
        $icon_bg = esc_attr($s['icon_bg']??'#eff6ff');
        $sz      = intval($s['icon_size']??32);
        $box_sz  = $sz+24;
        $layout  = $s['layout']??'top-center';
        $cls     = $layout==='left'?'make-flex align-start gap-20':'make-flex flex-column '.($layout==='top-center'?'align-center text-center':'align-start').' gap-12';
        echo "<div class=\"scb-icon-box {$cls}\">";
        echo "<div style=\"width:{$box_sz}px;height:{$box_sz}px;background:{$icon_bg};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:{$sz}px;flex-shrink:0;\">{$icon}</div>";
        echo '<div>';
        echo '<h3 class="set-text-18 text-semibold color-gray-900 add-margin-bottom-8">'.esc_html($s['title']??'').'</h3>';
        echo '<p class="set-text-14 color-gray-500 line-height-relaxed">'.esc_html($s['description']??'').'</p>';
        if(!empty($s['link'])) echo '<a href="'.esc_url($s['link']).'" class="set-text-14 color-blue-600 text-semibold add-margin-top-8" style="display:inline-block;text-decoration:none;">Learn more →</a>';
        echo '</div></div>';
    }
}
