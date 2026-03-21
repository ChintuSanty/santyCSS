<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Faq extends Widget_Base {
    public function get_type(): string     { return 'faq'; }
    public function get_title(): string    { return __('FAQ','santycss-builder'); }
    public function get_icon(): string     { return '❓'; }
    public function get_category(): string { return 'interactive'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->repeater('items','FAQ Items',[$this->text('q','Question','What is SantyCSS?'),$this->wysiwyg('a','Answer','<p>A plain-English utility CSS framework.</p>'),],[['q'=>'How do I install?','a'=>'<p>Use npm or CDN.</p>'],['q'=>'Is it free?','a'=>'<p>Yes, completely open source.</p>']]),
            $this->toggle('json_ld','Add JSON-LD Schema',true),
            $this->select('style','Style',['minimal'=>'Minimal','card'=>'Card','bordered'=>'Bordered'],'minimal'),
        ];
    }
    public function render(array $s): void {
        $items=$s['items']??[];$style=$s['style']??'minimal';
        $card_cls=$style==='card'?'background-white round-corners-12 add-shadow-sm':($style==='bordered'?'add-border-1 border-color-gray-200 round-corners-10':'');
        echo '<div class="scb-faq make-flex flex-column gap-4">';
        foreach($items as $it){
            echo "<details class=\"scb-faq-item {$card_cls}\">";
            echo '<summary class="make-flex align-center justify-between add-padding-20 set-text-16 text-semibold color-gray-900" style="cursor:pointer;list-style:none;">'.esc_html($it['q']??'').' <span>+</span></summary>';
            echo '<div class="add-padding-x-20 add-padding-bottom-20 set-text-15 color-gray-600 line-height-relaxed">'.wp_kses_post($it['a']??'').'</div>';
            echo '</details>';
        }
        echo '</div>';
        if(!empty($s['json_ld'])&&$items){
            $faq_json=array_map(fn($i)=>['@type'=>'Question','name'=>$i['q']??'','acceptedAnswer'=>['@type'=>'Answer','text'=>wp_strip_all_tags($i['a']??'')]],$items);
            echo '<script type="application/ld+json">'.json_encode(['@context'=>'https://schema.org','@type'=>'FAQPage','mainEntity'=>$faq_json]).'</script>';
        }
    }
}
