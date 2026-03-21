<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Icon_Box extends Widget_Base {
    public function get_type(): string     { return 'icon-box'; }
    public function get_title(): string    { return __('Icon Box','santycss-builder'); }
    public function get_icon(): string     { return '📦'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('icon','Icon (emoji)','⭐'),
            $this->text('title','Title','Box Title'),
            $this->textarea('description','Description','Your description here.'),
            $this->url('link','Link',''),
            $this->text('link_text','Link Text','Learn more →'),
            $this->select('layout','Layout',['top-center'=>'Icon Top Center','top-left'=>'Icon Top Left','left'=>'Icon Left Inline'],'top-center'),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('title'),
            $this->typography_controls('desc'),
            [
                $this->set_tab('style', $this->heading_control('Icon')),
                $this->set_tab('style', $this->number('icon_size','Icon Size (px)',32,12,96)),
                $this->set_tab('style', $this->color('icon_color','Icon Color','')),
                $this->set_tab('style', $this->color('icon_bg','Icon Background','#eff6ff')),
                $this->set_tab('style', $this->number('icon_box_radius','Icon Box Radius (px)',12,0,100)),
                $this->set_tab('style', $this->number('icon_padding','Icon Padding (px)',12,0,40)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Colors')),
                $this->set_tab('style', $this->color('title_color','Title Color','#111827')),
                $this->set_tab('style', $this->color('desc_color','Description Color','#6b7280')),
                $this->set_tab('style', $this->color('link_color','Link Color','#3b82f6')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Spacing')),
                $this->set_tab('style', $this->number('icon_gap','Icon Gap (px)',12,0,40)),
                $this->set_tab('style', $this->number('title_gap','Title Gap (px)',8,0,40)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['title_font_family']??'');
        $this->maybe_enqueue_font($s['desc_font_family']??'');
        $icon    = esc_html($s['icon']??'⭐');
        $sz      = intval($s['icon_size']??32);
        $ic_c    = esc_attr($s['icon_color']??'');
        $ic_bg   = esc_attr($s['icon_bg']??'#eff6ff');
        $ic_r    = intval($s['icon_box_radius']??12);
        $ic_p    = intval($s['icon_padding']??12);
        $tc      = esc_attr($s['title_color']??'#111827');
        $dc      = esc_attr($s['desc_color']??'#6b7280');
        $lc      = esc_attr($s['link_color']??'#3b82f6');
        $ig      = intval($s['icon_gap']??12);$tg=intval($s['title_gap']??8);
        $layout  = $s['layout']??'top-center';
        $t_css   = 'color:'.$tc; $t_t=$this->typography_css($s,'title');if($t_t)$t_css.=';'.$t_t;
        $d_css   = 'color:'.$dc; $d_t=$this->typography_css($s,'desc');if($d_t)$d_css.=';'.$d_t;
        $wrap_cls= $layout==='left'?'make-flex align-start':'make-flex flex-column '.($layout==='top-center'?'align-center text-center':'align-start');
        $icon_html = '<div style="width:'.($sz+$ic_p*2).'px;height:'.($sz+$ic_p*2).'px;background:'.$ic_bg.';border-radius:'.$ic_r.'px;display:flex;align-items:center;justify-content:center;font-size:'.$sz.'px;flex-shrink:0;'.($ic_c?'color:'.$ic_c.';':'').'">'.$icon.'</div>';
        echo '<div class="scb-icon-box '.$wrap_cls.'" style="gap:'.$ig.'px;">';
        echo $icon_html;
        echo '<div>';
        echo '<h3 style="font-size:18px;font-weight:600;margin-bottom:'.$tg.'px;'.$t_css.'">'.esc_html($s['title']??'').'</h3>';
        echo '<p style="font-size:14px;line-height:1.6;margin:0;'.$d_css.'">'.esc_html($s['description']??'').'</p>';
        if(!empty($s['link'])) echo '<a href="'.esc_url($s['link']).'" style="font-size:14px;font-weight:600;color:'.$lc.';display:inline-block;margin-top:8px;text-decoration:none;">'.esc_html($s['link_text']??'Learn more →').'</a>';
        echo '</div></div>';
    }
}
