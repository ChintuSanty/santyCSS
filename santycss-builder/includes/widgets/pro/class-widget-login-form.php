<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Login_Form extends Widget_Base {
    public function get_type(): string     { return 'login-form'; }
    public function get_title(): string    { return __('Login Form','santycss-builder'); }
    public function get_icon(): string     { return '🔐'; }
    public function get_category(): string { return 'interactive'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->text('heading','Heading','Welcome Back'),
            $this->text('subtext','Subtext','Sign in to your account'),
            $this->url('redirect','Redirect After Login',''),
            $this->toggle('show_register','Show Register Link',true),
            $this->toggle('show_forgot','Show Forgot Password',true),
            $this->text('btn_text','Button Text','Sign In'),
        ];
    }
    public function render(array $s): void {
        if(is_user_logged_in()){
            echo '<div class="alert alert-info">You are already logged in. <a href="'.esc_url(wp_logout_url(get_permalink())).'">Sign out</a></div>';
            return;
        }
        $redir=esc_attr($s['redirect']??'');
        echo '<div class="scb-login-form" style="max-width:400px;margin:0 auto;">';
        echo '<div class="background-white round-corners-20 add-padding-40 add-shadow-lg add-border-1 border-color-gray-100">';
        echo '<h2 class="set-text-28 text-bold color-gray-900 text-center add-margin-bottom-8">'.esc_html($s['heading']??'').'</h2>';
        if(!empty($s['subtext'])) echo '<p class="set-text-15 color-gray-500 text-center add-margin-bottom-32">'.esc_html($s['subtext']).'</p>';
        wp_login_form(['redirect'=>$redir,'label_log_in'=>esc_html($s['btn_text']??'Sign In')]);
        if(!empty($s['show_forgot'])) echo '<p class="text-center set-text-13 add-margin-top-16"><a href="'.esc_url(wp_lostpassword_url()).'" class="color-blue-600" style="text-decoration:none;">Forgot password?</a></p>';
        if(!empty($s['show_register'])&&get_option('users_can_register')) echo '<p class="text-center set-text-13 add-margin-top-8">No account? <a href="'.esc_url(wp_registration_url()).'" class="color-blue-600" style="text-decoration:none;">Register</a></p>';
        echo '</div></div>';
    }
}
