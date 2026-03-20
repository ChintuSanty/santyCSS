<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Social_Icons extends Widget_Base {
    public function get_type(): string     { return 'social-icons'; }
    public function get_title(): string    { return __('Social Icons','santycss-builder'); }
    public function get_icon(): string     { return '🔗'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->repeater('icons','Social Links',[
                $this->select('platform','Platform',['twitter'=>'Twitter/X','facebook'=>'Facebook','instagram'=>'Instagram','linkedin'=>'LinkedIn','youtube'=>'YouTube','github'=>'GitHub','tiktok'=>'TikTok','pinterest'=>'Pinterest','snapchat'=>'Snapchat','whatsapp'=>'WhatsApp'],'twitter'),
                $this->url('url','URL','#'),
            ],[
                ['platform'=>'twitter','url'=>'#'],
                ['platform'=>'linkedin','url'=>'#'],
            ]),
            $this->number('size','Icon Size (px)',24,12,80),
            $this->select('style','Style',['color'=>'Brand Colors','mono'=>'Monochrome','circle'=>'Circle Background'],'color'),
            $this->number('gap','Gap (px)',12,4,48),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'left'),
        ];
    }
    private static array $icons=['twitter'=>['🐦','#1DA1F2'],'facebook'=>['📘','#1877F2'],'instagram'=>['📷','#E4405F'],'linkedin'=>['💼','#0A66C2'],'youtube'=>['▶️','#FF0000'],'github'=>['🐙','#333'],'tiktok'=>['🎵','#000'],'pinterest'=>['📌','#E60023'],'snapchat'=>['👻','#FFFC00'],'whatsapp'=>['💬','#25D366']];
    public function render(array $s): void {
        $icons = $s['icons']??[];$size=$s['size']??24;$style=$s['style']??'color';$gap=$s['gap']??12;$align=$s['align']??'left';
        echo "<div class=\"scb-social-icons make-flex flex-wrap align-center justify-{$align}\" style=\"gap:{$gap}px;\">";
        foreach($icons as $ic){
            $p=$ic['platform']??'twitter';$url=esc_url($ic['url']??'#');
            $meta=self::$icons[$p]??['🔗','#333'];$emoji=$meta[0];$color=$meta[1];
            $bg=$style==='circle'?"background:{$color};width:".($size+16)."px;height:".($size+16)."px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;":'';
            echo "<a href=\"{$url}\" target=\"_blank\" rel=\"noopener\" style=\"{$bg}font-size:{$size}px;line-height:1;text-decoration:none;\".>{$emoji}</a>";
        }
        echo '</div>';
    }
}
