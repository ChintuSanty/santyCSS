<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Team_Member extends Widget_Base {
    public function get_type(): string     { return 'team-member'; }
    public function get_title(): string    { return __('Team Member','santycss-builder'); }
    public function get_icon(): string     { return '👤'; }
    public function get_category(): string { return 'content'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->image('photo','Photo'),
            $this->text('name','Name','Jane Smith'),
            $this->text('role','Role','Lead Designer'),
            $this->textarea('bio','Bio','A short bio about this team member.'),
            $this->repeater('social','Social Links',[$this->select('platform','Platform',['twitter'=>'Twitter','linkedin'=>'LinkedIn','github'=>'GitHub','email'=>'Email'],'linkedin'),$this->url('url','URL','#')],[]),
            $this->select('style','Card Style',['card'=>'Card','minimal'=>'Minimal','centered'=>'Centered'],'card'),
        ];
    }
    public function render(array $s): void {
        $photo=esc_url($s['photo']['url']??'');$name=esc_html($s['name']??'');$role=esc_html($s['role']??'');$bio=esc_html($s['bio']??'');
        $style=$s['style']??'card';$cen=$style==='centered';
        $social_icons=['twitter'=>'🐦','linkedin'=>'💼','github'=>'🐙','email'=>'✉️'];
        echo "<div class=\"scb-team-member background-white round-corners-16 add-padding-28 add-shadow-sm ".($cen?'text-center':'')."\">";
        if($cen) echo "<div class=\"make-flex justify-center add-margin-bottom-16\">";
        $img_html=$photo?"<img src=\"{$photo}\" alt=\"{$name}\" style=\"width:80px;height:80px;border-radius:50%;object-fit:cover;\">":"<div class=\"make-flex align-center justify-center background-blue-500 color-white text-bold round-corners-full\" style=\"width:80px;height:80px;font-size:28px;\">".mb_substr($name,0,1)."</div>";
        echo $img_html;
        if($cen) echo '</div>';
        else echo '<div style="margin-bottom:16px;">'.$img_html.'</div>';
        echo "<h3 class=\"set-text-18 text-semibold color-gray-900 add-margin-bottom-4\">{$name}</h3>";
        echo "<div class=\"set-text-14 color-blue-600 text-semibold add-margin-bottom-12\">{$role}</div>";
        if($bio) echo "<p class=\"set-text-14 color-gray-500 line-height-relaxed add-margin-bottom-16\">{$bio}</p>";
        if(!empty($s['social'])){
            echo "<div class=\"make-flex gap-8 ".($cen?'justify-center':'')."\">";
            foreach($s['social'] as $sl){
                $ic=$social_icons[$sl['platform']??'']??'🔗';
                echo '<a href="'.esc_url($sl['url']??'#').'" target="_blank" style="font-size:18px;text-decoration:none;">'.$ic.'</a>';
            }
            echo '</div>';
        }
        echo '</div>';
    }
}
