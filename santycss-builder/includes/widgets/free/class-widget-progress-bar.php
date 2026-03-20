<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Progress_Bar extends Widget_Base {
    public function get_type(): string     { return 'progress-bar'; }
    public function get_title(): string    { return __('Progress Bar','santycss-builder'); }
    public function get_icon(): string     { return '📊'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('bars','Bars',[
                $this->text('label','Label','HTML'),
                $this->number('value','Value %',80,0,100),
                $this->color('color','Color','#3b82f6'),
            ],[
                ['label'=>'HTML','value'=>90,'color'=>'#f97316'],
                ['label'=>'CSS','value'=>80,'color'=>'#3b82f6'],
                ['label'=>'JavaScript','value'=>70,'color'=>'#8b5cf6'],
            ]),
            $this->number('height','Bar Height (px)',10,4,32),
            $this->number('radius','Radius (px)',9999,0,9999),
            $this->toggle('show_value','Show Value',true),
        ];
    }
    public function render(array $s): void {
        $bars=$s['bars']??[];$h=intval($s['height']??10);$r=intval($s['radius']??9999);$show=!empty($s['show_value']);
        echo '<div class="scb-progress-bars make-flex flex-column gap-16">';
        foreach($bars as $bar){
            $lbl=esc_html($bar['label']??'');$val=intval($bar['value']??0);$col=esc_attr($bar['color']??'#3b82f6');
            echo '<div>';
            if($lbl||$show) echo "<div class=\"make-flex justify-between set-text-13 text-semibold color-gray-700 add-margin-bottom-6\"><span>{$lbl}</span>".($show?"<span>{$val}%</span>":'').'</div>';
            echo "<div style=\"background:#e5e7eb;border-radius:{$r}px;height:{$h}px;overflow:hidden;\"><div style=\"width:{$val}%;background:{$col};height:100%;border-radius:{$r}px;transition:width .6s ease;\"></div></div>";
            echo '</div>';
        }
        echo '</div>';
    }
}
