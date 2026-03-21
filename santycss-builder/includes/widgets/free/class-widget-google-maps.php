<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Google_Maps extends Widget_Base {
    public function get_type(): string     { return 'google-maps'; }
    public function get_title(): string    { return __('Google Maps','santycss-builder'); }
    public function get_icon(): string     { return '🗺️'; }
    public function get_category(): string { return 'media'; }
    public function get_controls(): array {
        return [
            $this->text('address','Address or Embed URL','Mumbai, India'),
            $this->number('height','Height (px)',400,100,1200),
            $this->toggle('hide_controls','Hide Map Controls',false),
        ];
    }
    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Shape')),
            $this->set_tab('style', $this->number('radius','Border Radius (px)',8,0,50)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Border')),
            $this->set_tab('style', $this->select('map_border','Border Type',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed'],'none')),
            $this->set_tab('style', $this->number('map_border_width','Width (px)',2,1,20)),
            $this->set_tab('style', $this->color('map_border_color','Color','#e2e8f0')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Filter')),
            $this->set_tab('style', $this->slider('map_brightness','Brightness (%)',100,0,200)),
            $this->set_tab('style', $this->slider('map_saturate','Saturate (%)',100,0,200)),
            $this->set_tab('style', $this->slider('map_contrast','Contrast (%)',100,0,200)),
        ];
    }
    public function render(array $s): void {
        $addr = $s['address']??'';$h=intval($s['height']??400);
        $r    = intval($s['radius']??8);
        $bt   = $s['map_border']??'none';$bw=intval($s['map_border_width']??2);$bc=esc_attr($s['map_border_color']??'#e2e8f0');
        $mb   = intval($s['map_brightness']??100);$ms=intval($s['map_saturate']??100);$mc=intval($s['map_contrast']??100);
        $filter = ($mb!==100||$ms!==100||$mc!==100)?"filter:brightness({$mb}%) saturate({$ms}%) contrast({$mc}%);":"";
        if(filter_var($addr,FILTER_VALIDATE_URL)&&strpos($addr,'google.com/maps')!==false) $src=$addr;
        else $src='https://maps.google.com/maps?q='.urlencode($addr).'&output=embed';
        $border = $bt!=='none'?"border:{$bw}px {$bt} {$bc};":'';
        echo "<div class=\"scb-maps\" style=\"border-radius:{$r}px;overflow:hidden;{$border}\">";
        echo "<iframe src=\"".esc_url($src)."\" width=\"100%\" height=\"{$h}\" style=\"border:0;display:block;{$filter}\" allowfullscreen loading=\"lazy\"></iframe>";
        echo '</div>';
    }
}
