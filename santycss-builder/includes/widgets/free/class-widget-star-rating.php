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
            $this->number('size','Star Size (px)',24,12,64),
            $this->color('filled_color','Filled Color','#f59e0b'),
            $this->color('empty_color','Empty Color','#d1d5db'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }
    public function render(array $s): void {
        $r=intval($s['rating']??4);$m=intval($s['max']??5);$sz=intval($s['size']??24);
        $fc=esc_attr($s['filled_color']??'#f59e0b');$ec=esc_attr($s['empty_color']??'#d1d5db');
        $align=$s['align']??'left';
        echo "<div class=\"scb-star-rating make-flex align-center gap-8 justify-{$align}\">";
        echo "<div style=\"display:flex;gap:2px;\">";
        for($i=1;$i<=$m;$i++) echo "<span style=\"font-size:{$sz}px;color:".($i<=$r?$fc:$ec).";\">★</span>";
        echo '</div>';
        if(!empty($s['label'])) echo '<span class="set-text-14 color-gray-500">'.esc_html($s['label']).'</span>';
        echo '</div>';
    }
}
