<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Container extends Widget_Base {
    public function get_type(): string     { return 'container'; }
    public function get_title(): string    { return __('Container','santycss-builder'); }
    public function get_icon(): string     { return '📦'; }
    public function get_category(): string { return 'layout'; }

    public function get_controls(): array {
        return [
            $this->wysiwyg('content','Content','<p>Add your content here.</p>'),
            $this->select('text_align','Text Align',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls(),
            [
                $this->set_tab('style', $this->heading_control('Colors')),
                $this->set_tab('style', $this->color('text_color','Text Color','#374151')),
                $this->set_tab('style', $this->color('bg_color','Background Color','#f8fafc')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Border')),
                $this->set_tab('style', $this->select('border_style','Border Style',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed','dotted'=>'Dotted'],'solid')),
                $this->set_tab('style', $this->number('border_width','Border Width (px)',1,0,20)),
                $this->set_tab('style', $this->color('border_color','Border Color','#e2e8f0')),
                $this->set_tab('style', $this->number('border_radius_tl','Radius TL (px)',8,0,100)),
                $this->set_tab('style', $this->number('border_radius_tr','Radius TR (px)',8,0,100)),
                $this->set_tab('style', $this->number('border_radius_br','Radius BR (px)',8,0,100)),
                $this->set_tab('style', $this->number('border_radius_bl','Radius BL (px)',8,0,100)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Box Shadow')),
                $this->set_tab('style', $this->select('shadow','Box Shadow',['none'=>'None','sm'=>'Small','md'=>'Medium','lg'=>'Large','custom'=>'Custom'],'none')),
                $this->set_tab('style', $this->number('shadow_h','H (px)',0,-50,50)),
                $this->set_tab('style', $this->number('shadow_v','V (px)',4,-50,50)),
                $this->set_tab('style', $this->number('shadow_blur','Blur (px)',12,0,100)),
                $this->set_tab('style', $this->color('shadow_color','Shadow Color','rgba(0,0,0,0.1)')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Spacing')),
                $this->set_tab('style', $this->number('padding_y','Padding Top/Bottom (px)',24,0,120)),
                $this->set_tab('style', $this->number('padding_x','Padding Left/Right (px)',24,0,120)),
                $this->set_tab('style', $this->number('margin_y','Margin Top/Bottom (px)',0,0,120)),
                $this->set_tab('style', $this->number('max_width','Max Width (px)',0,0,2000)),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font($s['font_family']??'');
        $bg      = esc_attr($s['bg_color']    ?? '#f8fafc');
        $tc      = esc_attr($s['text_color']  ?? '#374151');
        $bs      = $s['border_style']  ?? 'solid';
        $bw      = intval($s['border_width']  ?? 1);
        $bc      = esc_attr($s['border_color'] ?? '#e2e8f0');
        $r_tl    = intval($s['border_radius_tl']??8);$r_tr=intval($s['border_radius_tr']??8);
        $r_br    = intval($s['border_radius_br']??8);$r_bl=intval($s['border_radius_bl']??8);
        $py      = intval($s['padding_y']     ?? 24);
        $px      = intval($s['padding_x']     ?? 24);
        $my      = intval($s['margin_y']      ?? 0);
        $mw      = intval($s['max_width']     ?? 0);
        $align   = esc_attr($s['text_align']  ?? 'left');
        $sh      = $s['shadow']??'none';
        $shadow_map=['none'=>'none','sm'=>'0 1px 3px rgba(0,0,0,.1)','md'=>'0 4px 6px rgba(0,0,0,.07)','lg'=>'0 10px 15px rgba(0,0,0,.1)'];
        if($sh==='custom') {
            $sh_h=intval($s['shadow_h']??0);$sh_v=intval($s['shadow_v']??4);$sh_b=intval($s['shadow_blur']??12);$sh_c=esc_attr($s['shadow_color']??'rgba(0,0,0,0.1)');
            $box_shadow = "{$sh_h}px {$sh_v}px {$sh_b}px {$sh_c}";
        } else $box_shadow = $shadow_map[$sh]??'none';
        $typo = $this->typography_css($s);
        $style = "background:{$bg};color:{$tc};";
        if($bs!=='none') $style.="border:{$bw}px {$bs} {$bc};";
        $style.="border-radius:{$r_tl}px {$r_tr}px {$r_br}px {$r_bl}px;";
        $style.="padding:{$py}px {$px}px;margin:{$my}px 0;text-align:{$align};box-shadow:{$box_shadow};";
        if($mw) $style.="max-width:{$mw}px;margin-left:auto;margin-right:auto;";
        if($typo) $style.=$typo;
        echo '<div class="scb-container" style="'.esc_attr($style).'">';
        echo wp_kses_post($s['content'] ?? '');
        echo '</div>';
    }
}
