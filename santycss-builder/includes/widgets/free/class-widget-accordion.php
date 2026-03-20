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
    public function render(array $s): void {
        $items = $s['items']??[];
        $uid   = 'scb-acc-'.uniqid();
        echo "<div class=\"scb-accordion make-flex flex-column gap-4\" id=\"{$uid}\">";
        foreach($items as $i=>$item){
            echo '<div class="scb-acc-item background-white round-corners-10 add-border-1 border-color-gray-200 overflow-hidden">';
            echo '<button class="scb-acc-header make-flex align-center justify-between set-width-full add-padding-16 add-padding-x-20 set-text-15 text-semibold color-gray-900" style="border:none;background:transparent;cursor:pointer;text-align:left;" data-acc="'.$i.'" aria-expanded="false">';
            echo '<span>'.esc_html($item['title']??'').'</span><span class="scb-acc-chevron" style="font-size:12px;transition:transform .2s;">▼</span>';
            echo '</button>';
            echo '<div class="scb-acc-body" style="display:none;padding:0 20px 16px;">';
            echo wp_kses_post($item['content']??'');
            echo '</div></div>';
        }
        echo '</div>';
        echo "<script>(function(){var acc=document.getElementById('{$uid}');if(!acc)return;acc.querySelectorAll('.scb-acc-header').forEach(function(h){h.addEventListener('click',function(){var body=this.nextElementSibling,open=this.getAttribute('aria-expanded')==='true',chevron=this.querySelector('.scb-acc-chevron');if(!".($s['allow_multiple']??false?'true':'false')."){acc.querySelectorAll('.scb-acc-header').forEach(function(x){x.setAttribute('aria-expanded','false');x.nextElementSibling.style.display='none';x.querySelector('.scb-acc-chevron').style.transform='rotate(0deg)';});}this.setAttribute('aria-expanded',open?'false':'true');body.style.display=open?'none':'block';chevron.style.transform=open?'rotate(0deg)':'rotate(180deg)';});});})();</script>";
    }
}
