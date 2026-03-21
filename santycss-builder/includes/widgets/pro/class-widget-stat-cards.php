<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Stat_Cards extends Widget_Base {
    public function get_type(): string     { return 'stat-cards'; }
    public function get_title(): string    { return __('Stat Cards','santycss-builder'); }
    public function get_icon(): string     { return '📈'; }
    public function get_category(): string { return 'content'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->repeater('stats','Stats',[$this->text('label','Label','Revenue'),$this->text('value','Value','$24K'),$this->text('change','Change','+12%'),$this->select('trend','Trend',['up'=>'Up','down'=>'Down','neutral'=>'Neutral'],'up'),$this->text('icon','Icon','💰'),$this->color('icon_bg','Icon Background','#eff6ff')],[['label'=>'Revenue','value'=>'$24K','change'=>'+12%','trend'=>'up','icon'=>'💰','icon_bg'=>'#eff6ff'],['label'=>'Users','value'=>'1,240','change'=>'+8%','trend'=>'up','icon'=>'👥','icon_bg'=>'#f0fdf4'],['label'=>'Orders','value'=>'384','change'=>'-3%','trend'=>'down','icon'=>'📦','icon_bg'=>'#fff7ed']]),
            $this->select('columns','Columns',['2'=>'2','3'=>'3','4'=>'4'],'3'),
        ];
    }
    public function render(array $s): void {
        $stats=$s['stats']??[];$cols=$s['columns']??'3';
        $grid=['2'=>'grid-cols-2','3'=>'grid-cols-3','4'=>'grid-cols-4'][$cols]??'grid-cols-3';
        echo "<div class=\"scb-stat-cards make-grid {$grid} gap-20\">";
        foreach($stats as $st){
            $trend=$st['trend']??'neutral';$tc=$trend==='up'?'#16a34a':($trend==='down'?'#dc2626':'#6b7280');$ta=$trend==='up'?'↑':($trend==='down'?'↓':'→');
            echo '<div class="stat-card">';
            echo '<div class="make-flex align-center justify-between add-margin-bottom-16">';
            echo '<div class="set-text-13 color-gray-500 text-semibold">'.esc_html($st['label']??'').'</div>';
            $ib=esc_attr($st['icon_bg']??'#eff6ff');
            echo "<div style=\"width:40px;height:40px;background:{$ib};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;\">".esc_html($st['icon']??'📊')."</div>";
            echo '</div>';
            echo '<div class="set-text-32 text-bold color-gray-900 add-margin-bottom-8">'.esc_html($st['value']??'').'</div>';
            echo "<div style=\"font-size:13px;font-weight:600;color:{$tc};\">{$ta} ".esc_html($st['change']??'')."</div>";
            echo '</div>';
        }
        echo '</div>';
    }
}
