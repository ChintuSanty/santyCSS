<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Contact_Form extends Widget_Base {
    public function get_type(): string     { return 'contact-form'; }
    public function get_title(): string    { return __('Contact Form','santycss-builder'); }
    public function get_icon(): string     { return '📮'; }
    public function get_category(): string { return 'interactive'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->text('heading','Form Heading','Get In Touch'),
            $this->repeater('fields','Fields',[
                $this->text('label','Label','Name'),
                $this->select('type','Type',['text'=>'Text','email'=>'Email','tel'=>'Phone','textarea'=>'Textarea','select'=>'Select','checkbox'=>'Checkbox','number'=>'Number'],'text'),
                $this->toggle('required','Required',false),
                $this->text('placeholder','Placeholder','Enter your name'),
            ],[
                ['label'=>'Name','type'=>'text','required'=>true,'placeholder'=>'Your name'],
                ['label'=>'Email','type'=>'email','required'=>true,'placeholder'=>'your@email.com'],
                ['label'=>'Message','type'=>'textarea','required'=>false,'placeholder'=>'Your message…'],
            ]),
            $this->text('btn_text','Submit Button Text','Send Message'),
            $this->text('success_message','Success Message','Thanks! We will get back to you soon.'),
            $this->text('email_to','Send To (email)',''),
        ];
    }
    public function render(array $s): void {
        $uid=uniqid('scf_');
        if(!empty($heading=$s['heading']??'')) echo "<h3 class=\"set-text-24 text-bold color-gray-900 add-margin-bottom-24\">{$heading}</h3>";
        echo "<form class=\"scb-contact-form make-flex flex-column gap-16\" id=\"{$uid}\" onsubmit=\"scbFormSubmit(event,this)\">";
        wp_nonce_field('scb_form','scb_form_nonce');
        echo '<input type="hidden" name="scb_email_to" value="'.esc_attr($s['email_to']??get_option('admin_email')).'">';
        foreach($s['fields']??[] as $f){
            $label=esc_html($f['label']??'');$type=$f['type']??'text';$req=!empty($f['required'])?'required':'';$ph=esc_attr($f['placeholder']??'');
            echo "<div class=\"make-flex flex-column gap-4\">";
            echo "<label class=\"set-text-13 text-semibold color-gray-700\">{$label}".($req?" <span style=\"color:#ef4444;\">*</span>":'')."</label>";
            if($type==='textarea') echo "<textarea class=\"input\" name=\"field_{$label}\" placeholder=\"{$ph}\" rows=\"4\" {$req}></textarea>";
            else echo "<input class=\"input\" type=\"{$type}\" name=\"field_{$label}\" placeholder=\"{$ph}\" {$req}>";
            echo '</div>';
        }
        echo '<div id="'.$uid.'_msg"></div>';
        echo '<button type="submit" class="make-button style-primary size-large shape-rounded">'.esc_html($s['btn_text']??'Send').'</button>';
        echo '</form>';
        $success=esc_js($s['success_message']??'Thank you!');
        echo "<script>function scbFormSubmit(e,form){e.preventDefault();var data=new FormData(form);data.append('action','scb_form_submit');fetch('".admin_url('admin-ajax.php')."',{method:'POST',body:data}).then(function(){form.reset();document.getElementById(form.id+'_msg').innerHTML='<div class=\"alert alert-success\">{$success}</div>';});}</script>";
    }
}
