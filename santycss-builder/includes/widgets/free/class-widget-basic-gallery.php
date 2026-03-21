<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Basic_Gallery extends Widget_Base {
    public function get_type(): string     { return 'basic-gallery'; }
    public function get_title(): string    { return __('Basic Gallery','santycss-builder'); }
    public function get_icon(): string     { return '🖼'; }
    public function get_category(): string { return 'media'; }

    public function get_controls(): array {
        return [
            $this->repeater('images','Images',[
                $this->image('image','Image'),
                $this->text('caption','Caption',''),
                $this->url('link','Link',''),
            ],[
                ['caption'=>'','link'=>'','image'=>['url'=>'','id'=>0]],
                ['caption'=>'','link'=>'','image'=>['url'=>'','id'=>0]],
                ['caption'=>'','link'=>'','image'=>['url'=>'','id'=>0]],
            ]),
            $this->select('columns','Columns',['2'=>'2','3'=>'3','4'=>'4','5'=>'5'],'3'),
            $this->number('img_height','Image Height (px)',200,60,800),
            $this->toggle('lightbox','Enable Lightbox',false),
        ];
    }

    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('caption'),
            [
                $this->set_tab('style', $this->heading_control('Grid')),
                $this->set_tab('style', $this->number('gap','Gap (px)',8,0,40)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Image')),
                $this->set_tab('style', $this->number('img_radius','Image Radius (px)',0,0,50)),
                $this->set_tab('style', $this->select('img_fit','Object Fit',['cover'=>'Cover','contain'=>'Contain'],'cover')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Caption')),
                $this->set_tab('style', $this->color('caption_color','Caption Color','#6b7280')),
                $this->set_tab('style', $this->color('caption_bg','Caption BG (overlay)','transparent')),
                $this->set_tab('style', $this->toggle('caption_overlay','Caption on Image Overlay',false)),
            ]
        );
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font($s['caption_font_family']??'');
        $images   = $s['images'] ?? [];
        $cols     = intval($s['columns'] ?? 3);
        $gap      = intval($s['gap'] ?? 8);
        $h        = intval($s['img_height'] ?? 200);
        $lightbox = ! empty($s['lightbox']);
        $r        = intval($s['img_radius']??0);
        $fit      = $s['img_fit']??'cover';
        $cc       = esc_attr($s['caption_color']??'#6b7280');
        $cbg      = esc_attr($s['caption_bg']??'transparent');
        $c_over   = !empty($s['caption_overlay']);
        $c_typo   = $this->typography_css($s,'caption');
        $uid      = 'scb-lb-' . uniqid();
        $img_style = "width:100%;height:{$h}px;object-fit:{$fit};display:block;border-radius:{$r}px;";

        echo '<div class="scb-basic-gallery" style="display:grid;grid-template-columns:repeat(' . $cols . ',1fr);gap:' . $gap . 'px;">';
        foreach ( $images as $item ) {
            $img = $item['image'] ?? ['url'=>'','id'=>0];
            if ( empty($img['url']) ) continue;
            $url = esc_url($img['url']);$cap=esc_html($item['caption']??'');$link=esc_url($item['link']??'');
            echo '<div class="scb-gallery-item" style="position:relative;overflow:hidden;border-radius:'.$r.'px;">';
            $thumb = '<img src="'.$url.'" alt="'.$cap.'" loading="lazy" style="'.$img_style.'">';
            if ( $lightbox ) echo '<a href="'.$url.'" class="scb-lb-t-'.$uid.'" style="display:block;cursor:zoom-in;">'.$thumb.'</a>';
            elseif ( $link ) echo '<a href="'.$link.'" style="display:block;">'.$thumb.'</a>';
            else echo $thumb;
            if ( $cap ) {
                if($c_over) {
                    echo '<div style="position:absolute;bottom:0;left:0;right:0;padding:8px 12px;background:'.esc_attr($cbg?$cbg:'rgba(0,0,0,0.5)').';color:#fff;'.($c_typo?$c_typo:'font-size:12px').'">'.esc_html($cap).'</div>';
                } else {
                    echo '<p style="padding:4px;margin:0;color:'.$cc.';'.($c_typo?$c_typo:'font-size:12px').'">'.esc_html($cap).'</p>';
                }
            }
            echo '</div>';
        }
        echo '</div>';
        if ( $lightbox ) {
            echo '<div id="'.$uid.'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:99999;align-items:center;justify-content:center;" onclick="this.style.display=\'none\'">';
            echo '<img id="'.$uid.'-img" src="" alt="" style="max-width:92vw;max-height:92vh;border-radius:4px;"></div>';
            echo '<script>document.querySelectorAll(".scb-lb-t-'.$uid.'").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();var lb=document.getElementById("'.$uid.'");lb.querySelector("img").src=a.href;lb.style.display="flex";});});</script>';
        }
    }
}
