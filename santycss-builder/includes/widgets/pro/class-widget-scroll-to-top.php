<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Scroll_To_Top extends Widget_Base {
    public function get_type(): string     { return 'scroll-to-top'; }
    public function get_title(): string    { return __('Scroll To Top','santycss-builder'); }
    public function get_icon(): string     { return '⬆'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->select('style','Button Style',['circle'=>'Circle','rounded'=>'Rounded','square'=>'Square'],'circle'),
            $this->color('bg_color','Background Color','#3b82f6'),
            $this->color('icon_color','Icon Color','#ffffff'),
            $this->number('size','Size (px)',48,24,120),
            $this->number('offset','Show After (px)',300,0,2000),
            $this->select('position','Position',['bottom-right'=>'Bottom Right','bottom-left'=>'Bottom Left','bottom-center'=>'Bottom Center'],'bottom-right'),
            $this->number('bottom','Distance from Bottom (px)',32,0,200),
            $this->number('side','Distance from Side (px)',32,0,200),
            $this->toggle('smooth','Smooth Scroll',true),
        ];
    }
    public function render(array $s): void {
        $uid   = 'scb-stt-'.uniqid();
        $bg    = esc_attr($s['bg_color']??'#3b82f6');
        $ic    = esc_attr($s['icon_color']??'#ffffff');
        $size  = intval($s['size']??48);
        $off   = intval($s['offset']??300);
        $pos   = $s['position']??'bottom-right';
        $bot   = intval($s['bottom']??32);
        $side  = intval($s['side']??32);
        $style = $s['style']??'circle';
        $rad   = $style==='circle'?'50%':($style==='rounded'?'12px':'4px');
        $smooth= !empty($s['smooth'])?'true':'false';

        $pos_css = "bottom:{$bot}px;";
        if($pos==='bottom-right')       $pos_css .= "right:{$side}px;";
        elseif($pos==='bottom-left')    $pos_css .= "left:{$side}px;";
        else                            $pos_css .= "left:50%;transform:translateX(-50%);";

        echo "<button id=\"{$uid}\" aria-label=\"Scroll to top\" style=\"position:fixed;{$pos_css}width:{$size}px;height:{$size}px;background:{$bg};color:{$ic};border:none;border-radius:{$rad};cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:9999;transition:opacity .3s,transform .3s;\" onmouseenter=\"this.style.transform=this.style.transform.replace('scale(1)','')+'scale(1.1)'\" onmouseleave=\"this.style.transform=this.style.transform.replace('scale(1.1)','')+'scale(1)'\">";
        echo "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".intval($size/2)."\" height=\"".intval($size/2)."\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"18 15 12 9 6 15\"></polyline></svg>";
        echo "</button>";
        echo "<script>(function(){var btn=document.getElementById('{$uid}'),off={$off},sm={$smooth};window.addEventListener('scroll',function(){btn.style.display=window.scrollY>off?'flex':'none';});btn.addEventListener('click',function(){if(sm){window.scrollTo({top:0,behavior:'smooth'});}else{window.scrollTo(0,0);}});})();</script>";
    }
}
