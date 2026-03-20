<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Image_Carousel extends Widget_Base {
    public function get_type(): string     { return 'image-carousel'; }
    public function get_title(): string    { return __('Image Carousel','santycss-builder'); }
    public function get_icon(): string     { return '🎠'; }
    public function get_category(): string { return 'media'; }
    public function get_controls(): array {
        return [
            $this->repeater('slides','Slides',[$this->image('image','Image'),$this->text('caption','Caption',''),$this->url('link','Link','')],[]),
            $this->number('radius','Border Radius',8,0,50),
            $this->toggle('arrows','Show Arrows',true),
            $this->toggle('dots','Show Dots',true),
            $this->toggle('autoplay','Autoplay',false),
            $this->number('interval','Autoplay Interval (ms)',3000,1000,10000,500),
        ];
    }
    public function render(array $s): void {
        $slides=$s['slides']??[];$uid='scb-car-'.uniqid();$r=intval($s['radius']??8);$auto=!empty($s['autoplay'])?intval($s['interval']??3000):0;
        echo "<div class=\"scb-carousel\" id=\"{$uid}\" style=\"position:relative;overflow:hidden;border-radius:{$r}px;\">";
        echo '<div class="scb-car-track" style="display:flex;transition:transform .4s ease;">';
        foreach($slides as $sl){
            $img=esc_url($sl['image']['url']??'');$cap=esc_html($sl['caption']??'');$lnk=esc_url($sl['link']??'');
            echo '<div class="scb-car-slide" style="min-width:100%;position:relative;">';
            $img_tag=$img?"<img src=\"{$img}\" alt=\"{$cap}\" style=\"width:100%;display:block;height:auto;\">":"<div style=\"height:300px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;\">🖼️</div>";
            echo $lnk?"<a href=\"{$lnk}\">{$img_tag}</a>":$img_tag;
            if($cap) echo "<div style=\"position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:rgba(0,0,0,.5);color:#fff;font-size:14px;\">{$cap}</div>";
            echo '</div>';
        }
        echo '</div>';
        if(!empty($s['arrows'])&&count($slides)>1){
            echo '<button onclick="scbCarPrev(\''.$uid.'\')" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;">‹</button>';
            echo '<button onclick="scbCarNext(\''.$uid.'\')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer;">›</button>';
        }
        if(!empty($s['dots'])&&count($slides)>1){
            echo '<div class="scb-car-dots" style="position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px;">';
            foreach($slides as $i=>$_) echo '<span class="scb-car-dot" data-idx="'.$i.'" style="width:8px;height:8px;border-radius:50%;background:'.($i===0?'#fff':'rgba(255,255,255,.5)').';cursor:pointer;" onclick="scbCarGo(\''.$uid.'\','.$i.')"></span>';
            echo '</div>';
        }
        echo '</div>';
        $n=count($slides);
        echo "<script>window.scbCarState=window.scbCarState||{};window.scbCarState['{$uid}']={cur:0,total:{$n}};function scbCarGo(id,i){var st=window.scbCarState[id],el=document.getElementById(id);if(!el)return;st.cur=((i%st.total)+st.total)%st.total;el.querySelector('.scb-car-track').style.transform='translateX(-'+(st.cur*100)+'%)';el.querySelectorAll('.scb-car-dot').forEach(function(d,j){d.style.background=j===st.cur?'#fff':'rgba(255,255,255,.5)';});}function scbCarPrev(id){var st=window.scbCarState[id];scbCarGo(id,st.cur-1);}function scbCarNext(id){var st=window.scbCarState[id];scbCarGo(id,st.cur+1);}".($auto?"setInterval(function(){scbCarNext('{$uid}');},{$auto});":"")."</script>";
    }
}
