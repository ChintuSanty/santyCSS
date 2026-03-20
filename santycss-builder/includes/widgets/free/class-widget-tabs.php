<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Tabs extends Widget_Base {
    public function get_type(): string     { return 'tabs'; }
    public function get_title(): string    { return __('Tabs','santycss-builder'); }
    public function get_icon(): string     { return '📂'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('tabs','Tabs',[
                $this->text('label','Tab Label','Tab 1'),
                $this->wysiwyg('content','Content','<p>Tab content here…</p>'),
                $this->text('icon','Icon (emoji)',''),
            ],[
                ['label'=>'Tab 1','content'=>'<p>First tab content.</p>','icon'=>''],
                ['label'=>'Tab 2','content'=>'<p>Second tab content.</p>','icon'=>''],
            ]),
            $this->select('style','Tab Style',['line'=>'Underline','pill'=>'Pills','card'=>'Cards'],'line'),
        ];
    }
    public function render(array $s): void {
        $tabs  = $s['tabs']??[['label'=>'Tab 1','content'=>'<p>Content</p>']];
        $style = $s['style']??'line';
        $uid   = 'scb-tabs-'.uniqid();
        $tab_cls = $style==='pill'?'make-flex gap-4 background-gray-100 add-padding-4 round-corners-8 add-margin-bottom-0 add-margin-bottom-16':'make-flex gap-0 border-b-2 border-color-gray-200 add-margin-bottom-16';
        echo "<div class=\"scb-tabs\" id=\"{$uid}\">";
        echo "<div class=\"scb-tab-nav {$tab_cls}\">";
        foreach($tabs as $i=>$tab){
            $lbl = esc_html($tab['label']??'Tab');
            $icn = esc_html($tab['icon']??'');
            $active_cls = $i===0?($style==='pill'?'background-white add-shadow-sm color-gray-900 round-corners-6':'border-b-2 border-color-blue-500 color-blue-600 text-semibold'):'color-gray-500';
            echo "<button class=\"scb-tab-btn add-padding-x-16 add-padding-y-8 set-text-14 text-semibold {$active_cls}\" style=\"border:none;background:transparent;cursor:pointer;\" data-tab=\"{$i}\">{$icn} {$lbl}</button>";
        }
        echo '</div>';
        foreach($tabs as $i=>$tab){
            $display = $i===0?'block':'none';
            echo "<div class=\"scb-tab-panel\" data-panel=\"{$i}\" style=\"display:{$display};\">";
            echo wp_kses_post($tab['content']??'');
            echo '</div>';
        }
        echo '</div>';
        echo "<script>(function(){var t=document.getElementById('{$uid}');if(!t)return;t.querySelectorAll('.scb-tab-btn').forEach(function(b){b.addEventListener('click',function(){var idx=this.dataset.tab;t.querySelectorAll('.scb-tab-btn').forEach(function(x){x.classList.remove('border-b-2','border-color-blue-500','color-blue-600','text-semibold','background-white','add-shadow-sm','color-gray-900','round-corners-6');x.classList.add('color-gray-500');});this.classList.remove('color-gray-500');this.classList.add('color-blue-600','text-semibold');t.querySelectorAll('.scb-tab-panel').forEach(function(p){p.style.display='none';});t.querySelector('[data-panel=\"'+idx+'\"]').style.display='block';});});})();</script>";
    }
}
