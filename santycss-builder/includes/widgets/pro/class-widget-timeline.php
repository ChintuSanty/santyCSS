<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Timeline extends Widget_Base {
    public function get_type(): string     { return 'timeline-pro'; }
    public function get_title(): string    { return __('Timeline','santycss-builder'); }
    public function get_icon(): string     { return '📅'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->repeater('events','Events',[$this->text('date','Date','2024'),$this->text('title','Title','Milestone'),$this->textarea('desc','Description','What happened here.'),$this->color('dot_color','Dot Color','#3b82f6'),$this->text('icon','Icon','✦')],[['date'=>'2022','title'=>'Founded','desc'=>'Company was founded.','dot_color'=>'#3b82f6','icon'=>'🚀'],['date'=>'2023','title'=>'First Product','desc'=>'Launched version 1.0.','dot_color'=>'#22c55e','icon'=>'🎉']]),
            $this->select('layout','Layout',['vertical'=>'Vertical','horizontal'=>'Horizontal'],'vertical'),
        ];
    }
    public function render(array $s): void {
        $events=$s['events']??[];$layout=$s['layout']??'vertical';
        echo '<div class="scb-timeline timeline'.($layout==='horizontal'?' timeline-horizontal make-flex gap-0':' ').'\">';
        foreach($events as $ev){
            $dc=esc_attr($ev['dot_color']??'#3b82f6');$icon=esc_html($ev['icon']??'✦');
            echo '<div class="timeline-item">';
            echo "<div class=\"timeline-dot\" style=\"background:{$dc};box-shadow:0 0 0 4px ".esc_attr($ev['dot_color']??'#3b82f6').'33;color:#fff;\">'.$icon.'</div>';
            echo '<div class="timeline-body">';
            echo '<div class="timeline-time">'.esc_html($ev['date']??'').'</div>';
            echo '<div class="timeline-title">'.esc_html($ev['title']??'').'</div>';
            echo '<div class="timeline-desc">'.esc_html($ev['desc']??'').'</div>';
            echo '</div></div>';
        }
        echo '</div>';
    }
}
