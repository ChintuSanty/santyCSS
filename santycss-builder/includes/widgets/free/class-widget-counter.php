<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Counter extends Widget_Base {
    public function get_type(): string     { return 'counter'; }
    public function get_title(): string    { return __('Counter','santycss-builder'); }
    public function get_icon(): string     { return '🔢'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->number('end','End Number',1000,0,999999),
            $this->number('start','Start Number',0,0,999999),
            $this->number('duration','Duration (ms)',2000,200,10000,100),
            $this->text('prefix','Prefix',''),
            $this->text('suffix','Suffix','+'),
            $this->text('title','Title','Happy Clients'),
            $this->color('number_color','Number Color','#1d4ed8'),
            $this->select('size','Number Size',['set-text-48'=>'Large','set-text-64'=>'XL','set-text-80'=>'XXL'],'set-text-64'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
        ];
    }
    public function render(array $s): void {
        $uid  = 'scb-cnt-'.uniqid();
        $end  = intval($s['end']??1000);$start=intval($s['start']??0);$dur=intval($s['duration']??2000);
        $pre  = esc_html($s['prefix']??'');$suf=esc_html($s['suffix']??'+');
        $nc   = esc_attr($s['number_color']??'#1d4ed8');$sz=$s['size']??'set-text-64';
        $align=$s['align']??'center';
        echo "<div class=\"scb-counter text-{$align}\">";
        echo "<div class=\"{$sz} text-bold\" style=\"color:{$nc};line-height:1;\"><span>{$pre}</span><span id=\"{$uid}\">{$start}</span><span>{$suf}</span></div>";
        echo '<div class="set-text-16 color-gray-500 add-margin-top-8">'.esc_html($s['title']??'').'</div>';
        echo '</div>';
        echo "<script>(function(){var el=document.getElementById('{$uid}'),obs=new IntersectionObserver(function(en){if(en[0].isIntersecting){obs.disconnect();var s={$start},e={$end},d={$dur},st=null;function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/d,1);el.textContent=Math.floor(s+(e-s)*p).toLocaleString();if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}},{threshold:.5});obs.observe(el);})();</script>";
    }
}
