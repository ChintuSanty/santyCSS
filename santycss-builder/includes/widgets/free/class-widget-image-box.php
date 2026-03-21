<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Image_Box extends Widget_Base {
    public function get_type(): string     { return 'image-box'; }
    public function get_title(): string    { return __('Image Box','santycss-builder'); }
    public function get_icon(): string     { return '🗃️'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->image('image','Image'),
            $this->text('title','Title','Feature Title'),
            $this->textarea('description','Description','Your feature description goes here.'),
            $this->url('link','Link',''),
            $this->select('position','Image Position',['top'=>'Top','left'=>'Left','right'=>'Right'],'top'),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('title'),
            $this->typography_controls('desc'),
            [
                $this->set_tab('style', $this->heading_control('Image')),
                $this->set_tab('style', $this->number('img_width','Image Width (px)',80,20,600)),
                $this->set_tab('style', $this->number('img_radius','Image Radius (px)',8,0,100)),
                $this->set_tab('style', $this->select('img_fit','Image Fit',['cover'=>'Cover','contain'=>'Contain','fill'=>'Fill'],'cover')),
                $this->set_tab('style', $this->number('img_height','Image Height (px)',0,0,600)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Colors')),
                $this->set_tab('style', $this->color('title_color','Title Color','#111827')),
                $this->set_tab('style', $this->color('desc_color','Description Color','#6b7280')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Spacing')),
                $this->set_tab('style', $this->number('content_gap','Content Gap (px)',16,0,60)),
                $this->set_tab('style', $this->number('title_gap','Title Gap (px)',8,0,40)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['title_font_family']??'');
        $this->maybe_enqueue_font($s['desc_font_family']??'');
        $img_url = esc_url($s['image']['url']??'');
        $title   = esc_html($s['title']??'');
        $desc    = esc_html($s['description']??'');
        $pos     = $s['position']??'top';
        $w       = intval($s['img_width']??80);
        $r       = intval($s['img_radius']??8);
        $fit     = $s['img_fit']??'cover';
        $mh      = intval($s['img_height']??0);
        $cg      = intval($s['content_gap']??16);$tg=intval($s['title_gap']??8);
        $tc      = esc_attr($s['title_color']??'#111827');$dc=esc_attr($s['desc_color']??'#6b7280');
        $t_css   = 'color:'.$tc;$t_t=$this->typography_css($s,'title');if($t_t)$t_css.=';'.$t_t;
        $d_css   = 'color:'.$dc;$d_t=$this->typography_css($s,'desc');if($d_t)$d_css.=';'.$d_t;
        $wrap_cls= $pos==='top'?'make-flex flex-column align-center text-center':'make-flex align-start';
        if($pos==='right') $wrap_cls.=' flex-row-reverse';
        $img_style= "width:{$w}px;height:".($mh?$mh.'px':'auto').";border-radius:{$r}px;flex-shrink:0;object-fit:{$fit};";
        $inner = $img_url
            ? "<img src=\"{$img_url}\" style=\"{$img_style}\" alt=\"\">"
            : "<div style=\"width:{$w}px;height:".($mh?$mh:$w)."px;border-radius:{$r}px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;\">🖼️</div>";
        echo '<div class="scb-image-box '.$wrap_cls.'" style="gap:'.$cg.'px;">';
        if(!empty($s['link'])) echo '<a href="'.esc_url($s['link']).'" style="text-decoration:none;color:inherit;display:contents;">';
        echo $inner;
        echo '<div><h3 style="font-size:18px;font-weight:600;margin-bottom:'.$tg.'px;'.$t_css.'">'.$title.'</h3>';
        echo '<p style="font-size:14px;line-height:1.6;margin:0;'.$d_css.'">'.$desc.'</p></div>';
        if(!empty($s['link'])) echo '</a>';
        echo '</div>';
    }
}
