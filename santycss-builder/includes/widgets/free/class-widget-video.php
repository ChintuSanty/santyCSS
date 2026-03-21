<?php
namespace SCB\Widgets\Free;
use SCB\Widgets\Widget_Base;
defined( 'ABSPATH' ) || exit;

class Video extends Widget_Base {
    public function get_type(): string     { return 'video'; }
    public function get_title(): string    { return __( 'Video', 'santycss-builder' ); }
    public function get_icon(): string     { return '▶️'; }
    public function get_category(): string { return 'media'; }

    public function get_controls(): array {
        return [
            $this->select( 'source', 'Source', [ 'youtube'=>'YouTube','vimeo'=>'Vimeo','self'=>'Self Hosted' ], 'youtube' ),
            $this->text( 'url', 'Video URL', '' ),
            $this->toggle( 'autoplay', 'Autoplay', false ),
            $this->toggle( 'loop', 'Loop', false ),
            $this->toggle( 'mute', 'Mute', false ),
            $this->toggle( 'controls', 'Show Controls', true ),
            $this->number( 'aspect_h', 'Aspect Ratio Height', 9, 1, 100 ),
            $this->number( 'aspect_w', 'Aspect Ratio Width', 16, 1, 100 ),
        ];
    }

    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Shape')),
            $this->set_tab('style', $this->number('border_radius','Border Radius (px)',8,0,50)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Border')),
            $this->set_tab('style', $this->select('video_border','Border Type',['none'=>'None','solid'=>'Solid','dashed'=>'Dashed'],'none')),
            $this->set_tab('style', $this->number('video_border_width','Width (px)',2,1,20)),
            $this->set_tab('style', $this->color('video_border_color','Color','#e2e8f0')),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Overlay')),
            $this->set_tab('style', $this->color('overlay_color','Overlay Color','')),
            $this->set_tab('style', $this->slider('overlay_opacity','Overlay Opacity (%)',50,0,100)),
        ];
    }

    public function render( array $s ): void {
        $source = $s['source'] ?? 'youtube';
        $url    = $s['url'] ?? '';
        $aw     = intval( $s['aspect_w'] ?? 16 );
        $ah     = intval( $s['aspect_h'] ?? 9 );
        $ratio  = ( $ah / $aw ) * 100;
        $r      = intval( $s['border_radius'] ?? 8 );
        $bt     = $s['video_border']??'none';$bw=intval($s['video_border_width']??2);$bc=esc_attr($s['video_border_color']??'#e2e8f0');
        $oc     = esc_attr($s['overlay_color']??'');$oo=intval($s['overlay_opacity']??50);
        $params = [];
        if ( ! empty( $s['autoplay'] ) ) $params[] = 'autoplay=1';
        if ( ! empty( $s['loop'] ) )     $params[] = 'loop=1';
        if ( ! empty( $s['mute'] ) )     $params[] = 'mute=1&muted=1';
        if ( empty( $s['controls'] ) )   $params[] = 'controls=0';
        $q = $params ? '?' . implode( '&', $params ) : '';
        $embed_url = '';
        if ( $source === 'youtube' ) {
            preg_match( '/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $m );
            $vid = $m[1] ?? '';
            $embed_url = $vid ? "https://www.youtube.com/embed/{$vid}{$q}" : '';
        } elseif ( $source === 'vimeo' ) {
            preg_match( '/vimeo\.com\/(\d+)/', $url, $m );
            $vid = $m[1] ?? '';
            $embed_url = $vid ? "https://player.vimeo.com/video/{$vid}{$q}" : '';
        }
        $border_css = $bt!=='none'?"border:{$bw}px {$bt} {$bc};":'';
        echo "<div class=\"scb-video-wrap overflow-hidden\" style=\"position:relative;padding-bottom:{$ratio}%;height:0;border-radius:{$r}px;{$border_css}\">";
        if ( $embed_url ) {
            echo "<iframe src=\"" . esc_url( $embed_url ) . "\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" frameborder=\"0\" allow=\"accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope\" allowfullscreen></iframe>";
        } elseif ( $source === 'self' && $url ) {
            echo "<video src=\"" . esc_url( $url ) . "\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" " . ( empty($s['controls']) ? '' : 'controls' ) . "></video>";
        } else {
            echo '<div class="scb-placeholder" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f3f4f6;"><span>▶️ Enter a video URL</span></div>';
        }
        if($oc) echo "<div style=\"position:absolute;inset:0;background:{$oc};opacity:".($oo/100).";pointer-events:none;border-radius:{$r}px;\"></div>";
        echo '</div>';
    }
}
