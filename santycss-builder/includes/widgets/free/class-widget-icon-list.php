<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Icon_List extends Widget_Base {
    public function get_type(): string     { return 'icon-list'; }
    public function get_title(): string    { return __('Icon List','santycss-builder'); }
    public function get_icon(): string     { return '📋'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->repeater('items','List Items',[
                $this->text('icon','Icon (emoji)','✓'),
                $this->text('text','Text','List item'),
                $this->url('link','Link (optional)',''),
                $this->color('icon_color','Icon Color','#3b82f6'),
            ],[
                ['icon'=>'✓','text'=>'First item','link'=>'','icon_color'=>'#3b82f6'],
                ['icon'=>'✓','text'=>'Second item','link'=>'','icon_color'=>'#3b82f6'],
                ['icon'=>'✓','text'=>'Third item','link'=>'','icon_color'=>'#3b82f6'],
            ]),
            $this->select('layout','Layout',['vertical'=>'Vertical','horizontal'=>'Horizontal'],'vertical'),
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('text'),
            [
                $this->set_tab('style', $this->heading_control('Icon')),
                $this->set_tab('style', $this->number('icon_size','Icon Size (px)',18,10,64)),
                $this->set_tab('style', $this->color('default_icon_color','Default Icon Color','#3b82f6')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Text')),
                $this->set_tab('style', $this->number('text_size','Text Size (px)',16,10,48)),
                $this->set_tab('style', $this->color('text_color','Text Color','#334155')),
                $this->set_tab('style', $this->color('link_color','Link Hover Color','#1e40af')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Spacing')),
                $this->set_tab('style', $this->number('gap','Item Gap (px)',12,0,60)),
                $this->set_tab('style', $this->number('icon_text_gap','Icon-Text Gap (px)',8,0,32)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Divider')),
                $this->set_tab('style', $this->toggle('show_divider','Show Divider Between Items',false)),
                $this->set_tab('style', $this->color('divider_color','Divider Color','#e5e7eb')),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font($s['text_font_family']??'');
        $items    = $s['items']     ?? [];
        $layout   = $s['layout']    ?? 'vertical';
        $icon_sz  = intval($s['icon_size']??18);
        $text_sz  = intval($s['text_size']??16);
        $gap      = intval($s['gap'] ?? 12);
        $itg      = intval($s['icon_text_gap']??8);
        $tc       = esc_attr($s['text_color'] ?? '#334155');
        $dic      = esc_attr($s['default_icon_color']??'#3b82f6');
        $div_show = !empty($s['show_divider']);
        $div_c    = esc_attr($s['divider_color']??'#e5e7eb');
        $flex_dir = $layout === 'horizontal' ? '' : 'flex-column';
        $t_typo   = $this->typography_css($s,'text');

        echo '<ul class="scb-icon-list make-flex '.$flex_dir.' flex-wrap" style="list-style:none;margin:0;padding:0;gap:'.$gap.'px;">';
        $cnt = count($items);
        foreach ( $items as $idx=>$item ) {
            $icon  = esc_html($item['icon'] ?? '✓');
            $text  = esc_html($item['text'] ?? '');
            $link  = esc_url($item['link'] ?? '');
            $color = esc_attr(!empty($item['icon_color'])?$item['icon_color']:$dic);
            $inner = '<span style="font-size:'.$icon_sz.'px;color:'.$color.';flex-shrink:0;line-height:1;">'.$icon.'</span>'
                   . '<span style="font-size:'.$text_sz.'px;color:'.$tc.';'.($t_typo?$t_typo:'').'">'.$text.'</span>';
            echo '<li class="make-flex align-center" style="gap:'.$itg.'px;">';
            if ( $link ) echo '<a href="'.$link.'" class="make-flex align-center" style="gap:'.$itg.'px;color:inherit;text-decoration:none;">'.$inner.'</a>';
            else echo $inner;
            echo '</li>';
            if($div_show&&$layout==='vertical'&&$idx<$cnt-1) echo '<li style="height:1px;background:'.$div_c.';"></li>';
        }
        echo '</ul>';
    }
}
