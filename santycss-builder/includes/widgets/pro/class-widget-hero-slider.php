<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Hero_Slider extends Widget_Base {
    public function get_type(): string     { return 'hero-slider'; }
    public function get_title(): string    { return __('Hero / Slides','santycss-builder'); }
    public function get_icon(): string     { return '🎬'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->repeater('slides','Slides',[
                $this->image('bg_image','Background Image'),
                $this->color('overlay','Overlay Color','rgba(0,0,0,0.5)'),
                $this->text('eyebrow','Eyebrow Text','New Release'),
                $this->text('heading','Heading','Welcome to Our World'),
                $this->textarea('subtext','Subtext','Discover amazing things with us.'),
                $this->text('btn1_text','Button 1 Text','Get Started'),
                $this->url('btn1_url','Button 1 URL','#'),
                $this->text('btn2_text','Button 2 Text','Learn More'),
                $this->url('btn2_url','Button 2 URL','#'),
            ],[
                ['heading'=>'Slide One — Big Bold Heading','subtext'=>'Subtext that explains the slide.','btn1_text'=>'Get Started','btn1_url'=>'#','btn2_text'=>'Learn More','btn2_url'=>'#','eyebrow'=>'Featured'],
            ]),
            $this->number('min_height','Min Height (px)',600,200,1200),
            $this->toggle('autoplay','Autoplay',false),
            $this->number('interval','Interval (ms)',5000,1000,20000,500),
            $this->select('align','Content Align',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
        ];
    }
    public function render(array $s): void {
        $slides=$s['slides']??[];$uid='scb-hero-'.uniqid();$h=intval($s['min_height']??600);$align=$s['align']??'center';$auto=!empty($s['autoplay'])?intval($s['interval']??5000):0;
        echo "<div class=\"scb-hero-slider\" id=\"{$uid}\" style=\"position:relative;overflow:hidden;\">";
        echo '<div class="scb-hero-track" style="display:flex;transition:transform .5s ease;">';
        foreach($slides as $sl){
            $bg_img=esc_url($sl['bg_image']['url']??'');$ov=esc_attr($sl['overlay']??'rgba(0,0,0,0.5)');
            $bg_style=$bg_img?"background-image:url({$bg_img});background-size:cover;background-position:center;":'background:#1e293b;';
            echo "<div class=\"scb-hero-slide\" style=\"min-width:100%;min-height:{$h}px;{$bg_style}display:flex;align-items:center;justify-content:center;position:relative;\">";
            echo "<div style=\"position:absolute;inset:0;background:{$ov};\"></div>";
            echo "<div class=\"scb-hero-content text-{$align}\" style=\"position:relative;z-index:1;max-width:800px;padding:40px 24px;\">";
            if(!empty($sl['eyebrow'])) echo '<div class="badge background-white-10 color-white add-margin-bottom-16">'.esc_html($sl['eyebrow']).'</div>';
            echo '<h2 class="set-text-56 text-bold color-white add-margin-bottom-20" style="line-height:1.1;">'.esc_html($sl['heading']??'').'</h2>';
            if(!empty($sl['subtext'])) echo '<p class="set-text-20 color-white add-margin-bottom-32" style="opacity:.85;">'.esc_html($sl['subtext']).'</p>';
            echo "<div class=\"make-flex gap-12 justify-{$align} flex-wrap\">";
            if(!empty($sl['btn1_text'])) echo '<a href="'.esc_url($sl['btn1_url']??'#').'" class="make-button style-primary size-large shape-pill">'.esc_html($sl['btn1_text']).'</a>';
            if(!empty($sl['btn2_text'])) echo '<a href="'.esc_url($sl['btn2_url']??'#').'" class="make-button style-ghost size-large shape-pill" style="border-color:white;color:white;">'.esc_html($sl['btn2_text']).'</a>';
            echo '</div></div></div>';
        }
        echo '</div>';
        if(count($slides)>1){
            echo '<button onclick="scbHeroPrev(\''.$uid.'\')" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:50%;width:48px;height:48px;font-size:24px;cursor:pointer;backdrop-filter:blur(4px);">‹</button>';
            echo '<button onclick="scbHeroNext(\''.$uid.'\')" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:50%;width:48px;height:48px;font-size:24px;cursor:pointer;backdrop-filter:blur(4px);">›</button>';
            echo '<div style="position:absolute;bottom:20px;left:0;right:0;display:flex;justify-content:center;gap:8px;">';
            foreach($slides as $i=>$_) echo '<button onclick="scbHeroGo(\''.$uid.'\','.$i.')" style="width:'.($i===0?'24':'8').'px;height:8px;border-radius:4px;background:'.($i===0?'#fff':'rgba(255,255,255,.5)').';border:none;cursor:pointer;transition:all .2s;" class="scb-hero-dot"></button>';
            echo '</div>';
        }
        echo '</div>';
        $n=count($slides);
        echo "<script>window.scbHState=window.scbHState||{};window.scbHState['{$uid}']={cur:0,total:{$n}};function scbHeroGo(id,i){var st=window.scbHState[id],el=document.getElementById(id);if(!el)return;st.cur=((i%st.total)+st.total)%st.total;el.querySelector('.scb-hero-track').style.transform='translateX(-'+(st.cur*100)+'%)';el.querySelectorAll('.scb-hero-dot').forEach(function(d,j){d.style.width=j===st.cur?'24px':'8px';d.style.background=j===st.cur?'#fff':'rgba(255,255,255,.5)';});}function scbHeroPrev(id){scbHeroGo(id,window.scbHState[id].cur-1);}function scbHeroNext(id){scbHeroGo(id,window.scbHState[id].cur+1);}".($auto?"setInterval(function(){scbHeroNext('{$uid}');},{$auto});":"")."</script>";
    }
}
