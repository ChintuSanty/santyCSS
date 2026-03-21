<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Code_Highlight extends Widget_Base {
    public function get_type(): string     { return 'code-highlight'; }
    public function get_title(): string    { return __('Code Block','santycss-builder'); }
    public function get_icon(): string     { return '</\>'; }
    public function get_category(): string { return 'content'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->textarea('code','Code','// Hello World'),
            $this->text('language','Language Label','js'),
            $this->text('filename','Filename (optional)',''),
            $this->toggle('show_copy','Show Copy Button',true),
            $this->toggle('show_line_numbers','Line Numbers',false),
        ];
    }
    public function render(array $s): void {
        $code=esc_html($s['code']??'');$lang=esc_html($s['language']??'code');$file=esc_html($s['filename']??'');$uid='scb-cb-'.uniqid();
        echo '<div class="code-block">';
        echo '<div class="code-block-header"><div class="make-flex align-center gap-8"><div class="code-block-dots"><div class="code-block-dot code-block-dot-red"></div><div class="code-block-dot code-block-dot-yellow"></div><div class="code-block-dot code-block-dot-green"></div></div>'.($file?"<span class=\"code-block-lang\">{$file}</span>":"<span class=\"code-block-lang\">{$lang}</span>").'</div>';
        if(!empty($s['show_copy'])) echo "<button class=\"code-block-copy\" onclick=\"navigator.clipboard.writeText(document.getElementById('{$uid}').innerText).then(function(){var b=event.target;b.textContent='✓ Copied';setTimeout(function(){b.textContent='Copy';},1500);})\">Copy</button>";
        echo '</div>';
        echo "<pre id=\"{$uid}\" style=\"padding:16px 20px;margin:0;overflow-x:auto;\"><code>{$code}</code></pre>";
        echo '</div>';
    }
}
