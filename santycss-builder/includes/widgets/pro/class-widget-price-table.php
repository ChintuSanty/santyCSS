<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Price_Table extends Widget_Base {
    public function get_type(): string     { return 'price-table'; }
    public function get_title(): string    { return __('Price Table','santycss-builder'); }
    public function get_icon(): string     { return '💰'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->repeater('plans','Plans',[
                $this->text('name','Plan Name','Starter'),
                $this->text('price','Price','$9'),
                $this->text('period','Period','/ month'),
                $this->text('description','Description','Perfect for individuals'),
                $this->textarea('features','Features (one per line)','Feature one\nFeature two\nFeature three'),
                $this->text('btn_text','Button Text','Get Started'),
                $this->url('btn_url','Button URL','#'),
                $this->toggle('highlighted','Highlighted',false),
                $this->text('badge','Badge Text',''),
            ],[
                ['name'=>'Free','price'=>'$0','period'=>'/ month','description'=>'Get started','features'=>"5 pages\n1 user\nBasic support",'btn_text'=>'Sign Up','btn_url'=>'#','highlighted'=>false,'badge'=>''],
                ['name'=>'Pro','price'=>'$29','period'=>'/ month','description'=>'For growing teams','features'=>"Unlimited pages\n10 users\nPriority support\nCustom domain",'btn_text'=>'Start Free Trial','btn_url'=>'#','highlighted'=>true,'badge'=>'Most Popular'],
                ['name'=>'Enterprise','price'=>'$99','period'=>'/ month','description'=>'Large organizations','features'=>"Everything in Pro\nUnlimited users\nDedicated support\nSLA",'btn_text'=>'Contact Sales','btn_url'=>'#','highlighted'=>false,'badge'=>''],
            ]),
            $this->select('columns','Columns',['2'=>'2','3'=>'3','4'=>'4'],'3'),
        ];
    }
    public function render(array $s): void {
        $plans=$s['plans']??[];$cols=$s['columns']??'3';
        $grid=['2'=>'grid-cols-2','3'=>'grid-cols-3','4'=>'grid-cols-4'][$cols]??'grid-cols-3';
        echo "<div class=\"scb-price-table make-grid {$grid} gap-24\">";
        foreach($plans as $p){
            $hl=!empty($p['highlighted']);
            $card_cls=$hl?'background-blue-600 color-white':'background-white add-border-1 border-color-gray-200';
            $tc=$hl?'color-white':'color-gray-900';$sc=$hl?'color-blue-100':'color-gray-500';
            echo "<div class=\"scb-price-card round-corners-20 add-padding-32 ".($hl?'add-shadow-xl':' add-shadow-sm')." {$card_cls} position-relative\">";
            if(!empty($p['badge'])) echo '<div class="badge" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);white-space:nowrap;">'.esc_html($p['badge']).'</div>';
            echo '<div class="set-text-20 text-bold '.($hl?'color-white':'color-gray-900').' add-margin-bottom-8">'.esc_html($p['name']??'').'</div>';
            echo '<p class="set-text-13 '.$sc.' add-margin-bottom-24">'.esc_html($p['description']??'').'</p>';
            echo '<div class="make-flex align-end gap-4 add-margin-bottom-24"><span class="set-text-48 text-bold '.$tc.'">'.esc_html($p['price']??'').'</span><span class="set-text-14 '.$sc.'" style="padding-bottom:8px;">'.esc_html($p['period']??'').'</span></div>';
            echo '<ul style="list-style:none;padding:0;margin:0 0 32px;display:flex;flex-direction:column;gap:10px;">';
            foreach(explode("\n",trim($p['features']??'')) as $f){
                if(!$f) continue;
                echo '<li class="make-flex align-center gap-8 set-text-14 '.($hl?'color-white':'color-gray-600').'"><span style="color:'.($hl?'#bfdbfe':'#22c55e').';">✓</span>'.esc_html(trim($f)).'</li>';
            }
            echo '</ul>';
            $btn_cls=$hl?'style-secondary':'style-primary';
            echo '<a href="'.esc_url($p['btn_url']??'#').'" class="make-button '.$btn_cls.' size-large shape-rounded set-width-full justify-center">'.esc_html($p['btn_text']??'Get Started').'</a>';
            echo '</div>';
        }
        echo '</div>';
    }
}
