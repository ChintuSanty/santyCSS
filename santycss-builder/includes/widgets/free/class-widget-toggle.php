<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Toggle extends Widget_Base {
    public function get_type(): string     { return 'toggle'; }
    public function get_title(): string    { return __('Toggle','santycss-builder'); }
    public function get_icon(): string     { return '🔀'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->text('title','Title','Toggle Title'),
            $this->wysiwyg('content','Content','<p>Toggle content here.</p>'),
            $this->toggle('open','Open by Default',false),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('header'),
            $this->typography_controls('body'),
            [
                $this->set_tab('style', $this->heading_control('Colors')),
                $this->set_tab('style', $this->color('header_bg','Header Background','#ffffff')),
                $this->set_tab('style', $this->color('header_color','Header Text Color','#111827')),
                $this->set_tab('style', $this->color('body_bg','Body Background','#ffffff')),
                $this->set_tab('style', $this->color('body_color','Body Text Color','#374151')),
                $this->set_tab('style', $this->color('border_color','Border Color','#e5e7eb')),
                $this->set_tab('style', $this->color('icon_color','Icon Color','#6b7280')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Shape')),
                $this->set_tab('style', $this->number('toggle_radius','Border Radius (px)',10,0,50)),
                $this->set_tab('style', $this->number('header_padding','Header Padding (px)',16,0,40)),
                $this->set_tab('style', $this->number('body_padding','Body Padding (px)',20,0,60)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['header_font_family']??'');
        $this->maybe_enqueue_font($s['body_font_family']??'');
        $open   = !empty($s['open']);
        $hbg    = esc_attr($s['header_bg']??'#ffffff');
        $hc     = esc_attr($s['header_color']??'#111827');
        $bbg    = esc_attr($s['body_bg']??'#ffffff');
        $bc     = esc_attr($s['body_color']??'#374151');
        $bord   = esc_attr($s['border_color']??'#e5e7eb');
        $ic     = esc_attr($s['icon_color']??'#6b7280');
        $r      = intval($s['toggle_radius']??10);
        $hp     = intval($s['header_padding']??16);
        $bp     = intval($s['body_padding']??20);
        $h_typo = $this->typography_css($s,'header');
        $b_typo = $this->typography_css($s,'body');
        echo '<details class="scb-toggle overflow-hidden"'.($open?' open':'').' style="border:1px solid '.$bord.';border-radius:'.$r.'px;">';
        echo '<summary class="make-flex align-center justify-between" style="cursor:pointer;list-style:none;padding:'.$hp.'px;background:'.$hbg.';color:'.$hc.';'.($h_typo?$h_typo:'font-size:15px;font-weight:600').'">';
        echo '<span>'.esc_html($s['title']??'').'</span>';
        echo "<span style=\"color:{$ic};\">▼</span>";
        echo '</summary>';
        echo '<div style="padding:'.$bp.'px;padding-top:0;background:'.$bbg.';color:'.$bc.';'.($b_typo?$b_typo:'').'">'.wp_kses_post($s['content']??'').'</div>';
        echo '</details>';
    }
}
