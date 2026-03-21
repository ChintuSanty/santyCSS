<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Star_Rating extends Widget_Base {
    public function get_type(): string     { return 'star-rating'; }
    public function get_title(): string    { return __('Star Rating','santycss-builder'); }
    public function get_icon(): string     { return '⭐'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->number('rating','Rating',4,0,5,1),
            $this->number('max','Max Stars',5,1,10),
            $this->text('label','Label',''),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('label'),
            [
                $this->set_tab('style', $this->heading_control('Stars')),
                $this->set_tab('style', $this->number('size','Star Size (px)',24,12,64)),
                $this->set_tab('style', $this->number('star_gap','Star Gap (px)',2,0,20)),
                $this->set_tab('style', $this->color('filled_color','Filled Color','#f59e0b')),
                $this->set_tab('style', $this->color('empty_color','Empty Color','#d1d5db')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Label')),
                $this->set_tab('style', $this->color('label_color','Label Color','#6b7280')),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['label_font_family']??'');
        $r     = intval($s['rating']??4);$m=intval($s['max']??5);
        $sz    = intval($s['size']??24);$gap=intval($s['star_gap']??2);
        $fc    = esc_attr($s['filled_color']??'#f59e0b');$ec=esc_attr($s['empty_color']??'#d1d5db');
        $align = $s['align']??'left';
        $lc    = esc_attr($s['label_color']??'#6b7280');
        $lbl_css = 'color:'.$lc;
        $lbl_typo= $this->typography_css($s,'label');if($lbl_typo) $lbl_css.=';'.$lbl_typo;
        echo "<div class=\"scb-star-rating make-flex align-center gap-8 justify-{$align}\">";
        echo "<div style=\"display:flex;gap:{$gap}px;\">";
        for($i=1;$i<=$m;$i++) echo "<span style=\"font-size:{$sz}px;color:".($i<=$r?$fc:$ec).";\">★</span>";
        echo '</div>';
        if(!empty($s['label'])) echo '<span style="'.esc_attr($lbl_css).'">'.esc_html($s['label']).'</span>';
        echo '</div>';
    }
}
