<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Countdown extends Widget_Base {
    public function get_type(): string     { return 'countdown'; }
    public function get_title(): string    { return __('Countdown','santycss-builder'); }
    public function get_icon(): string     { return '⏳'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('date','End Date (YYYY-MM-DD HH:MM:SS)',date('Y-m-d H:i:s', strtotime('+30 days'))),
            $this->select('style','Style',['boxes'=>'Boxes','minimal'=>'Minimal'],'boxes'),
            $this->toggle('show_labels','Show Labels',true),
            $this->color('box_bg','Box Background','#1e40af'),
            $this->color('number_color','Number Color','#ffffff'),
            $this->text('expired_text','Expired Message','Event has ended'),
        ];
    }
    public function render(array $s): void {
        $uid    = 'scb-cd-'.uniqid();
        $date   = esc_js($s['date']??date('Y-m-d H:i:s',strtotime('+30 days')));
        $style  = $s['style']??'boxes';
        $bg     = esc_attr($s['box_bg']??'#1e40af');
        $nc     = esc_attr($s['number_color']??'#ffffff');
        $box_s  = $style==='boxes'?"background:{$bg};border-radius:12px;padding:12px 20px;min-width:70px;":"padding:0 12px;";
        $labels = ['days'=>'Days','hours'=>'Hours','minutes'=>'Minutes','seconds'=>'Seconds'];
        echo "<div class=\"scb-countdown make-flex gap-12 flex-wrap\" id=\"{$uid}\">";
        foreach($labels as $k=>$lbl){
            echo "<div class=\"make-flex flex-column align-center\" style=\"{$box_s}\">";
            echo "<span class=\"scb-cd-{$k} set-text-36 text-bold\" style=\"color:{$nc};line-height:1;\">00</span>";
            if(!empty($s['show_labels'])) echo "<span class=\"set-text-11 text-uppercase\" style=\"color:{$nc};opacity:.7;margin-top:4px;letter-spacing:.06em;\">".esc_html($lbl).'</span>';
            echo '</div>';
        }
        echo '</div>';
        $exp = esc_js($s['expired_text']??'Event has ended');
        echo "<script>(function(){var end=new Date('{$date}').getTime(),el=document.getElementById('{$uid}');if(!el)return;function tick(){var now=new Date().getTime(),d=end-now;if(d<0){el.innerHTML='<p>{$exp}</p>';return;}var days=Math.floor(d/864e5),hours=Math.floor((d%864e5)/36e5),mins=Math.floor((d%36e5)/6e4),secs=Math.floor((d%6e4)/1e3);['days','hours','minutes','seconds'].forEach(function(k,i){var val=[days,hours,mins,secs][i];var span=el.querySelector('.scb-cd-'+k);if(span)span.textContent=String(val).padStart(2,'0');});setTimeout(tick,1000);}tick();})();</script>";
    }
}
