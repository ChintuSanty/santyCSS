<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Image extends Widget_Base {
    public function get_type(): string     { return 'image'; }
    public function get_title(): string    { return __( 'Image', 'santycss-builder' ); }
    public function get_icon(): string     { return '🖼️'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->image( 'image', 'Image' ),
            $this->text( 'alt', 'Alt Text', '' ),
            $this->text( 'caption', 'Caption', '' ),
            $this->url( 'link', 'Link', '' ),
            $this->select( 'align', 'Alignment', [ 'left'=>'Left','center'=>'Center','right'=>'Right' ], 'center' ),
            $this->select( 'size', 'Width', [ 'set-width-full'=>'Full','set-width-1-of-2'=>'Half','set-width-1-of-3'=>'Third','auto'=>'Auto' ], 'set-width-full' ),
        ];
    }

    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Image')),
            $this->set_tab('style', $this->number('border_radius','Border Radius (px)',0,0,200)),
            $this->set_tab('style', $this->select('object_fit','Object Fit',['cover'=>'Cover','contain'=>'Contain','fill'=>'Fill','none'=>'None'],'cover')),
            $this->set_tab('style', $this->number('max_height','Max Height (px)',0,0,1200)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Border')),
            $this->set_tab('style', $this->select('img_border_type','Type',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed'],'none')),
            $this->set_tab('style', $this->number('img_border_width','Width (px)',2,1,20)),
            $this->set_tab('style', $this->color('img_border_color','Color','#e2e8f0')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('CSS Filters')),
            $this->set_tab('style', $this->slider('filter_brightness','Brightness (%)',100,0,200)),
            $this->set_tab('style', $this->slider('filter_contrast','Contrast (%)',100,0,200)),
            $this->set_tab('style', $this->slider('filter_saturate','Saturate (%)',100,0,200)),
            $this->set_tab('style', $this->slider('filter_blur','Blur (px)',0,0,20)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Caption')),
            $this->set_tab('style', $this->color('caption_color','Caption Color','#6b7280')),
            $this->set_tab('style', $this->number('caption_size','Caption Size (px)',13,10,32)),
            $this->set_tab('style', $this->select('caption_align','Caption Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center')),
        ];
    }

    public function render( array $s ): void {
        $url    = esc_url( $s['image']['url'] ?? '' );
        $alt    = esc_attr( $s['alt'] ?? '' );
        $align  = $s['align'] ?? 'center';
        $w_cls  = ($s['size'] ?? '') !== 'auto' ? ( $s['size'] ?? 'set-width-full' ) : '';
        $wrap   = "make-flex justify-{$align}";

        // Image style
        $img_css = ['display:block'];
        $r = intval($s['border_radius'] ?? 0);
        if ($r) $img_css[] = "border-radius:{$r}px";
        $of = $s['object_fit'] ?? '';
        if ($of && $of !== 'cover') $img_css[] = "object-fit:{$of}";
        $mh = intval($s['max_height'] ?? 0);
        if ($mh) { $img_css[] = "max-height:{$mh}px"; $img_css[] = "width:auto;max-width:100%"; }
        $b_type = $s['img_border_type'] ?? 'none';
        if ($b_type !== 'none') {
            $bw = intval($s['img_border_width']??2);$bc=esc_attr($s['img_border_color']??'#e2e8f0');
            $img_css[] = "border:{$bw}px {$b_type} {$bc}";
        }
        $br = intval($s['filter_brightness']??100);$ct=intval($s['filter_contrast']??100);
        $sa = intval($s['filter_saturate']??100);$bl=intval($s['filter_blur']??0);
        if ($br!==100||$ct!==100||$sa!==100||$bl>0) {
            $img_css[] = "filter:brightness({$br}%) contrast({$ct}%) saturate({$sa}%) blur({$bl}px)";
        }
        $img_style = implode(';',$img_css);

        // Caption style
        $cap_css = [];
        $cc = $s['caption_color']??'#6b7280';if($cc!=='#6b7280') $cap_css[]="color:{$cc}";
        $cs = intval($s['caption_size']??13);if($cs!==13) $cap_css[]="font-size:{$cs}px";
        $ca = $s['caption_align']??'center';
        $cap_style = implode(';',$cap_css);

        if ( ! $url ) { echo '<div class="scb-placeholder-img">📷 No image selected</div>'; return; }
        $img = "<img src=\"{$url}\" alt=\"{$alt}\" class=\"scb-image {$w_cls}\" style=\"{$img_style}\">";
        if ( ! empty( $s['link'] ) ) $img = '<a href="' . esc_url( $s['link'] ) . '">' . $img . '</a>';
        echo '<figure class="' . esc_attr( $wrap ) . ' add-margin-bottom-0 make-flex flex-column">';
        echo $img;
        if ( ! empty( $s['caption'] ) ) {
            echo '<figcaption class="text-' . esc_attr($ca) . '"'
                 . ($cap_style ? ' style="' . esc_attr($cap_style) . '"' : ' style="font-size:13px;color:#6b7280;"') . '>'
                 . esc_html( $s['caption'] ) . '</figcaption>';
        }
        echo '</figure>';
    }
}
