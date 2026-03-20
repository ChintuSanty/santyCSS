<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Testimonial extends Widget_Base {
    public function get_type(): string     { return 'testimonial'; }
    public function get_title(): string    { return __('Testimonial','santycss-builder'); }
    public function get_icon(): string     { return '💬'; }
    public function get_category(): string { return 'general'; }
    public function get_controls(): array {
        return [
            $this->textarea('quote','Quote','This product completely changed how I work. Highly recommended!'),
            $this->text('name','Author Name','Jane Smith'),
            $this->text('role','Author Role','Frontend Developer'),
            $this->image('avatar','Avatar'),
            $this->number('rating','Rating (0-5)',5,0,5),
            $this->select('style','Card Style',['default'=>'Default','minimal'=>'Minimal','bordered'=>'Bordered'],'default'),
        ];
    }
    public function render(array $s): void {
        $quote  = esc_html($s['quote']??'');
        $name   = esc_html($s['name']??'');
        $role   = esc_html($s['role']??'');
        $rating = intval($s['rating']??5);
        $avatar = esc_url($s['avatar']['url']??'');
        $stars  = str_repeat('★',$rating).str_repeat('☆',5-$rating);
        $card_cls = $s['style']==='bordered'?'add-border-1 border-color-gray-200':'add-shadow-sm';
        echo "<div class=\"scb-testimonial background-white round-corners-16 add-padding-28 {$card_cls}\">";
        if($rating) echo "<div class=\"add-margin-bottom-16 color-amber-400 set-text-18\">{$stars}</div>";
        echo "<p class=\"set-text-16 color-gray-700 line-height-relaxed add-margin-bottom-20\">\"{$quote}\"</p>";
        echo '<div class="make-flex align-center gap-12">';
        if($avatar) echo "<img src=\"{$avatar}\" alt=\"{$name}\" style=\"width:44px;height:44px;border-radius:50%;object-fit:cover;\">";
        else echo "<div class=\"make-flex align-center justify-center background-blue-500 color-white text-bold round-corners-full set-text-16\" style=\"width:44px;height:44px;flex-shrink:0;\">".esc_html(mb_substr($name,0,1))."</div>";
        echo "<div><div class=\"set-text-14 text-semibold color-gray-900\">{$name}</div><div class=\"set-text-12 color-gray-400\">{$role}</div></div>";
        echo '</div></div>';
    }
}
