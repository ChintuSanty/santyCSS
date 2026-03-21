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
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
            $this->url('link','Link',''),
        ];
    }
    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Icon Color')),
            $this->set_tab('style', $this->color('color','Icon Color','#3b82f6')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Background')),
            $this->set_tab('style', $this->color('bg_color','Background Color','')),
            $this->set_tab('style', $this->number('bg_size','Background Padding (px)',0,0,80)),
            $this->set_tab('style', $this->number('bg_radius','Border Radius (px)',0,0,200)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Border')),
            $this->set_tab('style', $this->select('icon_border_type','Border',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed','dotted'=>'Dotted'],'none')),
            $this->set_tab('style', $this->number('icon_border_width','Width (px)',2,1,20)),
            $this->set_tab('style', $this->color('icon_border_color','Border Color','#3b82f6')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Hover')),
            $this->set_tab('style', $this->color('hover_color','Hover Color','')),
            $this->set_tab('style', $this->color('hover_bg','Hover Background','')),
        ];
    }
    public function render(array $s): void {
        $icon    = esc_html($s['icon']??'⭐');
        $size    = intval($s['size']??48);
        $color   = esc_attr($s['color']??'#3b82f6');
        $align   = $s['align']??'center';
        $bg      = esc_attr($s['bg_color']??'');
        $pad     = intval($s['bg_size']??0);
        $radius  = intval($s['bg_radius']??0);
        $b_type  = $s['icon_border_type']??'none';
        $css     = "font-size:{$size}px;color:{$color};line-height:1;display:inline-flex;align-items:center;justify-content:center;";
        if ($bg)     $css .= "background:{$bg};";
        if ($pad)    $css .= "padding:{$pad}px;";
        if ($radius) $css .= "border-radius:{$radius}px;";
        if ($b_type !== 'none') {
            $bw = intval($s['icon_border_width']??2);$bc=esc_attr($s['icon_border_color']??'#3b82f6');
            $css .= "border:{$bw}px {$b_type} {$bc};";
        }
        $uid = '';$hover_css = '';
        if (!empty($s['hover_color'])||!empty($s['hover_bg'])) {
            $uid = 'scb-icon-'.uniqid();$h=[];
            if(!empty($s['hover_color'])) $h[]='color:'.esc_attr($s['hover_color']).'!important';
            if(!empty($s['hover_bg']))    $h[]='background:'.esc_attr($s['hover_bg']).'!important';
            $hover_css = '<style>#'.$uid.':hover span{'.(implode(';',$h)).';}</style>';
        }
        $inner = "<span style=\"{$css}\">".($uid?" id=\"{$uid}\"":"").$icon."</span>";
        if(!empty($s['link'])) $inner="<a href=\"".esc_url($s['link'])."\" style=\"display:inline-block;line-height:0;\">{$inner}</a>";
        echo $hover_css."<div class=\"scb-icon text-{$align}\">{$inner}</div>";
    }
}
