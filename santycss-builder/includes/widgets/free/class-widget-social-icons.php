<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Social_Icons extends Widget_Base {
    public function get_type(): string     { return 'social-icons'; }
    public function get_title(): string    { return __('Social Icons','santycss-builder'); }
    public function get_icon(): string     { return '🔗'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('icons','Social Links',[
                $this->select('platform','Platform',['twitter'=>'Twitter/X','facebook'=>'Facebook','instagram'=>'Instagram','linkedin'=>'LinkedIn','youtube'=>'YouTube','github'=>'GitHub','tiktok'=>'TikTok','pinterest'=>'Pinterest','snapchat'=>'Snapchat','whatsapp'=>'WhatsApp','discord'=>'Discord','telegram'=>'Telegram','medium'=>'Medium','dribbble'=>'Dribbble','behance'=>'Behance'],'twitter'),
                $this->url('url','URL','#'),
                $this->text('custom_icon','Custom Icon (emoji)',''),
            ],[
                ['platform'=>'twitter','url'=>'#'],
                ['platform'=>'linkedin','url'=>'#'],
            ]),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }
    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Icon')),
            $this->set_tab('style', $this->number('size','Icon Size (px)',24,12,80)),
            $this->set_tab('style', $this->number('gap','Gap (px)',12,4,48)),
            $this->set_tab('style', $this->select('style','Style',['color'=>'Brand Colors','mono'=>'Monochrome','circle'=>'Circle BG','square'=>'Square BG'],'color')),
            $this->set_tab('style', $this->color('mono_color','Mono Color','#374151')),
            $this->set_tab('style', $this->color('bg_color','Background Color','')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Shape')),
            $this->set_tab('style', $this->number('icon_radius','Border Radius (px)',50,0,50)),
            $this->set_tab('style', $this->number('icon_padding','Padding (px)',8,0,32)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Border')),
            $this->set_tab('style', $this->select('icon_border_type','Type',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed'],'none')),
            $this->set_tab('style', $this->number('icon_border_width','Width (px)',2,1,10)),
            $this->set_tab('style', $this->color('icon_border_color','Border Color','#e2e8f0')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Hover')),
            $this->set_tab('style', $this->color('hover_color','Hover Color','')),
            $this->set_tab('style', $this->color('hover_bg','Hover Background','')),
        ];
    }
    private static array $icons=['twitter'=>['🐦','#1DA1F2'],'facebook'=>['📘','#1877F2'],'instagram'=>['📷','#E4405F'],'linkedin'=>['💼','#0A66C2'],'youtube'=>['▶️','#FF0000'],'github'=>['🐙','#333'],'tiktok'=>['🎵','#000'],'pinterest'=>['📌','#E60023'],'snapchat'=>['👻','#FFFC00'],'whatsapp'=>['💬','#25D366'],'discord'=>['💬','#5865F2'],'telegram'=>['✈️','#2AABEE'],'medium'=>['✍️','#000'],'dribbble'=>['🏀','#EA4C89'],'behance'=>['🎨','#1769FF']];
    public function render(array $s): void {
        $icons   = $s['icons']??[];$size=$s['size']??24;$st=$s['style']??'color';
        $gap     = intval($s['gap']??12);$align=$s['align']??'left';
        $mono_c  = esc_attr($s['mono_color']??'#374151');$bg_c=esc_attr($s['bg_color']??'');
        $ipad    = intval($s['icon_padding']??8);$ir=intval($s['icon_radius']??50);
        $ib_type = $s['icon_border_type']??'none';$ibw=intval($s['icon_border_width']??2);
        $ibc     = esc_attr($s['icon_border_color']??'#e2e8f0');
        $uid = 'scb-si-'.uniqid();
        $hover_css='';
        if(!empty($s['hover_color'])||!empty($s['hover_bg'])){
            $h=[];if(!empty($s['hover_color']))$h[]='color:'.esc_attr($s['hover_color']).'!important';
            if(!empty($s['hover_bg']))$h[]='background:'.esc_attr($s['hover_bg']).'!important';
            $hover_css='<style>#'.$uid.' a:hover{'.implode(';',$h).';transition:all .2s;}</style>';
        }
        echo $hover_css;
        echo "<div class=\"scb-social-icons make-flex flex-wrap align-center justify-{$align}\" id=\"{$uid}\" style=\"gap:{$gap}px;\">";
        foreach($icons as $ic){
            $p=$ic['platform']??'twitter';$url=esc_url($ic['url']??'#');
            $meta=self::$icons[$p]??['🔗','#333'];
            $emoji=!empty($ic['custom_icon'])?esc_html($ic['custom_icon']):$meta[0];
            $brand_color=$meta[1];
            $color = $st==='mono'?$mono_c:$brand_color;
            $this_bg = ($st==='circle'||$st==='square')
                ? ($bg_c?$bg_c:$brand_color)
                : ($bg_c?$bg_c:'transparent');
            $a_style = "font-size:{$size}px;line-height:1;text-decoration:none;color:{$color};display:inline-flex;align-items:center;justify-content:center;";
            if($this_bg!=='transparent') $a_style.="background:{$this_bg};";
            if($ipad) $a_style.="padding:{$ipad}px;";
            if($ir)   $a_style.="border-radius:{$ir}px;";
            if($ib_type!=='none') $a_style.="border:{$ibw}px {$ib_type} {$ibc};";
            echo "<a href=\"{$url}\" target=\"_blank\" rel=\"noopener\" style=\"{$a_style}\">{$emoji}</a>";
        }
        echo '</div>';
    }
}
