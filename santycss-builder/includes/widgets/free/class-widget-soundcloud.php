<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Sound_Cloud extends Widget_Base {
    public function get_type(): string     { return 'soundcloud'; }
    public function get_title(): string    { return __('SoundCloud','santycss-builder'); }
    public function get_icon(): string     { return '🎵'; }
    public function get_category(): string { return 'media'; }

    public function get_controls(): array {
        return [
            $this->url('track_url','SoundCloud Track/Playlist URL','https://soundcloud.com/'),
            $this->number('height','Player Height (px)',166,100,400),
            $this->toggle('auto_play','Auto Play',false),
            $this->toggle('hide_related','Hide Related Tracks',true),
            $this->toggle('show_comments','Show Comments',false),
            $this->toggle('show_user','Show Artist',true),
            $this->toggle('buying','Show Buy Link',false),
            $this->toggle('sharing','Show Share Link',true),
            $this->toggle('download','Show Download',false),
            $this->color('accent_color','Accent Color','#ff5500'),
        ];
    }

    public function render( array $s ): void {
        $url = esc_url($s['track_url'] ?? '');
        if ( empty($url) || strpos($url,'soundcloud.com') === false ) {
            echo '<div style="padding:20px;background:#f8fafc;border:2px dashed #e2e8f0;text-align:center;color:#94a3b8;border-radius:8px;">Enter a SoundCloud URL in the settings.</div>';
            return;
        }
        $color  = ltrim($s['accent_color'] ?? '#ff5500','#');
        $params = [
            'url'          => $url,
            'color'        => '%23' . $color,
            'auto_play'    => ! empty($s['auto_play'])       ? 'true' : 'false',
            'hide_related' => ! empty($s['hide_related'])    ? 'true' : 'false',
            'show_comments'=> ! empty($s['show_comments'])   ? 'true' : 'false',
            'show_user'    => ! empty($s['show_user'])       ? 'true' : 'false',
            'buying'       => ! empty($s['buying'])          ? 'true' : 'false',
            'sharing'      => ! empty($s['sharing'])         ? 'true' : 'false',
            'download'     => ! empty($s['download'])        ? 'true' : 'false',
            'show_reposts' => 'false',
            'visual'       => 'false',
        ];
        $qs = implode('&', array_map(fn($k,$v)=>$k.'='.$v, array_keys($params), $params));
        $h  = intval($s['height'] ?? 166);
        echo '<iframe width="100%" height="' . $h . '" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?' . esc_attr($qs) . '"></iframe>';
    }
}
