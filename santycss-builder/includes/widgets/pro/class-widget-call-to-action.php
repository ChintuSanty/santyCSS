<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Call_To_Action extends Widget_Base {
    public function get_type(): string     { return 'cta-pro'; }
    public function get_title(): string    { return __('CTA (Pro)','santycss-builder'); }
    public function get_icon(): string     { return '🚀'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->image('bg_image','Background Image'),
            $this->color('overlay','Overlay Color','rgba(15,23,42,0.75)'),
            $this->text('eyebrow','Eyebrow','Limited Offer'),
            $this->text('heading','Heading','Start building today'),
            $this->textarea('description','Description','The fastest way to launch beautiful pages.'),
            $this->text('btn1_text','Button 1','Get Started'),
            $this->url('btn1_url','Button 1 URL','#'),
            $this->text('btn2_text','Button 2 (optional)','Watch Demo'),
            $this->url('btn2_url','Button 2 URL','#'),
            $this->number('min_height','Min Height (px)',500,200,900),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center'],'center'),
        ];
    }
    public function render(array $s): void {
        $bg_img=esc_url($s['bg_image']['url']??'');$ov=esc_attr($s['overlay']??'rgba(15,23,42,0.75)');
        $h=intval($s['min_height']??500);$align=$s['align']??'center';
        $bg=$bg_img?"background-image:url({$bg_img});background-size:cover;background-position:center;":'background:#0f172a;';
        echo "<div style=\"{$bg}position:relative;min-height:{$h}px;display:flex;align-items:center;border-radius:20px;overflow:hidden;\">";
        echo "<div style=\"position:absolute;inset:0;background:{$ov};\"></div>";
        echo "<div style=\"position:relative;z-index:1;max-width:700px;".($align==='center'?'margin:0 auto;text-align:center;padding:60px 40px;':'padding:60px 40px;')."\">";
        if(!empty($s['eyebrow'])) echo '<div class="badge background-white-20 color-white add-margin-bottom-16">'.esc_html($s['eyebrow']).'</div>';
        echo '<h2 class="set-text-48 text-bold color-white add-margin-bottom-16" style="line-height:1.1;">'.esc_html($s['heading']??'').'</h2>';
        if(!empty($s['description'])) echo '<p class="set-text-18 color-white add-margin-bottom-32" style="opacity:.8;">'.esc_html($s['description']).'</p>';
        echo "<div class=\"make-flex gap-16 flex-wrap justify-{$align}\">";
        if(!empty($s['btn1_text'])) echo '<a href="'.esc_url($s['btn1_url']??'#').'" class="make-button style-primary size-large shape-pill">'.esc_html($s['btn1_text']).'</a>';
        if(!empty($s['btn2_text'])) echo '<a href="'.esc_url($s['btn2_url']??'#').'" class="make-button style-ghost size-large shape-pill" style="border-color:white;color:white;">'.esc_html($s['btn2_text']).'</a>';
        echo '</div></div></div>';
    }
}
