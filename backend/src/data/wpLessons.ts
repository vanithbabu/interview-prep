import type { TopicLesson, TopicLessonCodeExample } from './topicLessonsFeed.js';

function makeWpLesson(
  id: string,
  title: string,
  level: TopicLesson['level'],
  estimatedMinutes: number,
  coreQuestion: string,
  simpleHumanAnswer: string,
  realWorldExample: string,
  codeExamples: TopicLessonCodeExample[],
  interviewSpeakingAnswer: string,
  followUpQuestions: string[]
): TopicLesson {
  return {
    id,
    categoryId: 'wordpress',
    categoryName: 'WordPress',
    title,
    level,
    estimatedMinutes,
    coreQuestion,
    simpleHumanAnswer,
    realWorldExample,
    codeExamples,
    interviewSpeakingAnswer,
    followUpQuestions,
  };
}

export const WP_LESSONS: Record<string, TopicLesson> = {
  'wp-fundamentals': makeWpLesson(
    'wp-fundamentals',
    '1. WordPress Fundamentals',
    'beginner',
    25,
    'What is WordPress under the hood, and how do PHP and MySQL work together on every page load?',
    'WordPress is an open-source CMS written in PHP that stores content, settings, and users in MySQL. On every uncached request, PHP boots WordPress core, queries MySQL, runs active plugins and the theme, and outputs HTML.',
    'When a visitor opens `/blog/my-post`, Nginx/Apache routes the request to `index.php`, WordPress queries `wp_posts` in MySQL for that slug, and renders it through your theme template.',
    [
      {
        title: 'Example 1: The WordPress Loop in PHP',
        language: 'PHP',
        code: `<?php
if ( have_posts() ) :
  while ( have_posts() ) : the_post();
    echo '<h2>' . esc_html( get_the_title() ) . '</h2>';
  endwhile;
endif;`,
        expectedOutput: 'Renders escaped <h2> titles for each queried post.',
      },
      {
        title: 'Example 2: Checking WordPress Environment Type',
        language: 'PHP',
        code: `<?php
if ( function_exists( 'wp_get_environment_type' ) && wp_get_environment_type() === 'production' ) {
  // Enable strict caching headers
  header( 'Cache-Control: public, max-age=300' );
}`,
        expectedOutput: 'Applies production-only HTTP caching headers safely.',
      },
    ],
    'WordPress is a hook-driven PHP + MySQL CMS. Its strength is extensibility: core handles routing, auth, media, and database access, while themes control presentation and plugins add business logic without touching core files.',
    ['Why should you never edit WordPress core files?', 'How does WordPress handle requests before rendering HTML?']
  ),

  'wp-installation': makeWpLesson(
    'wp-installation',
    '2. Installation & Setup',
    'beginner',
    25,
    'What critical settings belong in `wp-config.php`, and how do you configure multi-environment setups?',
    '`wp-config.php` holds database credentials, security salts, table prefixes, and environment constants like `WP_DEBUG` and `WP_ENVIRONMENT_TYPE`. Keeping environment-specific secrets out of Git prevents credential leaks.',
    'In production, you set `WP_DEBUG` to `false`, `DISALLOW_FILE_EDIT` to `true` (blocking dashboard theme/plugin editing), and load DB passwords from environment variables.',
    [
      {
        title: 'Example 1: Hardening wp-config.php Constants',
        language: 'PHP',
        code: `<?php
define( 'WP_ENVIRONMENT_TYPE', getenv('WP_ENV') ?: 'production' );
define( 'DISALLOW_FILE_EDIT', true );
define( 'WP_POST_REVISIONS', 5 );
define( 'WP_MEMORY_LIMIT', '256M' );`,
        expectedOutput: 'Disables file editor, caps revisions at 5, and sets 256M memory.',
      },
      {
        title: 'Example 2: Custom Table Prefix & Debug Logging',
        language: 'PHP',
        code: `<?php
$table_prefix = 'app_';
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );`,
        expectedOutput: 'Logs PHP errors to wp-content/debug.log without exposing them to visitors.',
      },
    ],
    'I treat `wp-config.php` as environment config: I disable the admin file editor with `DISALLOW_FILE_EDIT`, set `WP_ENVIRONMENT_TYPE`, cap post revisions to avoid DB bloat, and keep `WP_DEBUG_DISPLAY` off in production.',
    ['Why is DISALLOW_FILE_EDIT important in production?', 'What happens if you change $table_prefix on an existing site?']
  ),

  'wp-architecture': makeWpLesson(
    'wp-architecture',
    '3. WordPress Architecture',
    'beginner',
    30,
    'What is the difference between `wp-admin`, `wp-includes`, and `wp-content`, and what is the WordPress request lifecycle?',
    '`wp-admin` powers the dashboard UI, `wp-includes` contains core PHP APIs and classes, and `wp-content` holds your themes, plugins, and uploads. Updates overwrite `wp-admin` and `wp-includes`, never `wp-content`.',
    'During a request, `index.php` loads `wp-load.php` -> `wp-config.php` -> `wp-settings.php`, loads mu-plugins, active plugins, fires `init`, parses the URL via `WP_Rewrite`, runs the main `WP_Query`, and loads the theme template.',
    [
      {
        title: 'Example 1: Hooking into Early Request Lifecycle',
        language: 'PHP',
        code: `<?php
// Fires after WordPress finishes loading core, plugins, and theme
add_action( 'init', function () {
  register_post_type( 'course', [ 'public' => true, 'label' => 'Courses' ] );
} );`,
        expectedOutput: 'Registers the Course CPT at the proper init lifecycle stage.',
      },
      {
        title: 'Example 2: Resolving Paths Safely in wp-content',
        language: 'PHP',
        code: `<?php
$plugin_dir = plugin_dir_path( __FILE__ );
$theme_uri  = get_stylesheet_directory_uri();
wp_enqueue_style( 'child-style', $theme_uri . '/assets/app.css', [], '1.0.0' );`,
        expectedOutput: 'Uses WordPress path helpers instead of hardcoded /wp-content/ paths.',
      },
    ],
    'WordPress separates core (`wp-admin`, `wp-includes`) from user code (`wp-content`). Understanding the boot order—`mu-plugins`, `plugins_loaded`, `after_setup_theme`, `init`, `wp`, `template_redirect`—is essential so hooks fire at the right time.',
    ['What is the difference between plugins_loaded and init?', 'What are Must-Use (mu-plugins) and when should you use them?']
  ),

  'wp-themes': makeWpLesson(
    'wp-themes',
    '4. Themes & Child Themes',
    'beginner',
    35,
    'Why do we use a Child Theme, and how do `get_template_directory()` and `get_stylesheet_directory()` differ?',
    'A Child Theme inherits all templates and styles from a Parent Theme while letting you safely override specific files or add `functions.php` code—so parent theme updates never erase your customizations.',
    '`get_template_directory()` always points to the Parent Theme folder, whereas `get_stylesheet_directory()` points to the active Child Theme folder.',
    [
      {
        title: 'Example 1: Child Theme style.css Header',
        language: 'CSS',
        code: `/*
 Theme Name:   Astra Child
 Template:     astra
 Version:      1.0.0
*/`,
        expectedOutput: 'Links the child theme to the parent theme folder "astra".',
      },
      {
        title: 'Example 2: Enqueuing Parent & Child Styles Properly',
        language: 'PHP',
        code: `<?php
add_action( 'wp_enqueue_scripts', function () {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
  wp_enqueue_style(
    'child-style',
    get_stylesheet_uri(),
    [ 'parent-style' ],
    wp_get_theme()->get( 'Version' )
  );
} );`,
        expectedOutput: 'Loads child CSS after parent CSS with cache-busting version.',
      },
    ],
    'We always customize third-party themes via a Child Theme so updates remain safe. I use `wp_enqueue_scripts` rather than `@import` for parallel CSS loading, and I use `get_stylesheet_directory()` for child assets.',
    ['Why is wp_enqueue_style preferred over @import in style.css?', 'When should code go into a plugin instead of functions.php?']
  ),

  'wp-template-hierarchy': makeWpLesson(
    'wp-template-hierarchy',
    '5. Template Hierarchy',
    'beginner',
    35,
    'How does the WordPress Template Hierarchy decide which PHP template file renders a URL?',
    'WordPress inspects the main query (single post, page, category, CPT, search, 404) and walks from the most specific filename down to `index.php` until it finds a match.',
    'For a custom post type `book` with slug `clean-code`, WordPress checks `single-book-clean-code.php` -> `single-book.php` -> `single.php` -> `singular.php` -> `index.php`.',
    [
      {
        title: 'Example 1: Overriding Template Selection via Filter',
        language: 'PHP',
        code: `<?php
add_filter( 'template_include', function ( string $template ): string {
  if ( is_singular( 'course' ) && isset( $_GET['print'] ) ) {
    $custom = locate_template( 'templates/course-print.php' );
    if ( $custom ) return $custom;
  }
  return $template;
} );`,
        expectedOutput: 'Loads course-print.php when ?print is passed on a Course page.',
      },
      {
        title: 'Example 2: Reusable Template Partials',
        language: 'PHP',
        code: `<?php
get_header();
while ( have_posts() ) : the_post();
  get_template_part( 'template-parts/content', get_post_type() );
endwhile;
get_footer();`,
        expectedOutput: 'Loads template-parts/content-{post_type}.php cleanly.',
      },
    ],
    'WordPress resolves templates from most specific to most generic, ending at `index.php`. Knowing this order—plus `template_include` and `get_template_part()`—keeps themes modular and DRY.',
    ['What is the fallback if single-product.php does not exist?', 'How do Block Themes (FSE) change the Template Hierarchy?']
  ),

  'wp-shortcodes': makeWpLesson(
    'wp-shortcodes',
    '6. Shortcodes',
    'beginner',
    25,
    'How do you build a safe WordPress shortcode, and why must it `return` instead of `echo`?',
    'Shortcodes are registered with `add_shortcode()` and MUST return a string rather than echoing directly—if you echo inside a shortcode, the output renders at the top of the post before the content.',
    'When building `[pricing_card plan="pro"]`, you merge defaults with `shortcode_atts()`, capture HTML with `ob_start()` / `ob_get_clean()`, escape every attribute, and return the string.',
    [
      {
        title: 'Example 1: Safe Shortcode with Output Buffering',
        language: 'PHP',
        code: `<?php
add_shortcode( 'cta_badge', function ( $atts, $content = '' ): string {
  $atts = shortcode_atts( [ 'color' => 'blue', 'label' => 'Learn More' ], $atts, 'cta_badge' );
  ob_start(); ?>
  <span class="badge badge-<?php echo esc_attr( $atts['color'] ); ?>">
    <?php echo esc_html( $atts['label'] ); ?>
  </span>
  <?php
  return ob_get_clean();
} );`,
        expectedOutput: 'Returns escaped HTML string in the exact spot of the shortcode.',
      },
      {
        title: 'Example 2: Conditional Script Loading in Shortcode',
        language: 'PHP',
        code: `<?php
add_shortcode( 'chart_widget', function (): string {
  wp_enqueue_script( 'my-chart-js' );
  return '<div class="chart-mount"></div>';
} );`,
        expectedOutput: 'Loads chart JS only on pages that actually render the shortcode.',
      },
    ],
    'Shortcodes must always return HTML, never echo it—using `ob_start()` and `ob_get_clean()` keeps HTML readable while returning a clean string. I also escape attributes with `esc_attr()` and use `shortcode_atts()` for defaults.',
    ['What happens if a shortcode echoes instead of returning?', 'When should you build a Gutenberg block instead of a shortcode?']
  ),

  'wp-plugins': makeWpLesson(
    'wp-plugins',
    '7. Plugin Development',
    'intermediate',
    40,
    'How do you structure a production WordPress plugin cleanly, and how do activation vs uninstall hooks work?',
    'A clean plugin uses a unique prefix/namespace, a proper plugin header, OOP or modular files, `register_activation_hook` for one-time setup (like flushing rewrites), and `uninstall.php` for cleanup when deleted.',
    'If your plugin registers a Custom Post Type, you flush rewrite rules once on activation—never on every `init` request, which would hurt performance.',
    [
      {
        title: 'Example 1: Plugin Header & Security Guard',
        language: 'PHP',
        code: `<?php
/**
 * Plugin Name: Acme Course Manager
 * Version: 1.0.0
 * Requires PHP: 8.1
 */
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Prevent direct file access
}`,
        expectedOutput: 'Blocks direct HTTP access to the plugin PHP file.',
      },
      {
        title: 'Example 2: Activation Hook Flushing Rewrites Once',
        language: 'PHP',
        code: `<?php
register_activation_hook( __FILE__, function () {
  acme_register_course_cpt();
  flush_rewrite_rules();
} );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );`,
        expectedOutput: 'Updates permalink rules only on plugin activation/deactivation.',
      },
    ],
    'I keep business logic in plugins rather than themes, guard every file with `defined("ABSPATH")`, namespace classes with Composer PSR-4, and run setup tasks only on activation rather than every page load.',
    ['What is the difference between deactivation and uninstall hooks?', 'Why should you never call flush_rewrite_rules() on init?']
  ),

  'wp-architecture-hooks': makeWpLesson(
    'wp-architecture-hooks',
    '8. Hooks Overview',
    'intermediate',
    30,
    'How does WordPress’s event-driven Hook system work with priorities and accepted arguments?',
    'Hooks let plugins and themes tap into WordPress execution at specific moments without editing core. Priorities (default `10`) control execution order, and the 4th parameter specifies how many arguments your callback accepts.',
    'If two plugins filter `the_content`, priority `5` runs before priority `20`. If a hook passes 3 arguments (`$post_id, $post, $update`), you must pass `3` as the 4th arg to `add_action()` to receive them all.',
    [
      {
        title: 'Example 1: Hook Priority & Multiple Arguments',
        language: 'PHP',
        code: `<?php
add_action( 'save_post', function ( int $post_id, WP_Post $post, bool $update ) {
  if ( wp_is_post_autosave( $post_id ) || ! $update ) return;
  update_post_meta( $post_id, '_last_edited_by', get_current_user_id() );
}, 10, 3 );`,
        expectedOutput: 'Receives all 3 arguments from save_post safely.',
      },
      {
        title: 'Example 2: Creating Your Own Extensible Hook',
        language: 'PHP',
        code: `<?php
$price = apply_filters( 'acme_course_price', $base_price, $course_id );
do_action( 'acme_after_enrollment', $user_id, $course_id );`,
        expectedOutput: 'Allows third-party code to modify price or react to enrollment.',
      },
    ],
    'WordPress is built on an event-driven Observer pattern via hooks. Understanding priority ordering and the accepted-arguments count prevents subtle bugs where callbacks silently miss parameters.',
    ['What happens if you omit the 4th argument when a hook passes 3 parameters?', 'How do you inspect which callbacks are attached to a hook?']
  ),

  'wp-actions-filters': makeWpLesson(
    'wp-actions-filters',
    '9. Actions & Filters',
    'intermediate',
    35,
    'What is the exact difference between Actions and Filters, and how do you safely remove a hook?',
    'Actions (`do_action` / `add_action`) execute side effects at a lifecycle point and return nothing. Filters (`apply_filters` / `add_filter`) receive a value, transform it, and MUST return a value—forgetting `return` blanks out the data.',
    'To remove a parent theme or plugin hook with `remove_action()`, you must match the exact hook name, callback, and priority—and call it after the original `add_action()` has run (e.g., on `init` or `wp_loaded`).',
    [
      {
        title: 'Example 1: Filter Always Returns Modified Value',
        language: 'PHP',
        code: `<?php
add_filter( 'excerpt_length', function ( int $length ): int {
  return is_front_page() ? 20 : $length;
}, 20 );`,
        expectedOutput: 'Shortens excerpts on the front page while preserving default elsewhere.',
      },
      {
        title: 'Example 2: Removing a Hook with Matching Priority',
        language: 'PHP',
        code: `<?php
add_action( 'wp_loaded', function () {
  remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
} );`,
        expectedOutput: 'Removes WooCommerce breadcrumbs by matching priority 20.',
      },
    ],
    'Actions perform work (send email, enqueue scripts); filters transform and return data. The two biggest gotchas are forgetting to `return` in a filter and calling `remove_action()` with a mismatched priority or before the hook was added.',
    ['Why is it hard to remove an anonymous closure hook?', 'What happens if a filter callback forgets to return a value?']
  ),

  'wp-cpt': makeWpLesson(
    'wp-cpt',
    '10. Custom Post Types',
    'intermediate',
    35,
    'How do you register a Custom Post Type with Gutenberg & REST API support, and avoid 404 permalink issues?',
    'You register a CPT on `init` using `register_post_type()`. Setting `show_in_rest => true` enables both the Gutenberg Block Editor and `/wp-json/wp/v2/{cpt}` endpoints. Always flush permalinks once after registering.',
    'For a Job Board, you register a `job` CPT with `has_archive => true`, `rewrite => ["slug" => "jobs"]`, and `supports => ["title", "editor", "thumbnail"]`.',
    [
      {
        title: 'Example 1: Registering a Modern CPT with REST & Gutenberg',
        language: 'PHP',
        code: `<?php
add_action( 'init', function () {
  register_post_type( 'job', [
    'label'        => 'Jobs',
    'public'       => true,
    'has_archive'  => true,
    'show_in_rest' => true,
    'rewrite'      => [ 'slug' => 'jobs' ],
    'supports'     => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
  ] );
} );`,
        expectedOutput: 'Creates /jobs/ archive and /wp-json/wp/v2/job REST route.',
      },
      {
        title: 'Example 2: Including CPT in Main Archive or Search',
        language: 'PHP',
        code: `<?php
add_action( 'pre_get_posts', function ( WP_Query $query ) {
  if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
    $query->set( 'post_type', [ 'post', 'job' ] );
  }
} );`,
        expectedOutput: 'Includes Jobs in site search results without extra SQL queries.',
      },
    ],
    'I register CPTs on `init` with `show_in_rest => true` for Gutenberg and REST support, and flush rewrite rules only on plugin activation. To include CPTs in search or main loops, I modify the main query via `pre_get_posts`.',
    ['Why does a newly registered CPT return 404 until permalinks are saved?', 'What does show_in_rest => true control?']
  ),

  'wp-taxonomies': makeWpLesson(
    'wp-taxonomies',
    '11. Custom Taxonomies',
    'intermediate',
    30,
    'When should you use a Custom Taxonomy vs Post Meta (Custom Fields) in WordPress?',
    'Use a Custom Taxonomy whenever you need to group, filter, or build archive URLs (like `/department/engineering/`), because taxonomy tables are indexed for fast queries. Use Post Meta for unique values per post (like salary or SKU).',
    'In an e-commerce or job site, "Job Location" and "Department" belong in Taxonomies (`hierarchical => true` like categories, or `false` like tags), while "Salary" or "Application Deadline" belong in Post Meta.',
    [
      {
        title: 'Example 1: Registering a Hierarchical Custom Taxonomy',
        language: 'PHP',
        code: `<?php
add_action( 'init', function () {
  register_taxonomy( 'department', [ 'job' ], [
    'label'        => 'Departments',
    'hierarchical' => true,
    'show_in_rest' => true,
    'rewrite'      => [ 'slug' => 'department' ],
  ] );
} );`,
        expectedOutput: 'Adds checkbox-style Departments taxonomy to Jobs with /department/ URLs.',
      },
      {
        title: 'Example 2: Querying Posts by Taxonomy Term',
        language: 'PHP',
        code: `<?php
$jobs = new WP_Query( [
  'post_type' => 'job',
  'tax_query' => [ [
    'taxonomy' => 'department',
    'field'    => 'slug',
    'terms'    => 'engineering',
  ] ],
] );`,
        expectedOutput: 'Fetches engineering jobs efficiently using indexed term tables.',
      },
    ],
    'Taxonomies are designed for grouping and filtering with indexed `wp_term_relationships` tables, whereas `wp_postmeta` is an unindexed key-value store that slows down `WHERE` filtering at scale.',
    ['Why is tax_query faster than meta_query for filtering?', 'What is the difference between hierarchical => true and false?']
  ),

  'wp-custom-fields': makeWpLesson(
    'wp-custom-fields',
    '12. Custom Fields & Meta',
    'intermediate',
    35,
    'How do you safely save and retrieve Custom Meta Box data in WordPress?',
    'Saving a meta box on `save_post` requires 4 security/safety checks: verify the nonce, ignore `DOING_AUTOSAVE`, check `current_user_can("edit_post", $post_id)`, and sanitize the input before calling `update_post_meta()`.',
    'If you skip the autosave check or nonce check, WordPress autosaves can wipe out your meta fields or leave your site open to CSRF attacks.',
    [
      {
        title: 'Example 1: Secure save_post Meta Handler',
        language: 'PHP',
        code: `<?php
add_action( 'save_post_job', function ( int $post_id ) {
  if ( ! isset( $_POST['job_nonce'] ) || ! wp_verify_nonce( $_POST['job_nonce'], 'save_job_meta' ) ) return;
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
  if ( ! current_user_can( 'edit_post', $post_id ) ) return;

  $salary = isset( $_POST['job_salary'] ) ? sanitize_text_field( wp_unslash( $_POST['job_salary'] ) ) : '';
  update_post_meta( $post_id, '_job_salary', $salary );
} );`,
        expectedOutput: 'Verifies nonce, autosave, capability, and sanitizes before saving.',
      },
      {
        title: 'Example 2: Prefixing Private Meta Keys & Registering for REST',
        language: 'PHP',
        code: `<?php
register_post_meta( 'job', '_job_salary', [
  'type'          => 'string',
  'single'        => true,
  'show_in_rest'  => true,
  'auth_callback' => fn() => current_user_can( 'edit_posts' ),
] );`,
        expectedOutput: 'Hides key from default Custom Fields UI while exposing it to REST/Gutenberg.',
      },
    ],
    'On `save_post`, I always verify the nonce, bail on `DOING_AUTOSAVE`, check `current_user_can("edit_post", $post_id)`, and `wp_unslash()` + `sanitize_*()` before saving. Prefixing keys with `_` hides them from the raw Custom Fields UI.',
    ['Why do we call wp_unslash() before sanitizing $_POST in WordPress?', 'What does the third parameter $single = true do in get_post_meta()?']
  ),

  'wp-acf': makeWpLesson(
    'wp-acf',
    '13. Advanced Custom Fields (ACF)',
    'intermediate',
    40,
    'What is ACF Local JSON, and how do you avoid N+1 / slow queries when using ACF Repeaters?',
    'ACF Local JSON saves field group definitions as `.json` files inside your theme (`acf-json/`), allowing Git version control and faster loading without DB queries. Repeaters store multiple `wp_postmeta` rows, so always escape `get_field()` output and avoid querying repeaters inside large loops.',
    'When two developers add fields on staging and local, ACF Local JSON lets you commit `group_123.json` in Git and click "Sync available" on staging instead of manually recreating fields.',
    [
      {
        title: 'Example 1: Safe ACF Field & Repeater Rendering',
        language: 'PHP',
        code: `<?php
$subtitle = get_field( 'hero_subtitle' );
if ( $subtitle ) {
  echo '<p>' . esc_html( $subtitle ) . '</p>';
}
if ( have_rows( 'features' ) ) :
  while ( have_rows( 'features' ) ) : the_row();
    echo '<li>' . esc_html( get_sub_field( 'title' ) ) . '</li>';
  endwhile;
endif;`,
        expectedOutput: 'Safely checks and escapes ACF scalar and repeater fields.',
      },
      {
        title: 'Example 2: Registering ACF JSON Save/Load Path in Plugin',
        language: 'PHP',
        code: `<?php
add_filter( 'acf/settings/save_json', fn() => plugin_dir_path( __FILE__ ) . 'acf-json' );
add_filter( 'acf/settings/load_json', function ( array $paths ): array {
  $paths[] = plugin_dir_path( __FILE__ ) . 'acf-json';
  return $paths;
} );`,
        expectedOutput: 'Version-controls ACF field groups inside your plugin repository.',
      },
    ],
    'I always enable ACF Local JSON so field schemas live in Git rather than just the database, escape every `get_field()` / `get_sub_field()` output, and avoid `meta_query` filters on repeater subfields at scale.',
    ['How do ACF Blocks differ from standard React Gutenberg blocks?', 'Why can querying repeater subfields in WP_Query be slow?']
  ),

  'wp-gutenberg': makeWpLesson(
    'wp-gutenberg',
    '14. Gutenberg Blocks',
    'advanced',
    45,
    'What is the difference between a Static Block and a Dynamic Block in Gutenberg?',
    'A Static Block saves its final HTML directly into `post_content` via `save()`, making it fast to render—but changing the markup later causes block validation errors. A Dynamic Block returns `null` from `save()` and renders fresh HTML on the server via `render.php` or `render_callback`.',
    'For a "Latest Posts" or "Live Price" block, you use a Dynamic Block so the HTML updates automatically whenever new posts or prices change without re-saving old pages.',
    [
      {
        title: 'Example 1: block.json Metadata Definition',
        language: 'JSON',
        code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "acme/alert-banner",
  "title": "Alert Banner",
  "category": "design",
  "attributes": { "message": { "type": "string", "default": "" } },
  "render": "file:./render.php"
}`,
        expectedOutput: 'Registers a modern API v3 dynamic Gutenberg block.',
      },
      {
        title: 'Example 2: Server-Side Block render.php',
        language: 'PHP',
        code: `<?php
$message = $attributes['message'] ?? '';
?>
<div <?php echo get_block_wrapper_attributes( [ 'class' => 'acme-alert' ] ); ?>>
  <?php echo esc_html( $message ); ?>
</div>`,
        expectedOutput: 'Renders dynamic block HTML with Gutenberg wrapper attributes.',
      },
    ],
    'I use `block.json` (API v3) with `@wordpress/scripts` for all custom blocks. I choose Static blocks for fixed layout content and Dynamic blocks (`render.php`) whenever data changes over time or markup may evolve.',
    ['What causes the "Attempt Block Recovery" validation error in Gutenberg?', 'Why is block.json recommended over JS-only registerBlockType?']
  ),

  'wp-data-rest': makeWpLesson(
    'wp-data-rest',
    '15. WP_Query',
    'advanced',
    40,
    'How do you write a performant `WP_Query`, and when should you use `pre_get_posts` instead?',
    'Use `pre_get_posts` to alter the main archive/search query before SQL runs; use a custom `new WP_Query()` for secondary loops (like related posts) and always call `wp_reset_postdata()` afterward.',
    'For a "Related Articles" widget that does not need pagination, setting `no_found_rows => true` skips `SQL_CALC_FOUND_ROWS`, cutting query time noticeably on large tables.',
    [
      {
        title: 'Example 1: Optimized Secondary WP_Query Loop',
        language: 'PHP',
        code: `<?php
$q = new WP_Query( [
  'post_type'              => 'post',
  'posts_per_page'         => 5,
  'no_found_rows'          => true,
  'update_post_meta_cache' => false,
] );
while ( $q->have_posts() ) : $q->the_post();
  the_title();
endwhile;
wp_reset_postdata();`,
        expectedOutput: 'Fetches 5 posts without counting total rows or priming meta cache.',
      },
      {
        title: 'Example 2: Modifying Main Loop with pre_get_posts',
        language: 'PHP',
        code: `<?php
add_action( 'pre_get_posts', function ( WP_Query $query ) {
  if ( ! is_admin() && $query->is_main_query() && $query->is_home() ) {
    $query->set( 'posts_per_page', 12 );
  }
} );`,
        expectedOutput: 'Changes homepage post count without running a second query.',
      },
    ],
    'I never use `query_posts()`. For the main loop I hook `pre_get_posts` with `is_main_query()` and `!is_admin()`; for secondary loops I use `new WP_Query()` with `no_found_rows => true` when unpaginated and finish with `wp_reset_postdata()`.',
    ['Why should you never use query_posts()?', 'What does wp_reset_postdata() do vs wp_reset_query()?']
  ),

  'wp-rest-api': makeWpLesson(
    'wp-rest-api',
    '16. WP REST API',
    'advanced',
    45,
    'How do you register a secure custom WP REST API endpoint with validation and permissions?',
    'Register routes on `rest_api_init` via `register_rest_route()`. Every route MUST define `permission_callback` (use `__return_true` only for intentionally public read endpoints) and `args` with `validate_callback` / `sanitize_callback`.',
    'If you omit `permission_callback`, WordPress triggers a `_doing_it_wrong` notice because an unprotected POST/DELETE route would be wide open.',
    [
      {
        title: 'Example 1: Secure Custom REST Endpoint',
        language: 'PHP',
        code: `<?php
add_action( 'rest_api_init', function () {
  register_rest_route( 'acme/v1', '/courses/(?P<id>\\d+)', [
    'methods'             => 'GET',
    'permission_callback' => '__return_true',
    'args'                => [
      'id' => [ 'validate_callback' => fn( $v ) => is_numeric( $v ) ],
    ],
    'callback'            => function ( WP_REST_Request $req ) {
      $post = get_post( (int) $req['id'] );
      return $post ? rest_ensure_response( [ 'title' => $post->post_title ] )
                   : new WP_Error( 'not_found', 'Course not found', [ 'status' => 404 ] );
    },
  ] );
} );`,
        expectedOutput: 'Exposes GET /wp-json/acme/v1/courses/42 with validation and 404 handling.',
      },
      {
        title: 'Example 2: Protected Write Endpoint with Capability Check',
        language: 'PHP',
        code: `<?php
register_rest_route( 'acme/v1', '/courses', [
  'methods'             => 'POST',
  'permission_callback' => fn() => current_user_can( 'edit_posts' ),
  'callback'            => fn( WP_REST_Request $r ) => rest_ensure_response( [ 'created' => true ] ),
] );`,
        expectedOutput: 'Rejects unauthenticated or low-privilege callers with 401/403.',
      },
    ],
    'I register custom endpoints on `rest_api_init` with `register_rest_route()`, enforce capabilities in `permission_callback`, sanitize/validate parameters in `args`, and return `WP_Error` or `rest_ensure_response()`.',
    ['Why is permission_callback required on every REST route?', 'How does cookie auth with X-WP-Nonce work in the REST API?']
  ),

  'wp-database': makeWpLesson(
    'wp-database',
    '17. Database Structure',
    'advanced',
    35,
    'What are WordPress’s core tables, and why does `wp_options` autoload bloat slow down every page load?',
    'WordPress centers around `wp_posts` (posts, pages, CPTs, attachments), `wp_postmeta` (EAV key-value metadata), `wp_terms`/`wp_term_taxonomy`/`wp_term_relationships`, `wp_users`/`wp_usermeta`, and `wp_options`. Every option with `autoload = "yes"` is loaded into memory on EVERY request.',
    'If a plugin saves 5 MB of logs into `wp_options` with `autoload = "yes"`, every single HTTP request—even 404s and AJAX—fetches and unserializes 5 MB before rendering.',
    [
      {
        title: 'Example 1: Disabling Autoload for Large Non-Global Options',
        language: 'PHP',
        code: `<?php
// Pass false (or 'no') as 3rd/4th arg so large data is only loaded when requested
update_option( 'acme_import_report', $large_array, false );`,
        expectedOutput: 'Prevents large option data from loading on every page request.',
      },
      {
        title: 'Example 2: Finding Top Autoloaded Options in SQL',
        language: 'SQL',
        code: `SELECT option_name, LENGTH(option_value) AS size_bytes
FROM wp_options
WHERE autoload IN ('yes', 'on')
ORDER BY size_bytes DESC
LIMIT 10;`,
        expectedOutput: 'Lists the 10 largest autoloaded rows slowing down site boot.',
      },
    ],
    'Understanding `wp_posts` + `wp_postmeta` (EAV pattern) and `wp_options` autoloading is key to WordPress performance. I keep `autoload` off for large or admin-only options and avoid heavy `meta_query` joins on large tables.',
    ['Why does wp_postmeta use the Entity-Attribute-Value (EAV) pattern, and what is its downside?', 'What is stored in wp_posts besides blog posts?']
  ),

  'wp-wpdb': makeWpLesson(
    'wp-wpdb',
    '18. $wpdb & Prepared SQL',
    'advanced',
    35,
    'How do you run custom SQL safely in WordPress using `$wpdb->prepare()`?',
    'Never concatenate user input into SQL strings. Always pass placeholders (`%d` for int, `%f` for float, `%s` for string, `%i` for identifiers in WP 6.2+) to `$wpdb->prepare()`, and use `$wpdb->prefix` for table names.',
    'If you write `"WHERE user_email = \'$email\'"`, an attacker can inject SQL. `$wpdb->prepare("WHERE user_email = %s", $email)` safely quotes and escapes the value.',
    [
      {
        title: 'Example 1: Safe Parameterized Query with $wpdb->prepare()',
        language: 'PHP',
        code: `<?php
global $wpdb;
$table = $wpdb->prefix . 'enrollments';
$rows = $wpdb->get_results(
  $wpdb->prepare(
    "SELECT course_id, status FROM {$table} WHERE user_id = %d AND status = %s",
    $user_id,
    'active'
  )
);`,
        expectedOutput: 'Safely queries custom table using %d and %s placeholders.',
      },
      {
        title: 'Example 2: Safe Insert with Explicit Formats',
        language: 'PHP',
        code: `<?php
global $wpdb;
$wpdb->insert(
  $wpdb->prefix . 'enrollments',
  [ 'user_id' => $user_id, 'course_id' => $course_id, 'status' => 'active' ],
  [ '%d', '%d', '%s' ]
);`,
        expectedOutput: 'Inserts a row using prepared parameter bindings.',
      },
    ],
    'Whenever `WP_Query` isn’t enough, I use `$wpdb->prepare()` with `%d`, `%s`, `%f`, or `%i` (table/column identifiers in WP 6.2+) and `$wpdb->prefix`—never raw variable interpolation in SQL.',
    ['What is the difference between $wpdb->get_results, get_row, and get_var?', 'How do you safely handle IN (...) clauses with $wpdb->prepare()?']
  ),

  'wp-roles': makeWpLesson(
    'wp-roles',
    '19. User Roles & Capabilities',
    'advanced',
    30,
    'Why should you check `current_user_can(capability)` instead of checking user roles directly?',
    'Roles (Editor, Author, Subscriber) are just named bundles of granular capabilities (`edit_posts`, `publish_posts`, `manage_options`). Checking a capability works reliably even if an admin customizes role permissions or adds custom roles.',
    'Checking `current_user_can("manage_options")` or `current_user_can("edit_post", $post_id)` enforces exact permission—whereas checking `in_array("administrator", $user->roles)` breaks for custom admin-like roles.',
    [
      {
        title: 'Example 1: Capability Check Before Admin Action',
        language: 'PHP',
        code: `<?php
if ( ! current_user_can( 'manage_options' ) ) {
  wp_die( esc_html__( 'Unauthorized access.', 'acme' ), 403 );
}`,
        expectedOutput: 'Blocks non-privileged users with HTTP 403.',
      },
      {
        title: 'Example 2: Adding a Custom Role on Plugin Activation',
        language: 'PHP',
        code: `<?php
add_role( 'course_instructor', 'Course Instructor', [
  'read'         => true,
  'edit_courses' => true,
] );`,
        expectedOutput: 'Creates a least-privilege role persisted in wp_options.',
      },
    ],
    'WordPress authorization is capability-based. I always check specific capabilities like `current_user_can("edit_post", $id)` rather than role names, and I register custom roles only on plugin activation since `add_role()` writes to the DB.',
    ['Why should add_role() never run on every init request?', 'What is the difference between primitive and meta capabilities (e.g. edit_posts vs edit_post)?']
  ),

  'wp-auth': makeWpLesson(
    'wp-auth',
    '20. Authentication',
    'advanced',
    35,
    'How does WordPress authentication differ between classic themes, AJAX, and headless apps?',
    'Classic themes and admin AJAX use logged-in HTTP-only cookies paired with a CSRF nonce (`X-WP-Nonce` or `check_ajax_referer`). Headless external clients (mobile apps, Node/Next.js servers) use Application Passwords (built into WP 5.6+) or JWT/OAuth.',
    'If a Next.js backend fetches draft posts from WordPress, it sends an `Authorization: Basic base64(user:app_password)` header over HTTPS instead of browser cookies.',
    [
      {
        title: 'Example 1: Verifying Nonce & Auth in AJAX Handler',
        language: 'PHP',
        code: `<?php
add_action( 'wp_ajax_acme_bookmark', function () {
  check_ajax_referer( 'acme_bookmark_nonce', 'nonce' );
  if ( ! is_user_logged_in() ) {
    wp_send_json_error( [ 'message' => 'Login required' ], 401 );
  }
  wp_send_json_success( [ 'saved' => true ] );
} );`,
        expectedOutput: 'Validates CSRF nonce and logged-in session for AJAX.',
      },
      {
        title: 'Example 2: Calling WP REST API with Application Password',
        language: 'TypeScript',
        code: `const auth = Buffer.from(\`\${wpUser}:\${wpAppPassword}\`).toString('base64');
const res = await fetch('https://cms.example.com/wp-json/wp/v2/posts?status=draft', {
  headers: { Authorization: \`Basic \${auth}\` },
});`,
        expectedOutput: 'Authenticates server-to-server REST calls using built-in Application Passwords.',
      },
    ],
    'For browser-based logged-in requests I pair WordPress auth cookies with `wp_create_nonce` / `X-WP-Nonce` for CSRF protection. For decoupled servers or mobile apps, I use built-in Application Passwords over HTTPS or JWT.',
    ['What is the difference between wp_ajax_ and wp_ajax_nopriv_?', 'Why are nonces alone not enough without capability checks?']
  ),

  'wp-woocommerce': makeWpLesson(
    'wp-woocommerce',
    '21. WooCommerce Basics',
    'expert',
    40,
    'What is WooCommerce HPOS (High-Performance Order Storage), and why should you use CRUD classes instead of `get_post_meta()`?',
    'Historically WooCommerce stored orders in `wp_posts` and `wp_postmeta`, which caused table bloat. HPOS moves orders into dedicated `wp_wc_orders` tables. Using `wc_get_order()` and `$order->get_meta()` works seamlessly on both legacy and HPOS stores.',
    'Calling `get_post_meta($order_id, "_billing_email", true)` breaks when HPOS is enabled, whereas `$order = wc_get_order($order_id); $order->get_billing_email();` works everywhere and is much faster.',
    [
      {
        title: 'Example 1: HPOS-Compatible Order Meta Access',
        language: 'PHP',
        code: `<?php
$order = wc_get_order( $order_id );
if ( $order ) {
  $order->update_meta_data( '_erp_synced', 'yes' );
  $order->save();
}`,
        expectedOutput: 'Updates order meta safely on both HPOS and legacy post storage.',
      },
      {
        title: 'Example 2: Reacting to Completed Payment',
        language: 'PHP',
        code: `<?php
add_action( 'woocommerce_order_status_completed', function ( int $order_id ) {
  $order = wc_get_order( $order_id );
  // Trigger fulfillment or license key generation
} );`,
        expectedOutput: 'Runs fulfillment logic once an order reaches completed status.',
      },
    ],
    'I always use WooCommerce CRUD methods (`wc_get_order`, `wc_get_product`, `$order->get_meta()`, `$order->save()`) instead of `get_post_meta()` so plugins stay HPOS-compatible and benefit from indexed order tables.',
    ['Why did WooCommerce introduce HPOS?', 'How do you declare HPOS compatibility in a custom WooCommerce plugin?']
  ),

  'wp-woocommerce-custom': makeWpLesson(
    'wp-woocommerce-custom',
    '22. Custom WooCommerce Dev',
    'expert',
    45,
    'How do you add custom checkout fields, dynamic fees, and template overrides safely in WooCommerce?',
    'Use WooCommerce action/filter hooks (`woocommerce_checkout_fields`, `woocommerce_cart_calculate_fees`) for logic and copy only the specific template file into `your-theme/woocommerce/` for markup changes.',
    'To add a $5 gift-wrap fee when a checkbox is ticked, you hook `woocommerce_cart_calculate_fees` and call `WC()->cart->add_fee("Gift Wrap", 5)` rather than hacking core templates.',
    [
      {
        title: 'Example 1: Saving Custom Checkout Field to Order (HPOS-Safe)',
        language: 'PHP',
        code: `<?php
add_action( 'woocommerce_checkout_create_order', function ( WC_Order $order, array $data ) {
  if ( ! empty( $_POST['delivery_note'] ) ) {
    $order->update_meta_data( '_delivery_note', sanitize_textarea_field( wp_unslash( $_POST['delivery_note'] ) ) );
  }
}, 10, 2 );`,
        expectedOutput: 'Persists custom checkout input onto the order object before save.',
      },
      {
        title: 'Example 2: Adding a Conditional Cart Fee',
        language: 'PHP',
        code: `<?php
add_action( 'woocommerce_cart_calculate_fees', function ( WC_Cart $cart ) {
  if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;
  if ( $cart->get_subtotal() < 50 ) {
    $cart->add_fee( 'Small Order Handling', 4.99 );
  }
} );`,
        expectedOutput: 'Applies a $4.99 fee when cart subtotal is under $50.',
      },
    ],
    'In WooCommerce customization, I prefer hooks over template overrides so theme updates stay clean. When overriding a template, I copy only the minimal file into `theme/woocommerce/` and watch WooCommerce template version notices.',
    ['Why should you avoid overriding entire WooCommerce templates when a hook exists?', 'How do WooCommerce Checkout Blocks change checkout customization?']
  ),

  'wp-cron': makeWpLesson(
    'wp-cron',
    '23. Cron Jobs & Action Scheduler',
    'expert',
    35,
    'Why is default `WP-Cron` unreliable in production, and how do you fix it?',
    'Default WP-Cron is pseudo-cron triggered only when a visitor hits the site. Low-traffic sites miss scheduled tasks, while high-traffic sites risk slow page loads or race conditions. Fix it by setting `DISABLE_WP_CRON` to `true` and running a real Linux cron every minute, or using Action Scheduler for heavy queues.',
    'For sending 5,000 WooCommerce renewal emails, Action Scheduler processes small batches asynchronously with retries and logging instead of timing out a single PHP request.',
    [
      {
        title: 'Example 1: Disabling Pseudo-Cron & Running Real System Cron',
        language: 'PHP',
        code: `<?php
// In wp-config.php:
define( 'DISABLE_WP_CRON', true );

// In server crontab:
// * * * * * cd /var/www/html && wp cron event run --due-now >/dev/null 2>&1`,
        expectedOutput: 'Moves cron execution off visitor requests onto reliable system cron.',
      },
      {
        title: 'Example 2: Scheduling a Custom Recurring Event',
        language: 'PHP',
        code: `<?php
if ( ! wp_next_scheduled( 'acme_daily_sync' ) ) {
  wp_schedule_event( time(), 'daily', 'acme_daily_sync' );
}
add_action( 'acme_daily_sync', 'acme_run_inventory_sync' );`,
        expectedOutput: 'Registers a single daily job without duplicating schedules.',
      },
    ],
    'Default WP-Cron depends on HTTP traffic, so I disable it via `DISABLE_WP_CRON` and trigger `wp cron event run --due-now` from system cron. For large background batches, I use Action Scheduler so jobs survive PHP timeouts.',
    ['What happens if you call wp_schedule_event() without checking wp_next_scheduled()?', 'When is Action Scheduler better than wp_schedule_single_event()?']
  ),

  'wp-caching': makeWpLesson(
    'wp-caching',
    '24. Caching',
    'expert',
    40,
    'What are the caching layers in WordPress (Page Cache, Object Cache, Transients), and when do you use each?',
    'Full-Page Cache (Nginx FastCGI / Cloudflare) serves static HTML to anonymous visitors without booting PHP. Persistent Object Cache (Redis/Memcached) caches `WP_Query` and `wp_options` results in RAM. Transients store expensive API/query results with an expiration TTL.',
    'If you call an external weather API in a widget, cache the response with `set_transient("acme_weather", $data, HOUR_IN_SECONDS)` so you do not block page loads on every visitor.',
    [
      {
        title: 'Example 1: Caching Expensive Data with Transients API',
        language: 'PHP',
        code: `<?php
$stats = get_transient( 'acme_dashboard_stats' );
if ( false === $stats ) {
  $stats = acme_compute_expensive_stats();
  set_transient( 'acme_dashboard_stats', $stats, 15 * MINUTE_IN_SECONDS );
}
return $stats;`,
        expectedOutput: 'Computes stats at most once every 15 minutes (stored in Redis if enabled).',
      },
      {
        title: 'Example 2: Object Cache (wp_cache_get / set)',
        language: 'PHP',
        code: `<?php
$key = 'user_courses_' . $user_id;
$courses = wp_cache_get( $key, 'acme' );
if ( false === $courses ) {
  $courses = acme_fetch_user_courses( $user_id );
  wp_cache_set( $key, $courses, 'acme', 600 );
} `,
        expectedOutput: 'Caches per-user data in Redis object cache for 10 minutes.',
      },
    ],
    'I combine CDN/Nginx full-page caching for anonymous traffic with Redis persistent object caching for logged-in/admin/WooCommerce queries, and use Transients for external API responses.',
    ['Where are Transients stored if no persistent Object Cache (Redis) is installed?', 'Why can full-page caching break WooCommerce cart or user-specific widgets?']
  ),

  'wp-performance': makeWpLesson(
    'wp-performance',
    '25. Performance Optimization',
    'expert',
    40,
    'How do you diagnose and fix a slow WordPress site in production?',
    'Start by measuring with Query Monitor (slow SQL queries, duplicate queries, HTTP API calls, bloated hooks). Then fix the root causes: trim `wp_options` autoload bloat, add Redis object cache, eliminate N+1 `meta_query` loops, and defer non-critical JS/CSS.',
    'A site taking 3 seconds TTFB often has an external `wp_remote_get()` running synchronously on `init`, or 8 MB of autoloaded data in `wp_options`.',
    [
      {
        title: 'Example 1: Deferring Non-Critical Scripts in WP 6.3+',
        language: 'PHP',
        code: `<?php
wp_enqueue_script(
  'acme-analytics',
  get_stylesheet_directory_uri() . '/assets/analytics.js',
  [],
  '1.0.0',
  [ 'in_footer' => true, 'strategy' => 'defer' ]
);`,
        expectedOutput: 'Loads script with defer attribute without blocking HTML parsing.',
      },
      {
        title: 'Example 2: Setting Timeouts on External HTTP Calls',
        language: 'PHP',
        code: `<?php
$res = wp_remote_get( 'https://api.example.com/feed', [ 'timeout' => 3 ] );
if ( is_wp_error( $res ) ) {
  return []; // Fail fast instead of hanging PHP workers
}`,
        expectedOutput: 'Prevents slow third-party APIs from exhausting PHP-FPM workers.',
      },
    ],
    'My performance checklist: profile TTFB with Query Monitor, audit `wp_options` autoload size, enable OPcache + Redis, avoid `posts_per_page => -1` unbounded queries, and use WP 6.3+ `strategy => "defer"` for scripts.',
    ['Why is posts_per_page => -1 dangerous in production?', 'How does Query Monitor help pinpoint a slow plugin?']
  ),

  'wp-security': makeWpLesson(
    'wp-security',
    '26. WordPress Security',
    'expert',
    45,
    'Explain the WordPress Security Triad: Sanitization, Validation, Escaping, plus Nonces.',
    'Sanitize on input (`sanitize_text_field`, `absint`) to clean data before saving. Validate to reject invalid shapes/types. Escape late on output (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`) to prevent XSS. Use Nonces (`wp_nonce_field` / `wp_verify_nonce`) + `current_user_can()` to stop CSRF and privilege escalation.',
    'Remember the rule: "Sanitize early, escape late." Even data from the database should be escaped right before `echo` because a compromised admin or plugin could have stored malicious HTML.',
    [
      {
        title: 'Example 1: Escaping Contexts Properly',
        language: 'PHP',
        code: `<?php
$url   = get_permalink();
$title = get_the_title();
?>
<a href="<?php echo esc_url( $url ); ?>" title="<?php echo esc_attr( $title ); ?>">
  <?php echo esc_html( $title ); ?>
</a>`,
        expectedOutput: 'Applies context-specific escaping for URL, attribute, and HTML body.',
      },
      {
        title: 'Example 2: Allowing Safe HTML with wp_kses_post()',
        language: 'PHP',
        code: `<?php
$bio = wp_kses_post( wp_unslash( $_POST['author_bio'] ?? '' ) );
update_user_meta( $user_id, 'description', $bio );`,
        expectedOutput: 'Strips <script> tags while keeping safe formatting like <strong> and <a>.',
      },
    ],
    'I follow "sanitize early, validate strictly, escape late." Every form/AJAX/REST endpoint checks both a nonce (CSRF) and a capability (`current_user_can`), and all SQL goes through `$wpdb->prepare()`.',
    ['What is the difference between esc_html() and esc_attr()?', 'Why is a WordPress nonce not a substitute for current_user_can()?']
  ),

  'wp-debugging': makeWpLesson(
    'wp-debugging',
    '27. Debugging',
    'expert',
    30,
    'How do you debug PHP errors, white screens (WSOD), and slow queries in WordPress?',
    'Enable `WP_DEBUG`, `WP_DEBUG_LOG`, and keep `WP_DEBUG_DISPLAY` false so errors write to `wp-content/debug.log` without breaking JSON/AJAX or leaking paths. Use Query Monitor for SQL/hooks/REST inspection and `SAVEQUERIES` in local dev.',
    'When a REST endpoint returns invalid JSON, it is often because `WP_DEBUG_DISPLAY` printed a PHP deprecation notice before the JSON payload.',
    [
      {
        title: 'Example 1: Safe Structured Debug Logging',
        language: 'PHP',
        code: `<?php
if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
  error_log( '[ACME] Sync payload: ' . wp_json_encode( $payload ) );
}`,
        expectedOutput: 'Writes structured JSON context to debug.log only when WP_DEBUG is active.',
      },
      {
        title: 'Example 2: Checking WordPress Error Objects',
        language: 'PHP',
        code: `<?php
$result = wp_insert_post( $args, true );
if ( is_wp_error( $result ) ) {
  error_log( $result->get_error_message() );
}`,
        expectedOutput: 'Passes $wp_error = true so wp_insert_post returns detailed WP_Error.',
      },
    ],
    'I always set `WP_DEBUG_DISPLAY` to `false` and inspect `debug.log` + Query Monitor. For functions like `wp_insert_post`, passing `true` as the second argument returns a `WP_Error` instead of silently returning `0`.',
    ['Why does WP_DEBUG_DISPLAY = true break AJAX or REST API responses?', 'How do you inspect all SQL queries executed on a page?']
  ),

  'wp-deployment': makeWpLesson(
    'wp-deployment',
    '28. Deployment & CI/CD',
    'expert',
    35,
    'How do you manage WordPress deployments, Composer dependencies, and database migrations across environments?',
    'Modern WordPress teams use Bedrock/Composer to manage core and plugins in Git (without committing vendor/core), WP-CLI (`wp search-replace`) for URL-safe DB migrations (handling PHP serialized arrays!), and CI/CD pipelines to build assets and deploy atomically.',
    'Running raw SQL `REPLACE()` on a WordPress database corrupts serialized widget/ACF/theme options because string byte lengths (`s:14:"..."`) mismatch. `wp search-replace` deserializes and re-serializes safely.',
    [
      {
        title: 'Example 1: Serialized-Safe URL Migration with WP-CLI',
        language: 'Bash',
        code: `wp db export backup.sql
wp search-replace 'https://staging.example.com' 'https://example.com' --all-tables --dry-run
wp search-replace 'https://staging.example.com' 'https://example.com' --all-tables`,
        expectedOutput: 'Updates URLs across all tables without breaking serialized PHP arrays.',
      },
      {
        title: 'Example 2: Zero-Downtime Cache Flush on Deploy',
        language: 'Bash',
        code: `composer install --no-dev --optimize-autoloader
wp cache flush
wp rewrite flush`,
        expectedOutput: 'Installs production PHP deps and refreshes object/rewrite caches.',
      },
    ],
    'I keep WordPress core and third-party plugins out of Git via Composer/Bedrock, never run raw SQL `REPLACE()` on serialized data—always `wp search-replace`—and automate builds + `wp cache flush` in CI/CD.',
    ['Why does raw SQL REPLACE() corrupt WordPress options and ACF data?', 'What are the benefits of Bedrock over a standard WordPress folder layout?']
  ),

  'wp-woocommerce-headless': makeWpLesson(
    'wp-woocommerce-headless',
    '29. Headless WordPress & React',
    'expert',
    45,
    'How do you architect Headless WordPress with Next.js, and how do you keep content fresh without slow SSR?',
    'WordPress acts as the editorial CMS exposing content via WPGraphQL or WP REST API, while Next.js renders the frontend using Static Generation + On-Demand ISR (`revalidateTag` / `revalidatePath`) triggered by a WordPress `save_post` webhook.',
    'When an editor publishes an article in WordPress, `save_post` fires a signed `POST` webhook to `/api/revalidate` on Next.js, refreshing only that article’s cached page within 1 second.',
    [
      {
        title: 'Example 1: Triggering Next.js Revalidation on WordPress Save',
        language: 'PHP',
        code: `<?php
add_action( 'save_post', function ( int $post_id, WP_Post $post ) {
  if ( wp_is_post_revision( $post_id ) || $post->post_status !== 'publish' ) return;
  wp_remote_post( 'https://frontend.example.com/api/revalidate', [
    'blocking' => false,
    'headers'  => [ 'x-webhook-secret' => NEXT_REVALIDATE_SECRET ],
    'body'     => [ 'slug' => $post->post_name ],
  ] );
}, 10, 2 );`,
        expectedOutput: 'Non-blocking webhook refreshes Next.js ISR cache immediately on publish.',
      },
      {
        title: 'Example 2: Fetching WP REST Content in Next.js Server Component',
        language: 'TypeScript',
        code: `const res = await fetch('https://cms.example.com/wp-json/wp/v2/posts?_embed', {
  next: { tags: ['wp-posts'], revalidate: 3600 },
});
const posts = await res.json();`,
        expectedOutput: 'Caches WordPress posts in Next.js with tag-based invalidation.',
      },
    ],
    'Headless WordPress shines when paired with Next.js On-Demand ISR: WordPress sends a non-blocking `save_post` webhook with a shared secret to `/api/revalidate`, giving editors instant updates with static CDN speed.',
    ['When is Headless WordPress overkill compared to a classic/block theme?', 'How do you handle Gutenberg previews in a decoupled Next.js frontend?']
  ),

  'wp-senior-scenarios': makeWpLesson(
    'wp-senior-scenarios',
    '30. Advanced Interview Scenarios',
    'coding',
    50,
    'A WooCommerce site has 200k products and a `meta_query` filter takes 4 seconds. How do you fix it?',
    'Multiple `meta_query` clauses create expensive `INNER JOIN`s on the unindexed `wp_postmeta.meta_value` `LONGTEXT` column. To fix it: convert filterable attributes (brand, color, size) into Taxonomies, enable Redis Object Cache, or store structured attributes in a custom indexed table / Elasticsearch.',
    'Replacing 3 `meta_query` joins with `tax_query` + Redis cuts query time from 4,000ms down to ~15ms because `wp_term_relationships` uses integer foreign keys with composite indexes.',
    [
      {
        title: 'Example 1: Replacing Slow meta_query with Indexed tax_query',
        language: 'PHP',
        code: `<?php
// Slow: meta_query joins unindexed LONGTEXT meta_value
// Fast: tax_query uses indexed term_taxonomy_id integers
$products = new WP_Query( [
  'post_type'      => 'product',
  'posts_per_page' => 24,
  'tax_query'      => [ [
    'taxonomy' => 'pa_brand',
    'field'    => 'slug',
    'terms'    => 'nike',
  ] ],
] );`,
        expectedOutput: 'Replaces unindexed meta JOINs with indexed taxonomy lookups.',
      },
      {
        title: 'Example 2: Securing & Rate-Limiting a Public AJAX Endpoint',
        language: 'PHP',
        code: `<?php
add_action( 'wp_ajax_nopriv_acme_lead', function () {
  check_ajax_referer( 'acme_lead_nonce', 'nonce' );
  $ip_key = 'lead_rl_' . md5( $_SERVER['REMOTE_ADDR'] ?? '' );
  if ( get_transient( $ip_key ) ) {
    wp_send_json_error( [ 'message' => 'Too many requests' ], 429 );
  }
  set_transient( $ip_key, 1, 30 );
  $email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
  if ( ! is_email( $email ) ) wp_send_json_error( [ 'message' => 'Invalid email' ], 400 );
  wp_send_json_success( [ 'saved' => true ] );
} );`,
        expectedOutput: 'Combines nonce verification, transient rate limiting, and email validation.',
      },
    ],
    'For slow `meta_query` filters at scale, I move filterable attributes into Taxonomies or custom indexed tables, add Redis object cache, and enable HPOS for WooCommerce orders.',
    ['How do you prevent race conditions when two requests update the same wp_option?', 'How do you scale WordPress media uploads across multiple web servers?']
  ),
};
