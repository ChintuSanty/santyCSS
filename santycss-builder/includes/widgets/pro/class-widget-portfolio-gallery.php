<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Portfolio_Gallery extends Widget_Base {
    public function get_type(): string     { return 'portfolio-gallery'; }
    public function get_title(): string    { return __('Portfolio Gallery','santycss-builder'); }
    public function get_icon(): string     { return '🖼'; }
    public function get_category(): string { return 'pro'; }
    public function get_tier(): string     { return 'pro'; }
    public function get_controls(): array {
        return [
            $this->repeater('items','Items',[
                $this->image('image','Image'),
                $this->text('title','Title','Project Title'),
                $this->text('category','Category','web'),
                $this->url('link','Link','#'),
            ],[]),
            $this->select('columns','Columns',['2'=>'2','3'=>'3','4'=>'4'],'3'),
            $this->toggle('filterable','Filter Buttons',true),
            $this->number('gap','Gap (px)',16,0,48),
            $this->number('radius','Radius (px)',12,0,32),
        ];
    }
    public function render(array $s): void {
        $items=$s['items']??[];$cols=$s['columns']??'3';$uid='scb-pg-'.uniqid();$r=intval($s['radius']??12);$gap=intval($s['gap']??16);
        $grid=['2'=>'grid-cols-2','3'=>'grid-cols-3','4'=>'grid-cols-4'][$cols]??'grid-cols-3';
        // Collect categories
        $cats=array_unique(array_filter(array_column($items,'category')));
        if(!empty($s['filterable'])&&$cats){
            echo "<div class=\"scb-pg-filters make-flex flex-wrap gap-8 add-margin-bottom-24\">";
            echo '<button class="make-button style-primary size-small shape-pill scb-pg-filter active" data-cat="all">All</button>';
            foreach($cats as $cat) echo '<button class="make-button style-outline size-small shape-pill scb-pg-filter" data-cat="'.esc_attr($cat).'">'.esc_html(ucfirst($cat)).'</button>';
            echo '</div>';
        }
        echo "<div class=\"scb-gallery make-grid {$grid}\" id=\"{$uid}\" style=\"gap:{$gap}px;\">";
        foreach($items as $it){
            $img=esc_url($it['image']['url']??'');$title=esc_html($it['title']??'');$cat=esc_attr($it['category']??'');$lnk=esc_url($it['link']??'#');
            echo "<div class=\"scb-pg-item\" data-cat=\"{$cat}\" style=\"border-radius:{$r}px;overflow:hidden;position:relative;\">";
            $inner=$img?"<img src=\"{$img}\" alt=\"{$title}\" style=\"width:100%;height:220px;object-fit:cover;display:block;\">":"<div style=\"height:220px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;\">🖼️</div>";
            echo "<a href=\"{$lnk}\">{$inner}<div style=\"position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .2s;display:flex;align-items:center;justify-content:center;\" onmouseover=\"this.style.background='rgba(0,0,0,.5)'\" onmouseout=\"this.style.background='rgba(0,0,0,0)'\"><span style=\"color:#fff;font-weight:600;font-size:15px;opacity:0;transition:opacity .2s;\" onmouseover=\"this.style.opacity=1\" onmouseout=\"this.style.opacity=0\">{$title}</span></div></a>";
            echo '</div>';
        }
        echo '</div>';
        echo "<script>(function(){document.querySelectorAll('.scb-pg-filter').forEach(function(btn){btn.addEventListener('click',function(){document.querySelectorAll('.scb-pg-filter').forEach(function(b){b.className=b.className.replace('style-primary','style-outline');});this.className=this.className.replace('style-outline','style-primary');var cat=this.dataset.cat;document.querySelectorAll('#".$uid." .scb-pg-item').forEach(function(item){item.style.display=(cat==='all'||item.dataset.cat===cat)?'':'none';});});});})();</script>";
    }
}
