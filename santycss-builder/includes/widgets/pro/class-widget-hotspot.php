<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Hotspot extends Widget_Base {
    public function get_type(): string     { return 'hotspot'; }
    public function get_title(): string    { return __('Hotspot Image','santycss-builder'); }
    public function get_icon(): string     { return '📍'; }
    public function get_category(): string { return 'media'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->image('image','Background Image'),
            $this->repeater('spots','Hotspots',[$this->number('x','X Position %',50,0,100),$this->number('y','Y Position %',50,0,100),$this->text('title','Title','Point of Interest'),$this->textarea('desc','Description','Details about this point.'),$this->color('color','Dot Color','#3b82f6')],[]),
        ];
    }
    public function render(array $s): void {
        $img=esc_url($s['image']['url']??'');$spots=$s['spots']??[];
        echo '<div class="scb-hotspot" style="position:relative;display:inline-block;width:100%;">';
        if($img) echo "<img src=\"{$img}\" style=\"width:100%;display:block;border-radius:12px;\">";
        else echo '<div style="background:#e5e7eb;height:400px;border-radius:12px;display:flex;align-items:center;justify-content:center;">🖼️ Add background image</div>';
        foreach($spots as $sp){
            $x=intval($sp['x']??50);$y=intval($sp['y']??50);$c=esc_attr($sp['color']??'#3b82f6');
            $uid='sp-'.uniqid();
            echo "<div style=\"position:absolute;left:{$x}%;top:{$y}%;transform:translate(-50%,-50%);\">";
            echo "<div id=\"{$uid}\" style=\"width:24px;height:24px;border-radius:50%;background:{$c};border:3px solid white;box-shadow:0 0 0 4px {$c}44;cursor:pointer;animation:scb-pulse 2s infinite;\" onclick=\"document.getElementById('{$uid}-tip').style.display=document.getElementById('{$uid}-tip').style.display==='block'?'none':'block'\"></div>";
            echo "<div id=\"{$uid}-tip\" style=\"display:none;position:absolute;bottom:32px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;border-radius:10px;padding:12px 16px;min-width:180px;z-index:10;\">";
            echo '<div style="font-size:13px;font-weight:600;margin-bottom:4px;">'.esc_html($sp['title']??'').'</div>';
            echo '<div style="font-size:12px;opacity:.8;">'.esc_html($sp['desc']??'').'</div>';
            echo '</div></div>';
        }
        echo '</div>';
        echo '<style>@keyframes scb-pulse{0%,100%{box-shadow:0 0 0 4px rgba(59,130,246,.4);}50%{box-shadow:0 0 0 8px rgba(59,130,246,.15);}}</style>';
    }
}
