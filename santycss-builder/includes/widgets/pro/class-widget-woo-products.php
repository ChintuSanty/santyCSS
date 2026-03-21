<?php namespace SCB\Widgets\Pro; use SCB\Widgets\Widget_Base; defined('ABSPATH')||exit;
class Woo_Products extends Widget_Base {
    public function get_type(): string     { return 'woo-products'; }
    public function get_title(): string    { return __('WooCommerce Products','santycss-builder'); }
    public function get_icon(): string     { return '🛍️'; }
    public function get_category(): string { return 'woocommerce'; }
    public function get_tier(): string     { return 'free'; }
    public function get_controls(): array {
        return [
            $this->number('count','Number of Products',6,1,50),
            $this->select('columns','Columns',['2'=>'2','3'=>'3','4'=>'4'],'3'),
            $this->select('order','Order',['date'=>'Newest','popularity'=>'Popular','rating'=>'Top Rated','price'=>'Price (Low)','price-desc'=>'Price (High)'],'date'),
            $this->toggle('show_price','Show Price',true),
            $this->toggle('show_rating','Show Rating',true),
            $this->toggle('show_cart','Show Add to Cart',true),
            $this->text('category','Category Slug (optional)',''),
        ];
    }
    public function render(array $s): void {
        if(!class_exists('WooCommerce')){ echo '<div class="alert alert-warning">WooCommerce is not active.</div>'; return; }
        $args=['post_type'=>'product','posts_per_page'=>intval($s['count']??6),'orderby'=>$s['order']??'date'];
        if(!empty($s['category'])) $args['tax_query']=[['taxonomy'=>'product_cat','field'=>'slug','terms'=>$s['category']]];
        $q=new \WP_Query($args);
        $cols=$s['columns']??'3';
        $grid=['2'=>'grid-cols-2','3'=>'grid-cols-3','4'=>'grid-cols-4'][$cols]??'grid-cols-3';
        echo "<div class=\"scb-woo-products make-grid {$grid} gap-24\">";
        while($q->have_posts()){$q->the_post();$product=wc_get_product(get_the_ID());
            echo '<div class="card">';
            echo '<a href="'.get_permalink().'" style="text-decoration:none;display:block;">';
            if(has_post_thumbnail()) echo '<div style="overflow:hidden;border-radius:10px;margin-bottom:16px;">'.get_the_post_thumbnail(null,'medium','style=width:100%;height:200px;object-fit:cover;').'</div>';
            echo '<h3 class="set-text-16 text-semibold color-gray-900 add-margin-bottom-8">'.get_the_title().'</h3>';
            if(!empty($s['show_price'])) echo '<div class="set-text-18 text-bold color-blue-600 add-margin-bottom-8">'.$product->get_price_html().'</div>';
            if(!empty($s['show_rating'])) echo '<div style="color:#f59e0b;font-size:14px;">'.str_repeat('★',round($product->get_average_rating())).'</div>';
            echo '</a>';
            if(!empty($s['show_cart'])) echo '<a href="'.esc_url($product->add_to_cart_url()).'" class="make-button style-primary shape-rounded set-width-full justify-center add-margin-top-16">Add to Cart</a>';
            echo '</div>';
        }
        wp_reset_postdata();
        echo '</div>';
    }
}
