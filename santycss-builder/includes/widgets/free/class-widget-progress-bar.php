<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Progress_Bar extends Widget_Base {
    public function get_type(): string     { return 'progress-bar'; }
    public function get_title(): string    { return __('Progress Bar','santycss-builder'); }
    public function get_icon(): string     { return '📊'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('bars','Bars',[
                $this->text('label','Label','HTML'),
                $this->number('value','Value %',80,0,100),
                $this->color('color','Bar Color','#3b82f6'),
            ],[
                ['label'=>'HTML','value'=>90,'color'=>'#f97316'],
                ['label'=>'CSS','value'=>80,'color'=>'#3b82f6'],
                ['label'=>'JavaScript','value'=>70,'color'=>'#8b5cf6'],
            ]),
            $this->number('height','Bar Height (px)',10,4,32),
            $this->toggle('show_value','Show Value %',true),
            $this->toggle('animate','Animate on Scroll',true),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('label'),
            [
                $this->set_tab('style', $this->heading_control('Track')),
                $this->set_tab('style', $this->color('track_color','Track Background','#e5e7eb')),
                $this->set_tab('style', $this->number('bar_radius','Border Radius (px)',9999,0,9999)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Label')),
                $this->set_tab('style', $this->color('label_color','Label Color','#374151')),
                $this->set_tab('style', $this->color('value_color','Value Color','#374151')),
                $this->set_tab('style', $this->number('label_gap','Gap Below Label (px)',6,0,20)),
                $this->set_tab('style', $this->number('bar_gap','Gap Between Bars (px)',16,4,48)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['label_font_family']??'');
        $bars    = $s['bars']??[];$h=intval($s['height']??10);$show=!empty($s['show_value']);
        $animate = !isset($s['animate'])||$s['animate'];
        $track   = esc_attr($s['track_color']??'#e5e7eb');
        $r       = intval($s['bar_radius']??9999);
        $lc      = esc_attr($s['label_color']??'#374151');
        $vc      = esc_attr($s['value_color']??'#374151');
        $lg      = intval($s['label_gap']??6);$bg=intval($s['bar_gap']??16);
        $l_typo  = $this->typography_css($s,'label');
        $uid     = 'scb-pb-'.uniqid();
        echo '<div class="scb-progress-bars make-flex flex-column" id="'.$uid.'" style="gap:'.$bg.'px;">';
        foreach($bars as $bar){
            $lbl=esc_html($bar['label']??'');$val=intval($bar['value']??0);$col=esc_attr($bar['color']??'#3b82f6');
            echo '<div>';
            if($lbl||$show) {
                echo '<div class="make-flex justify-between" style="margin-bottom:'.$lg.'px;'.($l_typo?$l_typo:'font-size:13px;font-weight:600').'">';
                echo '<span style="color:'.$lc.'">'.$lbl.'</span>';
                if($show) echo '<span style="color:'.$vc.'">'.$val.'%</span>';
                echo '</div>';
            }
            $actual_val = $animate ? 0 : $val;
            echo '<div style="background:'.$track.';border-radius:'.$r.'px;height:'.$h.'px;overflow:hidden;">';
            echo '<div class="scb-bar-fill" data-target="'.$val.'" style="width:'.$actual_val.'%;background:'.$col.';height:100%;border-radius:'.$r.'px;transition:width .6s ease;"></div>';
            echo '</div></div>';
        }
        echo '</div>';
        if($animate) echo "<script>(function(){var el=document.getElementById('{$uid}');if(!el)return;var obs=new IntersectionObserver(function(en){if(en[0].isIntersecting){obs.disconnect();el.querySelectorAll('.scb-bar-fill').forEach(function(b){b.style.width=b.dataset.target+'%';});}},{threshold:.3});obs.observe(el);})();</script>";
    }
}
