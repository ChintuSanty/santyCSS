<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Accordion extends Widget_Base {
    public function get_type(): string     { return 'accordion'; }
    public function get_title(): string    { return __('Accordion','santycss-builder'); }
    public function get_icon(): string     { return '🪗'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('items','Items',[
                $this->text('title','Title','Question or Title'),
                $this->wysiwyg('content','Content','<p>Answer or content here.</p>'),
            ],[
                ['title'=>'What is SantyCSS?','content'=>'<p>A plain-English utility CSS framework.</p>'],
                ['title'=>'Is it free to use?','content'=>'<p>Yes, completely free and open source.</p>'],
            ]),
            $this->toggle('allow_multiple','Allow Multiple Open',false),
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
                $this->set_tab('style', $this->color('header_active_bg','Active Header BG','#eff6ff')),
                $this->set_tab('style', $this->color('body_bg','Body Background','#ffffff')),
                $this->set_tab('style', $this->color('body_color','Body Text Color','#374151')),
                $this->set_tab('style', $this->color('border_color','Border Color','#e5e7eb')),
                $this->set_tab('style', $this->color('icon_color','Chevron Color','#6b7280')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Shape')),
                $this->set_tab('style', $this->number('item_radius','Item Radius (px)',10,0,50)),
                $this->set_tab('style', $this->number('item_gap','Item Gap (px)',8,0,40)),
                $this->set_tab('style', $this->number('header_padding','Header Padding (px)',16,0,40)),
                $this->set_tab('style', $this->number('body_padding','Body Padding (px)',20,0,60)),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['header_font_family']??'');
        $this->maybe_enqueue_font($s['body_font_family']??'');
        $items    = $s['items']??[];
        $uid      = 'scb-acc-'.uniqid();
        $hbg      = esc_attr($s['header_bg']??'#ffffff');
        $hc       = esc_attr($s['header_color']??'#111827');
        $habg     = esc_attr($s['header_active_bg']??'#eff6ff');
        $bbg      = esc_attr($s['body_bg']??'#ffffff');
        $bc       = esc_attr($s['body_color']??'#374151');
        $bord     = esc_attr($s['border_color']??'#e5e7eb');
        $ic       = esc_attr($s['icon_color']??'#6b7280');
        $r        = intval($s['item_radius']??10);
        $ig       = intval($s['item_gap']??8);
        $hp       = intval($s['header_padding']??16);
        $bp       = intval($s['body_padding']??20);
        $h_typo   = $this->typography_css($s,'header');
        $b_typo   = $this->typography_css($s,'body');
        echo "<div class=\"scb-accordion make-flex flex-column\" id=\"{$uid}\" style=\"gap:{$ig}px;\">";
        foreach($items as $i=>$item){
            echo "<div class=\"scb-acc-item overflow-hidden\" style=\"border:1px solid {$bord};border-radius:{$r}px;\">";
            echo "<button class=\"scb-acc-header make-flex align-center justify-between set-width-full\" style=\"border:none;background:{$hbg};cursor:pointer;text-align:left;padding:{$hp}px;color:{$hc};".($h_typo?$h_typo:'font-size:15px;font-weight:600').";\" data-acc=\"{$i}\" aria-expanded=\"false\">";
            echo '<span>'.esc_html($item['title']??'').'</span>';
            echo "<span class=\"scb-acc-chevron\" style=\"font-size:12px;transition:transform .2s;color:{$ic};\">▼</span>";
            echo '</button>';
            echo "<div class=\"scb-acc-body\" style=\"display:none;padding:{$bp}px;padding-top:0;background:{$bbg};color:{$bc};".($b_typo?$b_typo:'')."\">";
            echo wp_kses_post($item['content']??'');
            echo '</div></div>';
        }
        echo '</div>';
        $allow_multi = (!empty($s['allow_multiple']))?'true':'false';
        echo "<script>(function(){var acc=document.getElementById('{$uid}');if(!acc)return;var habg='{$habg}',hbg='{$hbg}';acc.querySelectorAll('.scb-acc-header').forEach(function(h){h.addEventListener('click',function(){var body=this.nextElementSibling,open=this.getAttribute('aria-expanded')==='true',chevron=this.querySelector('.scb-acc-chevron');if(!{$allow_multi}){acc.querySelectorAll('.scb-acc-header').forEach(function(x){x.setAttribute('aria-expanded','false');x.nextElementSibling.style.display='none';x.querySelector('.scb-acc-chevron').style.transform='rotate(0deg)';x.style.background=hbg;});}this.setAttribute('aria-expanded',open?'false':'true');body.style.display=open?'none':'block';chevron.style.transform=open?'rotate(0deg)':'rotate(180deg)';this.style.background=open?hbg:habg;});});})();</script>";
    }
}
