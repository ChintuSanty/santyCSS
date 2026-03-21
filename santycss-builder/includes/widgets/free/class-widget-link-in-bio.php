<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Link_In_Bio extends Widget_Base {
    public function get_type(): string     { return 'link-in-bio'; }
    public function get_title(): string    { return __('Link in Bio','santycss-builder'); }
    public function get_icon(): string     { return '🔗'; }
    public function get_category(): string { return 'content'; }

    public function get_controls(): array {
        return [
            $this->heading_control('Profile'),
            $this->image('avatar','Profile Photo'),
            $this->text('name','Display Name','Your Name'),
            $this->text('bio','Bio / Tagline','Short description about you'),
            $this->divider_control(),
            $this->heading_control('Links'),
            $this->repeater('links','Link Buttons',[
                $this->text('label','Label','My Website'),
                $this->url('url','URL','#'),
                $this->color('bg_color','Background','#1e293b'),
                $this->color('text_color','Text Color','#ffffff'),
                $this->text('icon','Icon (emoji)','🌐'),
                $this->toggle('new_tab','Open in New Tab',false),
            ],[
                ['label'=>'My Website','url'=>'#','bg_color'=>'#1e293b','text_color'=>'#ffffff','icon'=>'🌐','new_tab'=>false],
                ['label'=>'Instagram','url'=>'#','bg_color'=>'#e1306c','text_color'=>'#ffffff','icon'=>'📸','new_tab'=>true],
                ['label'=>'YouTube','url'=>'#','bg_color'=>'#ff0000','text_color'=>'#ffffff','icon'=>'🎬','new_tab'=>true],
            ]),
            $this->divider_control(),
            $this->heading_control('Layout'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
            $this->number('max_width','Max Width (px)',480,200,960),
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('name'),
            $this->typography_controls('bio'),
            $this->typography_controls('btn'),
            [
                $this->set_tab('style', $this->heading_control('Background')),
                $this->set_tab('style', $this->color('page_bg','Page Background','#ffffff')),
                $this->set_tab('style', $this->number('page_padding','Padding (px)',32,0,80)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Avatar')),
                $this->set_tab('style', $this->number('avatar_size','Avatar Size (px)',88,40,200)),
                $this->set_tab('style', $this->toggle('avatar_circle','Round Avatar',true)),
                $this->set_tab('style', $this->color('avatar_border_color','Avatar Border Color','')),
                $this->set_tab('style', $this->number('avatar_border_width','Avatar Border Width (px)',0,0,10)),
                $this->set_tab('style', $this->number('name_gap','Gap After Avatar (px)',16,0,48)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Name & Bio Colors')),
                $this->set_tab('style', $this->color('name_color','Name Color','#111827')),
                $this->set_tab('style', $this->color('bio_color','Bio Color','#9ca3af')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Button Shape')),
                $this->set_tab('style', $this->number('btn_radius','Button Radius (px)',8,0,9999)),
                $this->set_tab('style', $this->number('btn_gap','Gap Between Buttons (px)',12,4,48)),
                $this->set_tab('style', $this->number('btn_padding_y','Button Padding Y (px)',14,4,40)),
                $this->set_tab('style', $this->number('btn_padding_x','Button Padding X (px)',20,4,60)),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font($s['name_font_family']??'');
        $this->maybe_enqueue_font($s['bio_font_family']??'');
        $this->maybe_enqueue_font($s['btn_font_family']??'');
        $bg      = esc_attr($s['page_bg']   ?? '#ffffff');
        $align   = $s['align']              ?? 'center';
        $br      = intval($s['btn_radius']  ?? 8);
        $gap     = intval($s['btn_gap']     ?? 12);
        $mw      = intval($s['max_width']   ?? 480);
        $pad     = intval($s['page_padding']?? 32);
        $links   = $s['links']              ?? [];
        $avatar  = $s['avatar']             ?? ['url'=>'','id'=>0];
        $name    = esc_html($s['name']      ?? '');
        $bio     = esc_html($s['bio']       ?? '');
        $av_sz   = intval($s['avatar_size'] ?? 88);
        $av_circ = !isset($s['avatar_circle'])||$s['avatar_circle'];
        $av_r    = $av_circ?'50%':'8px';
        $av_bc   = esc_attr($s['avatar_border_color']??'');
        $av_bw   = intval($s['avatar_border_width']??0);
        $nc      = esc_attr($s['name_color']?? '#111827');
        $bc      = esc_attr($s['bio_color'] ?? '#9ca3af');
        $nm_gap  = intval($s['name_gap']    ?? 16);
        $by      = intval($s['btn_padding_y']??14);$bx=intval($s['btn_padding_x']??20);
        $n_css   = 'color:'.$nc; $n_t=$this->typography_css($s,'name');if($n_t)$n_css.=';'.$n_t;
        $bi_css  = 'color:'.$bc; $b_t=$this->typography_css($s,'bio');if($b_t)$bi_css.=';'.$b_t;
        $btn_typo= $this->typography_css($s,'btn');
        $ta      = 'text-align:'.$align.';';
        echo '<div class="scb-link-in-bio" style="background:'.$bg.';max-width:'.$mw.'px;margin:0 auto;padding:'.$pad.'px;'.$ta.'">';
        if ( ! empty($avatar['url']) ) {
            $av_bord = $av_bw&&$av_bc?"border:{$av_bw}px solid {$av_bc};":'';
            echo '<img src="'.esc_url($avatar['url']).'" alt="'.$name.'" style="width:'.$av_sz.'px;height:'.$av_sz.'px;object-fit:cover;display:block;margin-left:auto;margin-right:auto;border-radius:'.$av_r.';'.$av_bord.'margin-bottom:'.$nm_gap.'px;">';
        }
        if ( $name ) echo '<h3 style="font-size:20px;font-weight:700;margin-bottom:8px;'.$n_css.'">'.$name.'</h3>';
        if ( $bio  ) echo '<p style="font-size:14px;margin-bottom:24px;'.$bi_css.'">'.$bio.'</p>';
        foreach ( $links as $link ) {
            $lbl    = esc_html($link['label']       ?? '');
            $url    = esc_url($link['url']           ?? '#');
            $lbg    = esc_attr($link['bg_color']     ?? '#1e293b');
            $ltc    = esc_attr($link['text_color']   ?? '#ffffff');
            $icon   = esc_html($link['icon']         ?? '');
            $target = ! empty($link['new_tab']) ? ' target="_blank" rel="noopener noreferrer"' : '';
            echo '<a href="'.$url.'"'.$target.' style="display:flex;align-items:center;justify-content:center;gap:8px;background:'.$lbg.';color:'.$ltc.';padding:'.$by.'px '.$bx.'px;border-radius:'.$br.'px;margin-bottom:'.$gap.'px;text-decoration:none;transition:opacity .15s;'.($btn_typo?$btn_typo:'font-size:15px;font-weight:600').'" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'">';
            if ( $icon ) echo '<span style="font-size:18px;">'.$icon.'</span>';
            echo $lbl.'</a>';
        }
        echo '</div>';
    }
}
