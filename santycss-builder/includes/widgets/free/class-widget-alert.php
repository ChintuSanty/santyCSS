<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Alert extends Widget_Base {
    public function get_type(): string     { return 'alert'; }
    public function get_title(): string    { return __('Alert','santycss-builder'); }
    public function get_icon(): string     { return '⚠️'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->select('type','Type',['info'=>'Info','success'=>'Success','warning'=>'Warning','danger'=>'Danger'],'info'),
            $this->text('title','Title',''),
            $this->textarea('message','Message','This is an important notice.'),
            $this->toggle('dismissible','Dismissible',false),
        ];
    }
    public function render(array $s): void {
        $type = $s['type']??'info';
        $map  = ['info'=>['blue','ℹ️'],'success'=>['green','✅'],'warning'=>['amber','⚠️'],'danger'=>['red','❌']];
        $c    = $map[$type]??$map['info'];
        $uid  = 'scb-alert-'.uniqid();
        echo "<div class=\"scb-alert alert alert-{$type}\" id=\"{$uid}\">";
        echo "<div class=\"make-flex align-start gap-12\">";
        echo "<span style=\"font-size:18px;flex-shrink:0;\">{$c[1]}</span>";
        echo '<div style="flex:1;">';
        if(!empty($s['title'])) echo '<strong class="set-text-14 text-semibold">'.esc_html($s['title']).'</strong>';
        echo '<p class="set-text-14" style="margin:'.(!empty($s['title'])?'4px 0 0':'0').';">'.esc_html($s['message']??'').'</p>';
        echo '</div>';
        if(!empty($s['dismissible'])) echo "<button onclick=\"document.getElementById('{$uid}').remove()\" style=\"border:none;background:transparent;font-size:18px;cursor:pointer;line-height:1;flex-shrink:0;\">×</button>";
        echo '</div></div>';
    }
}
