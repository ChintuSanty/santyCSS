<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Inner_Section extends Widget_Base {
    public function get_type(): string     { return 'inner-section'; }
    public function get_title(): string    { return __('Inner Section','santycss-builder'); }
    public function get_icon(): string     { return '⬛'; }
    public function get_category(): string { return 'layout'; }

    public function get_controls(): array {
        return [
            $this->select('columns_count','Columns',['2'=>'2 Columns','3'=>'3 Columns','4'=>'4 Columns'],'2'),
            $this->select('column_gap','Column Gap',['0'=>'None','10'=>'Small','20'=>'Medium','32'=>'Large','48'=>'XLarge'],'20'),
            $this->select('align_items','Vertical Align',['stretch'=>'Stretch','flex-start'=>'Top','center'=>'Middle','flex-end'=>'Bottom'],'stretch'),
        ];
    }

    /** Actual rendering is handled by Renderer::render_inner_section() */
    public function render( array $s ): void {
        echo '<!-- inner-section rendered by renderer -->';
    }
}
