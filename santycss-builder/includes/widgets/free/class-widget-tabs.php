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
            $this->select('style','Tab Style',['line'=>'Underline','pill'=>'Pills','card'=>'Cards','boxed'=>'Boxed'],'line'),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('tab'),
            $this->typography_controls('content'),
            [
                $this->set_tab('style', $this->heading_control('Tab Colors')),
                $this->set_tab('style', $this->color('tab_color','Tab Text Color','#6b7280')),
                $this->set_tab('style', $this->color('tab_bg','Tab Background','')),
                $this->set_tab('style', $this->color('active_color','Active Text Color','#2563eb')),
                $this->set_tab('style', $this->color('active_bg','Active Background','')),
                $this->set_tab('style', $this->color('active_border','Active Indicator Color','#2563eb')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Panel')),
                $this->set_tab('style', $this->color('panel_bg','Panel Background','#ffffff')),
                $this->set_tab('style', $this->color('panel_color','Panel Text Color','#374151')),
                $this->set_tab('style', $this->number('panel_padding','Panel Padding (px)',20,0,60)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Shape')),
                $this->set_tab('style', $this->number('tab_radius','Tab Radius (px)',6,0,50)),
                $this->set_tab('style', $this->number('tab_gap','Tab Gap (px)',4,0,32)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['tab_font_family']??'');
        $this->maybe_enqueue_font($s['content_font_family']??'');
        $tabs    = $s['tabs']??[['label'=>'Tab 1','content'=>'<p>Content</p>']];
        $style   = $s['style']??'line';
        $uid     = 'scb-tabs-'.uniqid();
        $tc      = esc_attr($s['tab_color']??'#6b7280');
        $tbg     = esc_attr($s['tab_bg']??'');
        $ac      = esc_attr($s['active_color']??'#2563eb');
        $abg     = esc_attr($s['active_bg']??'');
        $abc     = esc_attr($s['active_border']??'#2563eb');
        $pbg     = esc_attr($s['panel_bg']??'#ffffff');
        $pc      = esc_attr($s['panel_color']??'#374151');
        $pp      = intval($s['panel_padding']??20);
        $tr      = intval($s['tab_radius']??6);
        $tg      = intval($s['tab_gap']??4);
        $tab_typo  = $this->typography_css($s,'tab');
        $cont_typo = $this->typography_css($s,'content');
        $nav_style = $style==='pill'?'display:flex;background:#f3f4f6;padding:4px;border-radius:8px;gap:'.$tg.'px;margin-bottom:16px;'
                    :($style==='boxed'?'display:flex;gap:0;border-bottom:2px solid #e5e7eb;margin-bottom:16px;'
                    :'display:flex;gap:'.$tg.'px;border-bottom:2px solid #e5e7eb;margin-bottom:16px;');
        echo "<div class=\"scb-tabs\" id=\"{$uid}\">";
        echo "<div class=\"scb-tab-nav\" style=\"{$nav_style}\">";
        foreach($tabs as $i=>$tab){
            $lbl=$tab['label']??'Tab';$icn=esc_html($tab['icon']??'');
            $is_active=$i===0;
            $btn_bg    = $is_active&&$abg?$abg:($tbg?$tbg:'transparent');
            $btn_color = $is_active?$ac:$tc;
            $btn_bord  = $style==='line'&&$is_active?"border-bottom:2px solid {$abc};margin-bottom:-2px;"
                        :($style==='boxed'&&$is_active?"border-bottom:3px solid {$abc};margin-bottom:-2px;":'');
            echo "<button class=\"scb-tab-btn\" style=\"border:none;cursor:pointer;padding:8px 16px;border-radius:{$tr}px;background:{$btn_bg};color:{$btn_color};".($tab_typo?$tab_typo:'font-size:14px;font-weight:600').";{$btn_bord}\" data-tab=\"{$i}\">{$icn} {$lbl}</button>";
        }
        echo '</div>';
        foreach($tabs as $i=>$tab){
            echo "<div class=\"scb-tab-panel\" data-panel=\"{$i}\" style=\"display:".($i===0?'block':'none').";background:{$pbg};color:{$pc};padding:{$pp}px;".($cont_typo?$cont_typo:'')."\">";
            echo wp_kses_post($tab['content']??'');
            echo '</div>';
        }
        echo '</div>';
        echo "<script>(function(){var t=document.getElementById('{$uid}'),tc='{$tc}',ac='{$ac}',tbg='".(str_replace("'","\\'",$tbg))."',abg='".(str_replace("'","\\'",$abg))."',abc='{$abc}',style='{$style}',r='{$tr}';if(!t)return;t.querySelectorAll('.scb-tab-btn').forEach(function(b){b.addEventListener('click',function(){var idx=this.dataset.tab;t.querySelectorAll('.scb-tab-btn').forEach(function(x){x.style.color=tc;x.style.background=tbg||'transparent';x.style.borderBottom='none';x.style.marginBottom='0';});this.style.color=ac;this.style.background=abg||'transparent';if(style==='line'||style==='boxed'){this.style.borderBottom='2px solid '+abc;this.style.marginBottom='-2px';}t.querySelectorAll('.scb-tab-panel').forEach(function(p){p.style.display='none';});t.querySelector('[data-panel=\"'+idx+'\"]').style.display='block';});});})();</script>";
    }
}
