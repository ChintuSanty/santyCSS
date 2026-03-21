<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;

class Text_Path extends Widget_Base {
    public function get_type(): string     { return 'text-path'; }
    public function get_title(): string    { return __('Text Path','santycss-builder'); }
    public function get_icon(): string     { return '〰'; }
    public function get_category(): string { return 'basic'; }

    public function get_controls(): array {
        return [
            $this->text('text','Text','Your curved text here'),
            $this->select('path_type','Path Shape',[
                'arc-top'    => 'Arc Top',
                'arc-bottom' => 'Arc Bottom',
                'circle'     => 'Full Circle',
                'wave'       => 'Wave',
            ],'arc-top'),
            $this->number('size','SVG Width (px)',320,80,1000),
            $this->toggle('repeat','Repeat Text',false),
            $this->select('align','Alignment',['left'=>'Left','center'=>'Center','right'=>'Right'],'center'),
        ];
    }

    public function get_style_controls(): array {
        return [
            $this->set_tab('style', $this->heading_control('Typography')),
            $this->set_tab('style', $this->select('font_family','Font Family',$this->font_families(),'')),
            $this->set_tab('style', $this->number('font_size','Font Size (px)',20,8,80)),
            $this->set_tab('style', $this->select('font_weight','Font Weight',['normal'=>'Normal','bold'=>'Bold','600'=>'Semibold','800'=>'Extra Bold'],'normal')),
            $this->set_tab('style', $this->number('letter_spacing','Letter Spacing (px)',0,-10,30)),
            $this->set_tab('style', $this->divider_control()),
            $this->set_tab('style', $this->heading_control('Color')),
            $this->set_tab('style', $this->color('color','Text Color','#1e293b')),
            $this->set_tab('style', $this->toggle('stroke','Enable Stroke',false)),
            $this->set_tab('style', $this->color('stroke_color','Stroke Color','#ffffff')),
            $this->set_tab('style', $this->number('stroke_width','Stroke Width (px)',1,1,10)),
        ];
    }

    public function render( array $s ): void {
        $this->maybe_enqueue_font($s['font_family']??'');
        $text    = esc_html($s['text'] ?? 'Your curved text here');
        $type    = $s['path_type'] ?? 'arc-top';
        $size    = intval($s['size'] ?? 320);
        $fs      = intval($s['font_size'] ?? 20);
        $fw      = esc_attr($s['font_weight'] ?? 'normal');
        $color   = esc_attr($s['color'] ?? '#1e293b');
        $align   = esc_attr($s['align'] ?? 'center');
        $ls      = intval($s['letter_spacing'] ?? 0);
        $repeat  = ! empty($s['repeat']);
        $ff      = !empty($s['font_family'])?esc_attr($s['font_family']):'';
        $stroke  = !empty($s['stroke']);$sc=esc_attr($s['stroke_color']??'#ffffff');$sw=intval($s['stroke_width']??1);
        $uid     = 'tp-' . uniqid();
        $cx=$size/2;$cy=$size/2;$r=($size/2)-($fs+10);
        switch ($type) {
            case 'arc-top':
                $d="M ".($cx-$r).",{$cy} A $r,$r 0 0,1 ".($cx+$r).",{$cy}";$vh=$cy+10;break;
            case 'arc-bottom':
                $d="M ".($cx-$r).",{$cy} A $r,$r 0 0,0 ".($cx+$r).",{$cy}";$vh=$cy+$r+10;break;
            case 'circle':
                $d="M {$cx},".($cy-$r)." A $r,$r 0 1,1 ".($cx-0.01).",".($cy-$r);$vh=$size;break;
            default:
                $d="M 0,{$cy} Q ".($size*.25).",".($cy-$r*.5)." ".($size*.5).",{$cy} Q ".($size*.75).",".($cy+$r*.5)." {$size},{$cy}";
                $vh=$cy+$r*.5+$fs+10;
        }
        $dt = $repeat ? implode('  •  ', array_fill(0, 5, $text)) : $text;
        echo '<div style="text-align:'.$align.';">';
        echo '<svg width="'.$size.'" height="'.max($vh,$fs+20).'" xmlns="http://www.w3.org/2000/svg" overflow="visible">';
        echo '<defs><path id="'.$uid.'" d="'.esc_attr($d).'"/></defs>';
        echo '<text font-size="'.$fs.'" font-weight="'.$fw.'" fill="'.$color.'" letter-spacing="'.$ls.'"'.($ff?' font-family="'.$ff.'"':'').($stroke?' stroke="'.$sc.'" stroke-width="'.$sw.'" paint-order="stroke"':'').'>';
        echo '<textPath href="#'.$uid.'">'.$dt.'</textPath>';
        echo '</text></svg></div>';
    }
}
