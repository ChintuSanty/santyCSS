<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Alert extends Widget_Base {
    public function get_type(): string     { return 'alert'; }
    public function get_title(): string    { return __('Alert','santycss-builder'); }
    public function get_icon(): string     { return '⚠️'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->select('type','Type',['info'=>'Info','success'=>'Success','warning'=>'Warning','danger'=>'Danger'],'info'),
            $this->text('title','Title',''),
            $this->textarea('message','Message','This is an important notice.'),
            $this->toggle('dismissible','Dismissible',false),
            $this->toggle('show_icon','Show Icon',true),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('title'),
            $this->typography_controls('message'),
            [
                $this->set_tab('style', $this->heading_control('Custom Colors')),
                $this->set_tab('style', $this->color('custom_bg','Background Color','')),
                $this->set_tab('style', $this->color('custom_border','Border Color','')),
                $this->set_tab('style', $this->color('custom_title_color','Title Color','')),
                $this->set_tab('style', $this->color('custom_msg_color','Message Color','')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Shape')),
                $this->set_tab('style', $this->number('alert_radius','Border Radius (px)',8,0,50)),
                $this->set_tab('style', $this->number('alert_border_width','Border Width (px)',1,0,10)),
            ]
        );
    }
    private static array $map=['info'=>['#eff6ff','#bfdbfe','#1e40af','#1d4ed8','ℹ️'],'success'=>['#f0fdf4','#bbf7d0','#15803d','#16a34a','✅'],'warning'=>['#fffbeb','#fde68a','#92400e','#d97706','⚠️'],'danger'=>['#fef2f2','#fecaca','#991b1b','#dc2626','❌']];
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['title_font_family']??'');
        $this->maybe_enqueue_font($s['message_font_family']??'');
        $type=$s['type']??'info';$m=self::$map[$type]??self::$map['info'];
        $uid='scb-alert-'.uniqid();
        $r    = intval($s['alert_radius']??8);$bw=intval($s['alert_border_width']??1);
        $bg   = esc_attr(!empty($s['custom_bg'])?$s['custom_bg']:$m[0]);
        $bc   = esc_attr(!empty($s['custom_border'])?$s['custom_border']:$m[1]);
        $tc   = esc_attr(!empty($s['custom_title_color'])?$s['custom_title_color']:$m[2]);
        $mc   = esc_attr(!empty($s['custom_msg_color'])?$s['custom_msg_color']:$m[3]);
        $t_css = 'color:'.$tc;$t_typo=$this->typography_css($s,'title');if($t_typo)$t_css.=';'.$t_typo;
        $m_css = 'color:'.$mc;$m_typo=$this->typography_css($s,'message');if($m_typo)$m_css.=';'.$m_typo;
        echo "<div class=\"scb-alert\" id=\"{$uid}\" style=\"background:{$bg};border:{$bw}px solid {$bc};border-radius:{$r}px;padding:16px 20px;\">";
        echo '<div class="make-flex align-start gap-12">';
        if(!empty($s['show_icon'])) echo "<span style=\"font-size:18px;flex-shrink:0;\">{$m[4]}</span>";
        echo '<div style="flex:1;">';
        if(!empty($s['title'])) echo '<strong style="display:block;margin-bottom:4px;'.esc_attr($t_css).'">'.esc_html($s['title']).'</strong>';
        echo '<p style="margin:0;'.esc_attr($m_css).'">'.esc_html($s['message']??'').'</p>';
        echo '</div>';
        if(!empty($s['dismissible'])) echo "<button onclick=\"document.getElementById('{$uid}').remove()\" style=\"border:none;background:transparent;font-size:20px;cursor:pointer;line-height:1;flex-shrink:0;color:{$mc};\">×</button>";
        echo '</div></div>';
    }
}
