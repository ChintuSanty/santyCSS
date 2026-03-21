<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Flip_Box extends Widget_Base {
    public function get_type(): string     { return 'flip-box'; }
    public function get_title(): string    { return __('Flip Box','santycss-builder'); }
    public function get_icon(): string     { return '🔄'; }
    public function get_category(): string { return 'interactive'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->heading_control('Front Side'),
            $this->text('front_icon','Front Icon','⭐'),
            $this->text('front_title','Front Title','Hover Me'),
            $this->textarea('front_desc','Front Description','A short teaser shown on the front.'),
            $this->color('front_bg','Front Background','#1e40af'),
            $this->color('front_color','Front Text Color','#ffffff'),
            $this->heading_control('Back Side'),
            $this->text('back_title','Back Title','More Detail'),
            $this->textarea('back_desc','Back Description','The full explanation revealed on hover.'),
            $this->text('back_btn','Back Button Text','Learn More'),
            $this->url('back_url','Back Button URL','#'),
            $this->color('back_bg','Back Background','#0f172a'),
            $this->color('back_color','Back Text Color','#ffffff'),
            $this->select('direction','Flip Direction',['horizontal'=>'Horizontal','vertical'=>'Vertical'],'horizontal'),
            $this->number('height','Height (px)',280,120,600),
            $this->number('radius','Border Radius (px)',16,0,48),
        ];
    }
    public function render(array $s): void {
        $h=intval($s['height']??280);$r=intval($s['radius']??16);$dir=$s['direction']??'horizontal';
        $rot_front=$dir==='horizontal'?'rotateY(0deg)':'rotateX(0deg)';
        $rot_back =$dir==='horizontal'?'rotateY(180deg)':'rotateX(180deg)';
        $rot_hover=$dir==='horizontal'?'rotateY(180deg)':'rotateX(180deg)';
        echo "<div class=\"scb-flip-box\" style=\"perspective:1000px;height:{$h}px;\">";
        echo "<div class=\"scb-flip-inner\" style=\"position:relative;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d;border-radius:{$r}px;\">";
        // Front
        $fc=esc_attr($s['front_color']??'#fff');$fb=esc_attr($s['front_bg']??'#1e40af');
        echo "<div class=\"scb-flip-front\" style=\"position:absolute;inset:0;backface-visibility:hidden;background:{$fb};color:{$fc};border-radius:{$r}px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;\">";
        echo '<div style="font-size:48px;margin-bottom:16px;">'.esc_html($s['front_icon']??'⭐').'</div>';
        echo '<h3 style="font-size:22px;font-weight:700;margin:0 0 10px;">'.esc_html($s['front_title']??'').'</h3>';
        echo '<p style="font-size:14px;opacity:.85;margin:0;">'.esc_html($s['front_desc']??'').'</p>';
        echo '</div>';
        // Back
        $bc=esc_attr($s['back_color']??'#fff');$bb=esc_attr($s['back_bg']??'#0f172a');
        echo "<div class=\"scb-flip-back\" style=\"position:absolute;inset:0;backface-visibility:hidden;transform:{$rot_back};background:{$bb};color:{$bc};border-radius:{$r}px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;\">";
        echo '<h3 style="font-size:22px;font-weight:700;margin:0 0 12px;">'.esc_html($s['back_title']??'').'</h3>';
        echo '<p style="font-size:14px;opacity:.85;margin:0 0 24px;">'.esc_html($s['back_desc']??'').'</p>';
        if(!empty($s['back_btn'])) echo '<a href="'.esc_url($s['back_url']??'#').'" class="make-button style-secondary shape-pill">'.esc_html($s['back_btn']).'</a>';
        echo '</div></div></div>';
        echo "<style>.scb-flip-box:hover .scb-flip-inner{transform:{$rot_hover};}</style>";
    }
}
