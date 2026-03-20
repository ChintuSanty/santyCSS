<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Image_Box extends Widget_Base {
    public function get_type(): string     { return 'image-box'; }
    public function get_title(): string    { return __('Image Box','santycss-builder'); }
    public function get_icon(): string     { return '🗃️'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->image('image','Image'),
            $this->text('title','Title','Feature Title'),
            $this->textarea('description','Description','Your feature description goes here.'),
            $this->url('link','Link',''),
            $this->select('position','Image Position',['top'=>'Top','left'=>'Left','right'=>'Right'],'top'),
            $this->number('img_width','Image Width (px)',80,20,400),
            $this->number('img_radius','Image Radius (px)',8,0,100),
        ];
    }
    public function render(array $s): void {
        $img_url = esc_url($s['image']['url']??'');
        $title   = esc_html($s['title']??'');
        $desc    = esc_html($s['description']??'');
        $pos     = $s['position']??'top';
        $w       = intval($s['img_width']??80);
        $r       = intval($s['img_radius']??8);
        $wrap_cls= $pos==='top'?'make-flex flex-column align-center text-center gap-16':'make-flex align-start gap-16';
        if($pos==='right') $wrap_cls.=' flex-row-reverse';
        $inner   = $img_url?"<img src=\"{$img_url}\" style=\"width:{$w}px;height:auto;border-radius:{$r}px;flex-shrink:0;\" alt=\"\">":"<div style=\"width:{$w}px;height:{$w}px;border-radius:{$r}px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;\">🖼️</div>";
        echo "<div class=\"scb-image-box {$wrap_cls}\">";
        if(!empty($s['link'])) echo '<a href="'.esc_url($s['link'])."\" style=\"text-decoration:none;color:inherit;display:contents;\">";
        echo $inner;
        echo '<div><h3 class="set-text-18 text-semibold color-gray-900 add-margin-bottom-8">'.$title.'</h3><p class="set-text-14 color-gray-500 line-height-relaxed">'.$desc.'</p></div>';
        if(!empty($s['link'])) echo '</a>';
        echo '</div>';
    }
}
