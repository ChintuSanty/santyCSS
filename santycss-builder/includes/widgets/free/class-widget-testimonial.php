<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Testimonial extends Widget_Base {
    public function get_type(): string     { return 'testimonial'; }
    public function get_title(): string    { return __('Testimonial','santycss-builder'); }
    public function get_icon(): string     { return '💬'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->textarea('quote','Quote','This product completely changed how I work. Highly recommended!'),
            $this->text('name','Author Name','Jane Smith'),
            $this->text('role','Author Role','Frontend Developer'),
            $this->image('avatar','Avatar'),
            $this->number('rating','Rating (0-5)',5,0,5),
            $this->select('style','Card Style',['default'=>'Default','minimal'=>'Minimal','bordered'=>'Bordered'],'default'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('quote'),
            $this->typography_controls('name'),
            $this->typography_controls('role'),
            [
                $this->set_tab('style', $this->heading_control('Colors')),
                $this->set_tab('style', $this->color('card_bg','Card Background','#ffffff')),
                $this->set_tab('style', $this->color('quote_color','Quote Color','#374151')),
                $this->set_tab('style', $this->color('name_color','Name Color','#111827')),
                $this->set_tab('style', $this->color('role_color','Role Color','#9ca3af')),
                $this->set_tab('style', $this->color('star_color','Star Color','#f59e0b')),
                $this->set_tab('style', $this->color('border_color','Border Color','#e5e7eb')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Shape')),
                $this->set_tab('style', $this->number('card_radius','Card Radius (px)',16,0,50)),
                $this->set_tab('style', $this->number('card_padding','Card Padding (px)',28,0,80)),
                $this->set_tab('style', $this->number('avatar_size','Avatar Size (px)',44,24,120)),
                $this->set_tab('style', $this->toggle('avatar_circle','Round Avatar',true)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['quote_font_family']??'');
        $this->maybe_enqueue_font($s['name_font_family']??'');
        $this->maybe_enqueue_font($s['role_font_family']??'');
        $quote   = esc_html($s['quote']??'');
        $name    = esc_html($s['name']??'');
        $role    = esc_html($s['role']??'');
        $rating  = intval($s['rating']??5);
        $avatar  = esc_url($s['avatar']['url']??'');
        $cardstyle = $s['style']??'default';
        $align   = $s['align']??'left';
        $bg      = esc_attr($s['card_bg']??'#ffffff');
        $qc      = esc_attr($s['quote_color']??'#374151');
        $nc      = esc_attr($s['name_color']??'#111827');
        $rc      = esc_attr($s['role_color']??'#9ca3af');
        $sc      = esc_attr($s['star_color']??'#f59e0b');
        $bord    = esc_attr($s['border_color']??'#e5e7eb');
        $cr      = intval($s['card_radius']??16);$cp=intval($s['card_padding']??28);
        $av_sz   = intval($s['avatar_size']??44);
        $av_circ = !isset($s['avatar_circle'])||$s['avatar_circle'];
        $card_style = "background:{$bg};border-radius:{$cr}px;padding:{$cp}px;text-align:{$align};";
        if($cardstyle==='default') $card_style.='box-shadow:0 1px 3px rgba(0,0,0,.1);';
        elseif($cardstyle==='bordered') $card_style.="border:1px solid {$bord};";
        $q_css  = 'color:'.$qc; $q_t=$this->typography_css($s,'quote');if($q_t)$q_css.=';'.$q_t;
        $n_css  = 'color:'.$nc; $n_t=$this->typography_css($s,'name');if($n_t)$n_css.=';'.$n_t;
        $r_css  = 'color:'.$rc; $r_t=$this->typography_css($s,'role');if($r_t)$r_css.=';'.$r_t;
        $stars  = str_repeat('★',$rating).str_repeat('☆',5-$rating);
        $av_r   = $av_circ?'50%':'8px';
        echo "<div class=\"scb-testimonial\" style=\"{$card_style}\">";
        if($rating) echo "<div style=\"margin-bottom:16px;color:{$sc};font-size:18px;\">{$stars}</div>";
        echo "<p style=\"line-height:1.7;margin-bottom:20px;{$q_css}\">\"{$quote}\"</p>";
        echo '<div class="make-flex align-center gap-12"' . ($align==='center'?' style="justify-content:center;"':'') . '>';
        if($avatar) echo "<img src=\"{$avatar}\" alt=\"{$name}\" style=\"width:{$av_sz}px;height:{$av_sz}px;border-radius:{$av_r};object-fit:cover;flex-shrink:0;\">";
        else echo "<div style=\"width:{$av_sz}px;height:{$av_sz}px;border-radius:{$av_r};background:#3b82f6;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:".intval($av_sz/2)."px;flex-shrink:0;\">".esc_html(mb_substr($name,0,1))."</div>";
        echo "<div><div style=\"font-size:14px;font-weight:600;{$n_css}\">{$name}</div><div style=\"font-size:12px;{$r_css}\">{$role}</div></div>";
        echo '</div></div>';
    }
}
