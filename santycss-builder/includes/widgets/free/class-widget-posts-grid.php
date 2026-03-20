<?php namespace SCB\Widgets\Free; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Posts_Grid extends Widget_Base {
    public function get_type(): string     { return 'posts-grid'; }
    public function get_title(): string    { return __('Posts Grid','santycss-builder'); }
    public function get_icon(): string     { return '📰'; }
    public function get_category(): string { return 'wordpress'; }
    public function get_controls(): array {
        return [
            $this->number('count','Number of Posts',6,1,50),
            $this->select('post_type','Post Type',['post'=>'Posts','page'=>'Pages'],'post'),
            $this->select('columns','Columns',['1'=>'1','2'=>'2','3'=>'3','4'=>'4'],'3'),
            $this->toggle('show_image','Show Featured Image',true),
            $this->toggle('show_excerpt','Show Excerpt',true),
            $this->toggle('show_date','Show Date',true),
            $this->toggle('show_author','Show Author',false),
            $this->select('order','Order',['DESC'=>'Newest First','ASC'=>'Oldest First'],'DESC'),
        ];
    }
    public function render(array $s): void {
        $args=['post_type'=>$s['post_type']??'post','posts_per_page'=>intval($s['count']??6),'orderby'=>'date','order'=>$s['order']??'DESC'];
        $q=new \WP_Query($args);$cols=$s['columns']??'3';
        $grid_cls=['1'=>'grid-cols-1','2'=>'grid-cols-2','3'=>'grid-cols-3','4'=>'grid-cols-4'][$cols]??'grid-cols-3';
        echo "<div class=\"scb-posts-grid make-grid {$grid_cls} gap-24\">";
        while($q->have_posts()){ $q->the_post();
            echo '<div class="card">';
            if(!empty($s['show_image'])&&has_post_thumbnail()) echo '<div class="overflow-hidden round-corners-12 add-margin-bottom-16">'.get_the_post_thumbnail(null,'medium','style=width:100%;height:200px;object-fit:cover;').'</div>';
            echo '<div class="add-padding-x-4">';
            if(!empty($s['show_date'])) echo '<div class="set-text-12 color-gray-400 add-margin-bottom-8">'.get_the_date().'</div>';
            echo '<h3 class="set-text-18 text-semibold color-gray-900 add-margin-bottom-8"><a href="'.get_permalink().'" style="text-decoration:none;color:inherit;">'.get_the_title().'</a></h3>';
            if(!empty($s['show_excerpt'])) echo '<p class="set-text-14 color-gray-500 line-height-relaxed add-margin-bottom-12">'.wp_trim_words(get_the_excerpt(),20).'</p>';
            echo '<a href="'.get_permalink().'" class="set-text-13 color-blue-600 text-semibold" style="text-decoration:none;">Read more →</a>';
            echo '</div></div>';
        }
        wp_reset_postdata();
        echo '</div>';
    }
}
