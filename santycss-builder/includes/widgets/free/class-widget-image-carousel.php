<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Image_Carousel extends Widget_Base {
    public function get_type(): string     { return 'image-carousel'; }
    public function get_title(): string    { return __('Image Carousel','santycss-builder'); }
    public function get_icon(): string     { return '🎠'; }
    public function get_category(): string { return 'media'; }
    public function get_controls(): array {
        return [
            $this->repeater('slides','Slides',[$this->image('image','Image'),$this->text('caption','Caption',''),$this->url('link','Link','')],[]),
            $this->toggle('arrows','Show Arrows',true),
            $this->toggle('dots','Show Dots',true),
            $this->toggle('autoplay','Autoplay',false),
            $this->number('interval','Autoplay Interval (ms)',3000,1000,10000,500),
        ];
    }
    public function get_style_controls(): array {
        return array_merge(
            $this->typography_controls('caption'),
            [
                $this->set_tab('style', $this->heading_control('Image')),
                $this->set_tab('style', $this->number('radius','Border Radius (px)',8,0,50)),
                $this->set_tab('style', $this->number('img_height','Slide Height (px)',0,100,1000)),
                $this->set_tab('style', $this->select('img_fit','Object Fit',['cover'=>'Cover','contain'=>'Contain'],'cover')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Caption')),
                $this->set_tab('style', $this->color('caption_color','Caption Color','#ffffff')),
                $this->set_tab('style', $this->color('caption_bg','Caption Background','rgba(0,0,0,0.5)')),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Arrows')),
                $this->set_tab('style', $this->color('arrow_color','Arrow Color','#ffffff')),
                $this->set_tab('style', $this->color('arrow_bg','Arrow Background','rgba(0,0,0,0.5)')),
                $this->set_tab('style', $this->number('arrow_size','Arrow Size (px)',36,20,80)),
                $this->set_tab('style', $this->divider_control()),
                $this->set_tab('style', $this->heading_control('Dots')),
                $this->set_tab('style', $this->color('dot_color','Active Dot','#ffffff')),
                $this->set_tab('style', $this->color('dot_inactive','Inactive Dot','rgba(255,255,255,0.5)')),
            ]
        );
    }
    public function render(array $s): void {
        $this->maybe_enqueue_font($s['caption_font_family']??'');
        $slides  = $s['slides']??[];$uid='scb-car-'.uniqid();
        $r       = intval($s['radius']??8);$auto=!empty($s['autoplay'])?intval($s['interval']??3000):0;
        $ih      = intval($s['img_height']??0);$fit=$s['img_fit']??'cover';
        $cc      = esc_attr($s['caption_color']??'#ffffff');$cbg=esc_attr($s['caption_bg']??'rgba(0,0,0,0.5)');
        $ac      = esc_attr($s['arrow_color']??'#ffffff');$abg=esc_attr($s['arrow_bg']??'rgba(0,0,0,0.5)');
        $asz     = intval($s['arrow_size']??36);
        $dc      = esc_attr($s['dot_color']??'#ffffff');$di=esc_attr($s['dot_inactive']??'rgba(255,255,255,0.5)');
        $c_typo  = $this->typography_css($s,'caption');
        $img_style = 'width:100%;display:block;'.($ih?'height:'.$ih.'px;object-fit:'.$fit.';':'height:auto;');
        echo "<div class=\"scb-carousel\" id=\"{$uid}\" style=\"position:relative;overflow:hidden;border-radius:{$r}px;\">";
        echo '<div class="scb-car-track" style="display:flex;transition:transform .4s ease;">';
        foreach($slides as $sl){
            $img=esc_url($sl['image']['url']??'');$cap=esc_html($sl['caption']??'');$lnk=esc_url($sl['link']??'');
            echo '<div class="scb-car-slide" style="min-width:100%;position:relative;">';
            $img_tag=$img?"<img src=\"{$img}\" alt=\"{$cap}\" style=\"{$img_style}\">":"<div style=\"height:300px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;\">🖼️</div>";
            echo $lnk?"<a href=\"{$lnk}\">{$img_tag}</a>":$img_tag;
            if($cap) echo "<div style=\"position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:{$cbg};color:{$cc};".($c_typo?$c_typo:'font-size:14px')."\">{$cap}</div>";
            echo '</div>';
        }
        echo '</div>';
        if(!empty($s['arrows'])&&count($slides)>1){
            $a_css = "position:absolute;top:50%;transform:translateY(-50%);background:{$abg};color:{$ac};border:none;border-radius:50%;width:{$asz}px;height:{$asz}px;font-size:".intval($asz*0.5)."px;cursor:pointer;display:flex;align-items:center;justify-content:center;";
            echo '<button onclick="scbCarPrev(\''.$uid.'\')" style="'.$a_css.'left:10px;">‹</button>';
            echo '<button onclick="scbCarNext(\''.$uid.'\')" style="'.$a_css.'right:10px;">›</button>';
        }
        if(!empty($s['dots'])&&count($slides)>1){
            echo '<div class="scb-car-dots" style="position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px;">';
            foreach($slides as $i=>$_) echo '<span class="scb-car-dot" data-idx="'.$i.'" style="width:8px;height:8px;border-radius:50%;background:'.($i===0?$dc:$di).';cursor:pointer;" onclick="scbCarGo(\''.$uid.'\','.$i.')"></span>';
            echo '</div>';
        }
        echo '</div>';
        $n=count($slides);$dc_esc=str_replace("'","\\'",$dc);$di_esc=str_replace("'","\\'",$di);
        echo "<script>window.scbCarState=window.scbCarState||{};window.scbCarState['{$uid}']={cur:0,total:{$n},dc:'{$dc_esc}',di:'{$di_esc}'};function scbCarGo(id,i){var st=window.scbCarState[id],el=document.getElementById(id);if(!el)return;st.cur=((i%st.total)+st.total)%st.total;el.querySelector('.scb-car-track').style.transform='translateX(-'+(st.cur*100)+'%)';el.querySelectorAll('.scb-car-dot').forEach(function(d,j){d.style.background=j===st.cur?st.dc:st.di;});}function scbCarPrev(id){scbCarGo(id,window.scbCarState[id].cur-1);}function scbCarNext(id){scbCarGo(id,window.scbCarState[id].cur+1);}".($auto?"setInterval(function(){scbCarNext('{$uid}');},{$auto});":"")."</script>";
    }
}
