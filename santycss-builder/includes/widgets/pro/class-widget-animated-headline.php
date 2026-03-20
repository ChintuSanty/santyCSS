<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Animated_Headline extends Widget_Base {
    public function get_type(): string     { return 'animated-headline'; }
    public function get_title(): string    { return __('Animated Headline','santycss-builder'); }
    public function get_icon(): string     { return '✨'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->text('before','Before Text','We build'),
            $this->textarea('words','Rotating Words (one per line)',"beautiful\namazing\npowerful"),
            $this->text('after','After Text','websites'),
            $this->select('animation','Animation',['typing'=>'Typing','flip'=>'Flip','fade'=>'Fade','highlight'=>'Highlight'],'typing'),
            $this->color('accent_color','Accent Color','#3b82f6'),
            $this->number('speed','Typing Speed (ms)',100,20,500,10),
            $this->number('pause','Word Pause (ms)',2000,500,8000,500),
            $this->select('size','Size',['set-text-40'=>'Large','set-text-56'=>'XL','set-text-72'=>'XXL'],'set-text-56'),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
        ];
    }
    public function render(array $s): void {
        $uid   = 'scb-ah-'.uniqid();
        $words = array_filter(array_map('trim',explode("\n",$s['words']??'beautiful\namazing')));
        $color = esc_attr($s['accent_color']??'#3b82f6');
        $size  = $s['size']??'set-text-56';
        $align = $s['align']??'center';
        $anim  = $s['animation']??'typing';
        $speed = intval($s['speed']??100);
        $pause = intval($s['pause']??2000);
        echo "<div class=\"scb-animated-headline {$size} text-bold text-{$align}\">";
        echo '<span>'.esc_html($s['before']??'').' </span>';
        echo "<span id=\"{$uid}\" style=\"color:{$color};\"></span>";
        echo ' <span>'.esc_html($s['after']??'').'</span>';
        echo '</div>';
        $words_js=json_encode(array_values($words));
        if($anim==='typing'){
            echo "<script>(function(){var words={$words_js},el=document.getElementById('{$uid}'),wi=0,ci=0,del=false;function tick(){var w=words[wi];if(!del){el.textContent=w.slice(0,++ci);if(ci>=w.length){del=true;setTimeout(tick,{$pause});return;}}else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length;}}setTimeout(tick,{$speed});}tick();})();</script>";
        } else {
            echo "<script>(function(){var words={$words_js},el=document.getElementById('{$uid}'),i=0;el.textContent=words[0];setInterval(function(){el.style.opacity=0;setTimeout(function(){i=(i+1)%words.length;el.textContent=words[i];el.style.opacity=1;},300);},{$pause});el.style.transition='opacity .3s';})();</script>";
        }
    }
}
