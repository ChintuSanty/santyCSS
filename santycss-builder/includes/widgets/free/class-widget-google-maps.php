<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Google_Maps extends Widget_Base {
    public function get_type(): string     { return 'google-maps'; }
    public function get_title(): string    { return __('Google Maps','santycss-builder'); }
    public function get_icon(): string     { return '🗺️'; }
    public function get_category(): string { return 'media'; }
    public function get_controls(): array {
        return [
            $this->text('address','Address or Embed URL','Mumbai, India'),
            $this->number('height','Height (px)',400,100,800),
            $this->number('radius','Border Radius (px)',8,0,50),
            $this->toggle('hide_controls','Hide Map Controls',false),
        ];
    }
    public function render(array $s): void {
        $addr=$s['address']??'';$h=intval($s['height']??400);$r=intval($s['radius']??8);
        if(filter_var($addr,FILTER_VALIDATE_URL)&&strpos($addr,'google.com/maps')!==false){
            $src=$addr;
        } else {
            $src='https://maps.google.com/maps?q='.urlencode($addr).'&output=embed';
        }
        echo "<div class=\"scb-maps\" style=\"border-radius:{$r}px;overflow:hidden;\">";
        echo "<iframe src=\"".esc_url($src)."\" width=\"100%\" height=\"{$h}\" style=\"border:0;display:block;\" allowfullscreen loading=\"lazy\"></iframe>";
        echo '</div>';
    }
}
