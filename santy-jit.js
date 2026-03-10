/**
 * SantyCSS JIT — Runtime class generation engine
 *
 * Drop this script instead of (or alongside) santy.css.
 * Watches the DOM, generates only the CSS classes actually used.
 * Supports arbitrary values: add-padding-137, set-text-19, add-border-7 ...
 *
 * Usage:
 *   <script src="santy-jit.js"></script>
 *
 * Or as ES module:
 *   import './santy-jit.js'
 *
 * Config (optional, before the script):
 *   <script>
 *     window.SantyJIT = {
 *       safelist: ['make-hidden', 'animate-spin'],  // always generate
 *       nonce: 'abc123',                            // CSP nonce
 *     };
 *   </script>
 */
(function (root) {
  'use strict';

  // ─── Color Palette ──────────────────────────────────────────────────────────
  var P = {
    red:    {50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d'},
    orange: {50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12'},
    amber:  {50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f'},
    yellow: {50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12'},
    lime:   {50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314'},
    green:  {50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d'},
    teal:   {50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a'},
    cyan:   {50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63'},
    blue:   {50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'},
    indigo: {50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81'},
    violet: {50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95'},
    purple: {50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87'},
    pink:   {50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843'},
    rose:   {50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337'},
    slate:  {50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a'},
    gray:   {50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'},
    zinc:   {50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b'},
    stone:  {50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917'},
  };
  var NC = { white:'#fff', black:'#000', transparent:'transparent', current:'currentColor' };

  function color(name, shade) {
    if (NC[name]) return NC[name];
    return P[name] && P[name][shade] ? P[name][shade] : null;
  }

  // ─── Static (named) class lookup ────────────────────────────────────────────
  var STATIC = {
    // Display
    'make-block':'display:block','make-inline':'display:inline','make-inline-block':'display:inline-block',
    'make-flex':'display:flex','make-inline-flex':'display:inline-flex','make-grid':'display:grid',
    'make-inline-grid':'display:inline-grid','make-table':'display:table','make-hidden':'display:none',
    'make-contents':'display:contents',
    // Visibility
    'make-visible':'visibility:visible','make-invisible':'visibility:hidden','make-collapse':'visibility:collapse',
    // Flex direction
    'flex-row':'flex-direction:row','flex-row-reverse':'flex-direction:row-reverse',
    'flex-column':'flex-direction:column','flex-column-reverse':'flex-direction:column-reverse',
    // Flex wrap
    'flex-wrap':'flex-wrap:wrap','flex-wrap-reverse':'flex-wrap:wrap-reverse','flex-nowrap':'flex-wrap:nowrap',
    // Flex grow/shrink
    'flex-grow':'flex-grow:1','flex-grow-none':'flex-grow:0','flex-shrink':'flex-shrink:1',
    'flex-shrink-none':'flex-shrink:0','flex-auto':'flex:1 1 auto','flex-initial':'flex:0 1 auto',
    'flex-none':'flex:none','flex-equal':'flex:1',
    // Align items
    'align-start':'align-items:flex-start','align-end':'align-items:flex-end',
    'align-center':'align-items:center','align-stretch':'align-items:stretch','align-baseline':'align-items:baseline',
    // Align self
    'self-start':'align-self:flex-start','self-end':'align-self:flex-end','self-center':'align-self:center',
    'self-stretch':'align-self:stretch','self-baseline':'align-self:baseline','self-auto':'align-self:auto',
    // Align content
    'content-start':'align-content:flex-start','content-end':'align-content:flex-end',
    'content-center':'align-content:center','content-stretch':'align-content:stretch',
    'content-between':'align-content:space-between','content-around':'align-content:space-around',
    'content-evenly':'align-content:space-evenly',
    // Justify
    'justify-start':'justify-content:flex-start','justify-end':'justify-content:flex-end',
    'justify-center':'justify-content:center','justify-between':'justify-content:space-between',
    'justify-around':'justify-content:space-around','justify-evenly':'justify-content:space-evenly',
    'justify-items-start':'justify-items:start','justify-items-end':'justify-items:end',
    'justify-items-center':'justify-items:center','justify-items-stretch':'justify-items:stretch',
    'justify-self-start':'justify-self:start','justify-self-end':'justify-self:end',
    'justify-self-center':'justify-self:center','justify-self-stretch':'justify-self:stretch',
    'justify-self-auto':'justify-self:auto',
    'place-center':'place-items:center;place-content:center',
    'place-stretch':'place-items:stretch',
    // Order
    'order-first':'order:-9999','order-last':'order:9999','order-none':'order:0',
    // Grid cols/rows
    'grid-cols-none':'grid-template-columns:none',
    'grid-flow-row':'grid-auto-flow:row','grid-flow-col':'grid-auto-flow:column','grid-flow-dense':'grid-auto-flow:dense',
    'span-col-full':'grid-column:1 / -1','span-row-full':'grid-row:1 / -1',
    // Margin auto
    'center-margin':'margin:0 auto','add-margin-auto':'margin:auto',
    'add-margin-top-auto':'margin-top:auto','add-margin-bottom-auto':'margin-bottom:auto',
    'add-margin-left-auto':'margin-left:auto','add-margin-right-auto':'margin-right:auto',
    'add-margin-x-auto':'margin-left:auto;margin-right:auto',
    'add-margin-y-auto':'margin-top:auto;margin-bottom:auto',
    // Border styles
    'border-solid':'border-style:solid','border-dashed':'border-style:dashed',
    'border-dotted':'border-style:dotted','border-double':'border-style:double',
    'border-hidden':'border-style:hidden','border-none':'border-style:none',
    // Border radius named
    'make-circle':'border-radius:50%','make-pill':'border-radius:9999px',
    // Sizing special
    'set-width-full':'width:100%','set-width-screen':'width:100vw','set-width-auto':'width:auto',
    'set-width-min':'width:min-content','set-width-max':'width:max-content','set-width-fit':'width:fit-content',
    'set-height-full':'height:100%','set-height-screen':'height:100vh','set-height-auto':'height:auto',
    'set-height-min':'height:min-content','set-height-max':'height:max-content','set-height-fit':'height:fit-content',
    'min-width-full':'min-width:100%','max-width-full':'max-width:100%',
    'min-width-screen':'min-width:100vw','max-width-screen':'max-width:100vw',
    'min-width-none':'min-width:0','max-width-none':'max-width:none',
    'min-height-full':'min-height:100%','max-height-full':'max-height:100%',
    'min-height-screen':'min-height:100vh','max-height-screen':'max-height:100vh',
    // Position
    'position-static':'position:static','position-relative':'position:relative',
    'position-absolute':'position:absolute','position-fixed':'position:fixed','position-sticky':'position:sticky',
    'pin-center':'top:50%;left:50%;transform:translate(-50%,-50%)',
    'pin-center-x':'left:50%;transform:translateX(-50%)',
    'pin-center-y':'top:50%;transform:translateY(-50%)',
    'pin-top-full':'top:100%','pin-bottom-full':'bottom:100%',
    'pin-left-full':'left:100%','pin-right-full':'right:100%',
    'pin-top-auto':'top:auto','pin-bottom-auto':'bottom:auto',
    'pin-left-auto':'left:auto','pin-right-auto':'right:auto',
    // Overflow
    'overflow-auto':'overflow:auto','overflow-hidden':'overflow:hidden','overflow-scroll':'overflow:scroll',
    'overflow-visible':'overflow:visible','overflow-clip':'overflow:clip',
    'overflow-x-auto':'overflow-x:auto','overflow-x-hidden':'overflow-x:hidden',
    'overflow-x-scroll':'overflow-x:scroll','overflow-x-visible':'overflow-x:visible',
    'overflow-y-auto':'overflow-y:auto','overflow-y-hidden':'overflow-y:hidden',
    'overflow-y-scroll':'overflow-y:scroll','overflow-y-visible':'overflow-y:visible',
    // Z-index auto
    'layer-auto':'z-index:auto',
    // Text
    'text-thin':'font-weight:100','text-extra-light':'font-weight:200','text-light':'font-weight:300',
    'text-normal':'font-weight:400','text-medium':'font-weight:500','text-semibold':'font-weight:600',
    'text-bold':'font-weight:700','text-extra-bold':'font-weight:800','text-black-weight':'font-weight:900',
    'text-italic':'font-style:italic','text-not-italic':'font-style:normal',
    'font-sans':"font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    'font-serif':"font-family:ui-serif,Georgia,Cambria,'Times New Roman',Times,serif",
    'font-mono':"font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace",
    'text-left':'text-align:left','text-center':'text-align:center','text-right':'text-align:right',
    'text-justify':'text-align:justify','text-start':'text-align:start','text-end':'text-align:end',
    'text-underline':'text-decoration:underline','text-overline':'text-decoration:overline',
    'text-strikethrough':'text-decoration:line-through','text-no-decoration':'text-decoration:none',
    'text-uppercase':'text-transform:uppercase','text-lowercase':'text-transform:lowercase',
    'text-capitalize':'text-transform:capitalize','text-no-transform':'text-transform:none',
    'text-truncate':'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
    'text-clip':'text-overflow:clip','text-ellipsis':'text-overflow:ellipsis',
    'text-wrap':'white-space:normal','text-nowrap':'white-space:nowrap',
    'text-pre':'white-space:pre','text-pre-wrap':'white-space:pre-wrap','text-pre-line':'white-space:pre-line',
    'text-break-word':'word-break:break-word;overflow-wrap:break-word','text-break-all':'word-break:break-all',
    'line-height-none':'line-height:1','line-height-tight':'line-height:1.25',
    'line-height-snug':'line-height:1.375','line-height-normal':'line-height:1.5',
    'line-height-relaxed':'line-height:1.625','line-height-loose':'line-height:2',
    'letter-space-tight':'letter-spacing:-0.05em','letter-space-snug':'letter-spacing:-0.025em',
    'letter-space-normal':'letter-spacing:0em','letter-space-wide':'letter-spacing:0.025em',
    'letter-space-wider':'letter-spacing:0.05em','letter-space-widest':'letter-spacing:0.1em',
    // Transforms
    'flip-horizontal':'transform:scaleX(-1)','flip-vertical':'transform:scaleY(-1)',
    'rotate-45':'transform:rotate(45deg)','rotate-90':'transform:rotate(90deg)',
    'rotate-135':'transform:rotate(135deg)','rotate-180':'transform:rotate(180deg)',
    'rotate-270':'transform:rotate(270deg)','rotate-minus-45':'transform:rotate(-45deg)',
    'rotate-minus-90':'transform:rotate(-90deg)',
    'scale-75':'transform:scale(0.75)','scale-90':'transform:scale(0.90)',
    'scale-95':'transform:scale(0.95)','scale-100':'transform:scale(1)',
    'scale-105':'transform:scale(1.05)','scale-110':'transform:scale(1.10)',
    'scale-125':'transform:scale(1.25)','scale-150':'transform:scale(1.50)',
    'skew-x-3':'transform:skewX(3deg)','skew-x-6':'transform:skewX(6deg)','skew-x-12':'transform:skewX(12deg)',
    'skew-y-3':'transform:skewY(3deg)','skew-y-6':'transform:skewY(6deg)','skew-y-12':'transform:skewY(12deg)',
    // Transitions
    'transition-fast':'transition:all 0.15s ease','transition-normal':'transition:all 0.3s ease',
    'transition-slow':'transition:all 0.5s ease','transition-none':'transition:none',
    'transition-colors':'transition:color 0.3s ease,background-color 0.3s ease,border-color 0.3s ease',
    'transition-opacity':'transition:opacity 0.3s ease','transition-transform':'transition:transform 0.3s ease',
    // Animations
    // Core animations
    'animate-spin':'animation:santy-spin 1s linear infinite',
    'animate-ping':'animation:santy-ping 1s cubic-bezier(0,0,.2,1) infinite',
    'animate-pulse':'animation:santy-pulse 2s cubic-bezier(.4,0,.6,1) infinite',
    'animate-bounce':'animation:santy-bounce 1s infinite',
    // Attention seekers
    'animate-flash':'animation:santy-flash 1s ease both',
    'animate-rubber-band':'animation:santy-rubber-band 1s ease both',
    'animate-shake-x':'animation:santy-shake-x 1s ease both',
    'animate-shake-y':'animation:santy-shake-y 1s ease both',
    'animate-shake-head':'animation:santy-shake-head 1s ease-in-out both',
    'animate-swing':'animation:santy-swing 1s ease both;transform-origin:top center',
    'animate-tada':'animation:santy-tada 1s ease both',
    'animate-wobble':'animation:santy-wobble 1s ease both',
    'animate-jelly':'animation:santy-jelly 1s ease both',
    'animate-heartbeat':'animation:santy-heartbeat 1.3s ease-in-out both',
    // Fade in
    'animate-fade-in':'animation:santy-fade-in 0.5s ease both',
    'animate-fade-in-from-top':'animation:santy-fade-in-from-top 0.5s ease both',
    'animate-fade-in-from-bottom':'animation:santy-fade-in-from-bottom 0.5s ease both',
    'animate-fade-in-from-left':'animation:santy-fade-in-from-left 0.5s ease both',
    'animate-fade-in-from-right':'animation:santy-fade-in-from-right 0.5s ease both',
    'animate-fade-in-top-left':'animation:santy-fade-in-top-left 0.5s ease both',
    'animate-fade-in-top-right':'animation:santy-fade-in-top-right 0.5s ease both',
    'animate-fade-in-bottom-left':'animation:santy-fade-in-bottom-left 0.5s ease both',
    'animate-fade-in-bottom-right':'animation:santy-fade-in-bottom-right 0.5s ease both',
    // Fade out
    'animate-fade-out':'animation:santy-fade-out 0.5s ease both',
    'animate-fade-out-to-top':'animation:santy-fade-out-to-top 0.5s ease both',
    'animate-fade-out-to-bottom':'animation:santy-fade-out-to-bottom 0.5s ease both',
    'animate-fade-out-to-left':'animation:santy-fade-out-to-left 0.5s ease both',
    'animate-fade-out-to-right':'animation:santy-fade-out-to-right 0.5s ease both',
    'animate-fade-out-top-left':'animation:santy-fade-out-top-left 0.5s ease both',
    'animate-fade-out-top-right':'animation:santy-fade-out-top-right 0.5s ease both',
    'animate-fade-out-bottom-left':'animation:santy-fade-out-bottom-left 0.5s ease both',
    'animate-fade-out-bottom-right':'animation:santy-fade-out-bottom-right 0.5s ease both',
    // Bounce in
    'animate-bounce-in':'animation:santy-bounce-in 0.75s ease both',
    'animate-bounce-in-from-top':'animation:santy-bounce-in-from-top 0.75s ease both',
    'animate-bounce-in-from-bottom':'animation:santy-bounce-in-from-bottom 0.75s ease both',
    'animate-bounce-in-from-left':'animation:santy-bounce-in-from-left 0.75s ease both',
    'animate-bounce-in-from-right':'animation:santy-bounce-in-from-right 0.75s ease both',
    // Bounce out
    'animate-bounce-out':'animation:santy-bounce-out 0.75s ease both',
    'animate-bounce-out-to-top':'animation:santy-bounce-out-to-top 0.75s ease both',
    'animate-bounce-out-to-bottom':'animation:santy-bounce-out-to-bottom 0.75s ease both',
    'animate-bounce-out-to-left':'animation:santy-bounce-out-to-left 0.75s ease both',
    'animate-bounce-out-to-right':'animation:santy-bounce-out-to-right 0.75s ease both',
    // Slide in
    'animate-slide-in-from-top':'animation:santy-slide-in-from-top 0.4s ease both',
    'animate-slide-in-from-bottom':'animation:santy-slide-in-from-bottom 0.4s ease both',
    'animate-slide-in-from-left':'animation:santy-slide-in-from-left 0.4s ease both',
    'animate-slide-in-from-right':'animation:santy-slide-in-from-right 0.4s ease both',
    // Slide out
    'animate-slide-out-to-top':'animation:santy-slide-out-to-top 0.4s ease both',
    'animate-slide-out-to-bottom':'animation:santy-slide-out-to-bottom 0.4s ease both',
    'animate-slide-out-to-left':'animation:santy-slide-out-to-left 0.4s ease both',
    'animate-slide-out-to-right':'animation:santy-slide-out-to-right 0.4s ease both',
    // Zoom in
    'animate-zoom-in':'animation:santy-zoom-in 0.3s ease both',
    'animate-zoom-in-from-top':'animation:santy-zoom-in-from-top 0.5s ease both',
    'animate-zoom-in-from-bottom':'animation:santy-zoom-in-from-bottom 0.5s ease both',
    'animate-zoom-in-from-left':'animation:santy-zoom-in-from-left 0.5s ease both',
    'animate-zoom-in-from-right':'animation:santy-zoom-in-from-right 0.5s ease both',
    // Zoom out
    'animate-zoom-out':'animation:santy-zoom-out 0.3s ease both',
    'animate-zoom-out-to-top':'animation:santy-zoom-out-to-top 0.5s ease both',
    'animate-zoom-out-to-bottom':'animation:santy-zoom-out-to-bottom 0.5s ease both',
    'animate-zoom-out-to-left':'animation:santy-zoom-out-to-left 0.5s ease both',
    'animate-zoom-out-to-right':'animation:santy-zoom-out-to-right 0.5s ease both',
    // Flip
    'animate-flip':'animation:santy-flip 1s ease both;backface-visibility:visible',
    'animate-flip-in-x':'animation:santy-flip-in-x 0.75s ease both;backface-visibility:visible',
    'animate-flip-in-y':'animation:santy-flip-in-y 0.75s ease both;backface-visibility:visible',
    'animate-flip-out-x':'animation:santy-flip-out-x 0.75s ease both;backface-visibility:visible',
    'animate-flip-out-y':'animation:santy-flip-out-y 0.75s ease both;backface-visibility:visible',
    // Rotate in
    'animate-rotate-in':'animation:santy-rotate-in 0.6s ease both',
    'animate-rotate-in-from-top-left':'animation:santy-rotate-in-from-top-left 0.6s ease both;transform-origin:left top',
    'animate-rotate-in-from-top-right':'animation:santy-rotate-in-from-top-right 0.6s ease both;transform-origin:right top',
    'animate-rotate-in-from-bottom-left':'animation:santy-rotate-in-from-bottom-left 0.6s ease both;transform-origin:left bottom',
    'animate-rotate-in-from-bottom-right':'animation:santy-rotate-in-from-bottom-right 0.6s ease both;transform-origin:right bottom',
    // Rotate out
    'animate-rotate-out':'animation:santy-rotate-out 0.6s ease both',
    'animate-rotate-out-to-top-left':'animation:santy-rotate-out-to-top-left 0.6s ease both;transform-origin:left top',
    'animate-rotate-out-to-top-right':'animation:santy-rotate-out-to-top-right 0.6s ease both;transform-origin:right top',
    'animate-rotate-out-to-bottom-left':'animation:santy-rotate-out-to-bottom-left 0.6s ease both;transform-origin:left bottom',
    'animate-rotate-out-to-bottom-right':'animation:santy-rotate-out-to-bottom-right 0.6s ease both;transform-origin:right bottom',
    // Back in
    'animate-back-in-from-top':'animation:santy-back-in-from-top 0.7s ease both',
    'animate-back-in-from-bottom':'animation:santy-back-in-from-bottom 0.7s ease both',
    'animate-back-in-from-left':'animation:santy-back-in-from-left 0.7s ease both',
    'animate-back-in-from-right':'animation:santy-back-in-from-right 0.7s ease both',
    // Back out
    'animate-back-out-to-top':'animation:santy-back-out-to-top 0.7s ease both',
    'animate-back-out-to-bottom':'animation:santy-back-out-to-bottom 0.7s ease both',
    'animate-back-out-to-left':'animation:santy-back-out-to-left 0.7s ease both',
    'animate-back-out-to-right':'animation:santy-back-out-to-right 0.7s ease both',
    // Light speed
    'animate-speed-in-from-left':'animation:santy-speed-in-from-left 0.5s ease-out both',
    'animate-speed-in-from-right':'animation:santy-speed-in-from-right 0.5s ease-out both',
    'animate-speed-out-to-left':'animation:santy-speed-out-to-left 0.5s ease-in both',
    'animate-speed-out-to-right':'animation:santy-speed-out-to-right 0.5s ease-in both',
    // Specials
    'animate-hinge':'animation:santy-hinge 2s ease both;transform-origin:top left',
    'animate-jack-in-box':'animation:santy-jack-in-box 1s ease both;transform-origin:center bottom',
    'animate-roll-in':'animation:santy-roll-in 0.6s ease both',
    'animate-roll-out':'animation:santy-roll-out 0.6s ease both',
    // Backwards compat aliases
    'animate-slide-up':'animation:santy-slide-in-from-bottom 0.4s ease both',
    'animate-slide-down':'animation:santy-slide-in-from-top 0.4s ease both',
    // Animation helpers
    'animation-speed-fastest':'animation-duration:0.3s',
    'animation-speed-fast':'animation-duration:0.5s',
    'animation-speed-normal':'animation-duration:1s',
    'animation-speed-slow':'animation-duration:1.5s',
    'animation-speed-slowest':'animation-duration:2s',
    'animation-speed-glacial':'animation-duration:3s',
    'animation-delay-100':'animation-delay:0.1s',
    'animation-delay-200':'animation-delay:0.2s',
    'animation-delay-300':'animation-delay:0.3s',
    'animation-delay-400':'animation-delay:0.4s',
    'animation-delay-500':'animation-delay:0.5s',
    'animation-delay-600':'animation-delay:0.6s',
    'animation-delay-700':'animation-delay:0.7s',
    'animation-delay-800':'animation-delay:0.8s',
    'animation-delay-900':'animation-delay:0.9s',
    'animation-delay-1000':'animation-delay:1s',
    'animation-delay-1500':'animation-delay:1.5s',
    'animation-delay-2000':'animation-delay:2s',
    'animation-delay-3000':'animation-delay:3s',
    'animation-loop-1':'animation-iteration-count:1',
    'animation-loop-2':'animation-iteration-count:2',
    'animation-loop-3':'animation-iteration-count:3',
    'animation-loop-4':'animation-iteration-count:4',
    'animation-loop-5':'animation-iteration-count:5',
    'animation-loop-forever':'animation-iteration-count:infinite',
    'animation-fill-none':'animation-fill-mode:none',
    'animation-fill-forwards':'animation-fill-mode:forwards',
    'animation-fill-backwards':'animation-fill-mode:backwards',
    'animation-fill-both':'animation-fill-mode:both',
    'animation-ease':'animation-timing-function:ease',
    'animation-ease-in':'animation-timing-function:ease-in',
    'animation-ease-out':'animation-timing-function:ease-out',
    'animation-ease-in-out':'animation-timing-function:ease-in-out',
    'animation-linear':'animation-timing-function:linear',
    'animation-running':'animation-play-state:running',
    'animation-paused':'animation-play-state:paused','animation-none':'animation:none',
    // Filters
    'blur-sm':'filter:blur(4px)','blur':'filter:blur(8px)','blur-md':'filter:blur(12px)',
    'blur-lg':'filter:blur(16px)','blur-xl':'filter:blur(24px)','blur-none':'filter:blur(0)',
    'grayscale':'filter:grayscale(100%)','grayscale-0':'filter:grayscale(0)',
    'sepia':'filter:sepia(100%)','sepia-0':'filter:sepia(0)',
    'invert':'filter:invert(100%)','invert-0':'filter:invert(0)',
    // Shadows
    'add-shadow-sm':'box-shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06)',
    'add-shadow':'box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)',
    'add-shadow-md':'box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)',
    'add-shadow-lg':'box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)',
    'add-shadow-xl':'box-shadow:0 25px 50px -12px rgba(0,0,0,.25)',
    'add-shadow-inner':'box-shadow:inset 0 2px 4px 0 rgba(0,0,0,.06)',
    'add-shadow-none':'box-shadow:none','no-shadow':'box-shadow:none',
    'drop-shadow-sm':'filter:drop-shadow(0 1px 1px rgba(0,0,0,.05))',
    'drop-shadow':'filter:drop-shadow(0 1px 2px rgba(0,0,0,.1))',
    'drop-shadow-md':'filter:drop-shadow(0 4px 3px rgba(0,0,0,.07))',
    'drop-shadow-lg':'filter:drop-shadow(0 10px 8px rgba(0,0,0,.04))',
    'drop-shadow-none':'filter:drop-shadow(0 0 #0000)',
    'text-shadow-sm':'text-shadow:0 1px 2px rgba(0,0,0,.2)',
    'text-shadow':'text-shadow:0 2px 4px rgba(0,0,0,.3)',
    'text-shadow-lg':'text-shadow:0 4px 8px rgba(0,0,0,.4)',
    'text-shadow-none':'text-shadow:none',
    // Cursor
    'cursor-auto':'cursor:auto','cursor-default':'cursor:default','cursor-pointer':'cursor:pointer',
    'cursor-wait':'cursor:wait','cursor-text':'cursor:text','cursor-move':'cursor:move',
    'cursor-not-allowed':'cursor:not-allowed','cursor-crosshair':'cursor:crosshair',
    'cursor-grab':'cursor:grab','cursor-grabbing':'cursor:grabbing',
    'cursor-zoom-in':'cursor:zoom-in','cursor-zoom-out':'cursor:zoom-out',
    'cursor-help':'cursor:help','cursor-none':'cursor:none',
    // Object fit
    'fit-cover':'object-fit:cover','fit-contain':'object-fit:contain',
    'fit-fill':'object-fit:fill','fit-none':'object-fit:none','fit-scale':'object-fit:scale-down',
    // Aspect ratio
    'ratio-square':'aspect-ratio:1/1','ratio-video':'aspect-ratio:16/9',
    'ratio-portrait':'aspect-ratio:9/16','ratio-4-3':'aspect-ratio:4/3',
    'ratio-3-2':'aspect-ratio:3/2','ratio-21-9':'aspect-ratio:21/9','ratio-auto':'aspect-ratio:auto',
    // Misc
    'pointer-none':'pointer-events:none','pointer-auto':'pointer-events:auto','pointer-all':'pointer-events:all',
    'select-none':'user-select:none','select-text':'user-select:text',
    'select-all':'user-select:all','select-auto':'user-select:auto',
    'resize-none':'resize:none','resize':'resize:both','resize-x':'resize:horizontal','resize-y':'resize:vertical',
    'appearance-none':'appearance:none;-webkit-appearance:none','appearance-auto':'appearance:auto',
    'outline-none':'outline:none','outline':'outline:2px solid currentColor',
    'outline-dashed':'outline:2px dashed currentColor',
    'outline-offset-2':'outline-offset:2px','outline-offset-4':'outline-offset:4px',
    'list-none':'list-style-type:none;padding-left:0','list-disc':'list-style-type:disc',
    'list-decimal':'list-style-type:decimal','list-inside':'list-style-position:inside',
    'list-outside':'list-style-position:outside',
    'table-auto':'table-layout:auto','table-fixed':'table-layout:fixed',
    'border-collapse':'border-collapse:collapse','border-separate':'border-collapse:separate',
    'sr-only':'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0',
    'not-sr-only':'position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal',
    'isolate':'isolation:isolate','isolation-auto':'isolation:auto',
    'will-change-auto':'will-change:auto','will-change-scroll':'will-change:scroll-position',
    'will-change-contents':'will-change:contents','will-change-transform':'will-change:transform',
    // bg
    'bg-top':'background-position:top','bg-bottom':'background-position:bottom',
    'bg-left':'background-position:left','bg-right':'background-position:right',
    'bg-center':'background-position:center','bg-cover':'background-size:cover',
    'bg-contain':'background-size:contain','bg-auto':'background-size:auto',
    'bg-repeat':'background-repeat:repeat','bg-no-repeat':'background-repeat:no-repeat',
    'bg-fixed':'background-attachment:fixed','bg-local':'background-attachment:local',
    'bg-clip-text':'background-clip:text;-webkit-background-clip:text',
    // Named colors
    'color-white':'color:#fff','color-black':'color:#000',
    'color-transparent':'color:transparent','color-current':'color:currentColor',
    'background-white':'background-color:#fff','background-black':'background-color:#000',
    'background-transparent':'background-color:transparent',
    'border-color-white':'border-color:#fff','border-color-black':'border-color:#000',
    'border-color-transparent':'border-color:transparent',
    // Blend modes
    'blend-normal':'mix-blend-mode:normal','blend-multiply':'mix-blend-mode:multiply',
    'blend-screen':'mix-blend-mode:screen','blend-overlay':'mix-blend-mode:overlay',
    'blend-darken':'mix-blend-mode:darken','blend-lighten':'mix-blend-mode:lighten',
    'blend-difference':'mix-blend-mode:difference','blend-exclusion':'mix-blend-mode:exclusion',
    'blend-hue':'mix-blend-mode:hue','blend-saturation':'mix-blend-mode:saturation',
    'blend-color':'mix-blend-mode:color','blend-luminosity':'mix-blend-mode:luminosity',
  };

  // ─── Numeric pattern rules ────────────────────────────────────────────────
  // Each rule: [regex, (matches...) => css_props_string | null]
  var RULES = [
    // Padding
    [/^add-padding-(\d+(?:\.\d+)?)$/, function(n){ return 'padding:'+n+'px'; }],
    [/^add-padding-top-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-top:'+n+'px'; }],
    [/^add-padding-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-bottom:'+n+'px'; }],
    [/^add-padding-left-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-left:'+n+'px'; }],
    [/^add-padding-right-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-right:'+n+'px'; }],
    [/^add-padding-x-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-left:'+n+'px;padding-right:'+n+'px'; }],
    [/^add-padding-y-(\d+(?:\.\d+)?)$/, function(n){ return 'padding-top:'+n+'px;padding-bottom:'+n+'px'; }],
    // Margin
    [/^add-margin-(\d+(?:\.\d+)?)$/, function(n){ return 'margin:'+n+'px'; }],
    [/^add-margin-top-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-top:'+n+'px'; }],
    [/^add-margin-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-bottom:'+n+'px'; }],
    [/^add-margin-left-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-left:'+n+'px'; }],
    [/^add-margin-right-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-right:'+n+'px'; }],
    [/^add-margin-x-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-left:'+n+'px;margin-right:'+n+'px'; }],
    [/^add-margin-y-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-top:'+n+'px;margin-bottom:'+n+'px'; }],
    // Negative margin
    [/^subtract-margin-(\d+(?:\.\d+)?)$/, function(n){ return 'margin:-'+n+'px'; }],
    [/^subtract-margin-top-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-top:-'+n+'px'; }],
    [/^subtract-margin-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-bottom:-'+n+'px'; }],
    [/^subtract-margin-left-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-left:-'+n+'px'; }],
    [/^subtract-margin-right-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-right:-'+n+'px'; }],
    [/^subtract-margin-x-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-left:-'+n+'px;margin-right:-'+n+'px'; }],
    [/^subtract-margin-y-(\d+(?:\.\d+)?)$/, function(n){ return 'margin-top:-'+n+'px;margin-bottom:-'+n+'px'; }],
    // Gap
    [/^gap-(\d+(?:\.\d+)?)$/, function(n){ return 'gap:'+n+'px'; }],
    [/^gap-x-(\d+(?:\.\d+)?)$/, function(n){ return 'column-gap:'+n+'px'; }],
    [/^gap-y-(\d+(?:\.\d+)?)$/, function(n){ return 'row-gap:'+n+'px'; }],
    // Border width
    [/^add-border-(\d+(?:\.\d+)?)$/, function(n){ return 'border:'+n+'px solid'; }],
    [/^add-border-top-(\d+(?:\.\d+)?)$/, function(n){ return 'border-top:'+n+'px solid'; }],
    [/^add-border-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'border-bottom:'+n+'px solid'; }],
    [/^add-border-left-(\d+(?:\.\d+)?)$/, function(n){ return 'border-left:'+n+'px solid'; }],
    [/^add-border-right-(\d+(?:\.\d+)?)$/, function(n){ return 'border-right:'+n+'px solid'; }],
    [/^add-border-x-(\d+(?:\.\d+)?)$/, function(n){ return 'border-left:'+n+'px solid;border-right:'+n+'px solid'; }],
    [/^add-border-y-(\d+(?:\.\d+)?)$/, function(n){ return 'border-top:'+n+'px solid;border-bottom:'+n+'px solid'; }],
    // Border radius
    [/^round-corners-(\d+(?:\.\d+)?)$/, function(n){ return 'border-radius:'+n+'px'; }],
    [/^round-top-(\d+(?:\.\d+)?)$/, function(n){ return 'border-top-left-radius:'+n+'px;border-top-right-radius:'+n+'px'; }],
    [/^round-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'border-bottom-left-radius:'+n+'px;border-bottom-right-radius:'+n+'px'; }],
    [/^round-left-(\d+(?:\.\d+)?)$/, function(n){ return 'border-top-left-radius:'+n+'px;border-bottom-left-radius:'+n+'px'; }],
    [/^round-right-(\d+(?:\.\d+)?)$/, function(n){ return 'border-top-right-radius:'+n+'px;border-bottom-right-radius:'+n+'px'; }],
    // Sizing
    [/^set-width-(\d+(?:\.\d+)?)$/, function(n){ return 'width:'+n+'px'; }],
    [/^set-height-(\d+(?:\.\d+)?)$/, function(n){ return 'height:'+n+'px'; }],
    [/^min-width-(\d+(?:\.\d+)?)$/, function(n){ return 'min-width:'+n+'px'; }],
    [/^max-width-(\d+(?:\.\d+)?)$/, function(n){ return 'max-width:'+n+'px'; }],
    [/^min-height-(\d+(?:\.\d+)?)$/, function(n){ return 'min-height:'+n+'px'; }],
    [/^max-height-(\d+(?:\.\d+)?)$/, function(n){ return 'max-height:'+n+'px'; }],
    // Fractional widths  set-width-1-of-3
    [/^set-width-(\d+)-of-(\d+)$/, function(n,d){
      var pct = (parseInt(n,10)/parseInt(d,10)*100).toFixed(6).replace(/\.?0+$/,'');
      return 'width:'+pct+'%';
    }],
    [/^set-height-(\d+)-of-(\d+)$/, function(n,d){
      var pct = (parseInt(n,10)/parseInt(d,10)*100).toFixed(6).replace(/\.?0+$/,'');
      return 'height:'+pct+'%';
    }],
    // Font size
    [/^set-text-(\d+(?:\.\d+)?)$/, function(n){ return 'font-size:'+n+'px'; }],
    // Opacity
    [/^opacity-(\d+(?:\.\d+)?)$/, function(n){ return 'opacity:'+parseFloat(n)/100; }],
    // Z-index (layer)
    [/^layer-(-?\d+)$/, function(n){ return 'z-index:'+n; }],
    // Positioning
    [/^pin-top-(\d+(?:\.\d+)?)$/, function(n){ return 'top:'+n+'px'; }],
    [/^pin-bottom-(\d+(?:\.\d+)?)$/, function(n){ return 'bottom:'+n+'px'; }],
    [/^pin-left-(\d+(?:\.\d+)?)$/, function(n){ return 'left:'+n+'px'; }],
    [/^pin-right-(\d+(?:\.\d+)?)$/, function(n){ return 'right:'+n+'px'; }],
    [/^pin-all-(\d+(?:\.\d+)?)$/, function(n){ return 'top:'+n+'px;right:'+n+'px;bottom:'+n+'px;left:'+n+'px'; }],
    // Letter spacing
    [/^add-letter-space-(\d+(?:\.\d+)?)$/, function(n){ return 'letter-spacing:'+n+'px'; }],
    [/^subtract-letter-space-(\d+(?:\.\d+)?)$/, function(n){ return 'letter-spacing:-'+n+'px'; }],
    // Grid
    [/^grid-cols-(\d+)$/, function(n){ return 'grid-template-columns:repeat('+n+',minmax(0,1fr))'; }],
    [/^grid-rows-(\d+)$/, function(n){ return 'grid-template-rows:repeat('+n+',minmax(0,1fr))'; }],
    [/^span-col-(\d+)$/, function(n){ return 'grid-column:span '+n+' / span '+n; }],
    [/^span-row-(\d+)$/, function(n){ return 'grid-row:span '+n+' / span '+n; }],
    [/^order-(\d+)$/, function(n){ return 'order:'+n; }],
    [/^columns-(\d+)$/, function(n){ return 'columns:'+n; }],
    // Colors
    [/^color-([a-z]+)-(\d+)$/, function(name,shade){
      var c = color(name, parseInt(shade,10));
      return c ? 'color:'+c : null;
    }],
    [/^background-([a-z]+)-(\d+)$/, function(name,shade){
      var c = color(name, parseInt(shade,10));
      return c ? 'background-color:'+c : null;
    }],
    [/^border-color-([a-z]+)-(\d+)$/, function(name,shade){
      var c = color(name, parseInt(shade,10));
      return c ? 'border-color:'+c : null;
    }],
    [/^fill-([a-z]+)-(\d+)$/, function(name,shade){
      var c = color(name, parseInt(shade,10));
      return c ? 'fill:'+c : null;
    }],
    [/^stroke-([a-z]+)-(\d+)$/, function(name,shade){
      var c = color(name, parseInt(shade,10));
      return c ? 'stroke:'+c : null;
    }],
    // Filter shorthands
    [/^brightness-(\d+)$/, function(n){ return 'filter:brightness('+parseFloat(n)/100+')'; }],
    [/^contrast-(\d+)$/, function(n){ return 'filter:contrast('+parseFloat(n)/100+')'; }],
    [/^saturate-(\d+)$/, function(n){ return 'filter:saturate('+parseFloat(n)/100+')'; }],
    [/^hue-rotate-(\d+)$/, function(n){ return 'filter:hue-rotate('+n+'deg)'; }],
    // Scale (arbitrary)
    [/^scale-(\d+)$/, function(n){ return 'transform:scale('+parseFloat(n)/100+')'; }],
    // Rotate (arbitrary)
    [/^rotate-(\d+)$/, function(n){ return 'transform:rotate('+n+'deg)'; }],
    // Line height (numeric)
    [/^line-height-(\d+(?:-\d+)?)$/, function(n){ return 'line-height:'+n.replace('-','.'); }],
  ];

  // ─── State variant map ────────────────────────────────────────────────────
  var STATES = {
    'on-hover':        function(sel,props){ return '.'+sel+':hover{'+props+'}'; },
    'on-focus':        function(sel,props){ return '.'+sel+':focus{'+props+'}'; },
    'on-active':       function(sel,props){ return '.'+sel+':active{'+props+'}'; },
    'on-disabled':     function(sel,props){ return '.'+sel+':disabled{'+props+'}'; },
    'on-checked':      function(sel,props){ return '.'+sel+':checked{'+props+'}'; },
    'on-first':        function(sel,props){ return '.'+sel+':first-child{'+props+'}'; },
    'on-last':         function(sel,props){ return '.'+sel+':last-child{'+props+'}'; },
    'on-odd':          function(sel,props){ return '.'+sel+':nth-child(odd){'+props+'}'; },
    'on-even':         function(sel,props){ return '.'+sel+':nth-child(even){'+props+'}'; },
    'on-placeholder':  function(sel,props){ return '.'+sel+'::placeholder{'+props+'}'; },
    'on-focus-within': function(sel,props){ return '.'+sel+':focus-within{'+props+'}'; },
    'on-focus-visible':function(sel,props){ return '.'+sel+':focus-visible{'+props+'}'; },
    'group-hover':     function(sel,props){ return '.group:hover .'+sel+'{'+props+'}'; },
  };

  // ─── Responsive variant map ───────────────────────────────────────────────
  var RESPONSIVE = {
    'on-mobile':  '@media (max-width:639px)',
    'on-tablet':  '@media (min-width:640px) and (max-width:1023px)',
    'on-desktop': '@media (min-width:1024px)',
    'on-wide':    '@media (min-width:1280px)',
    'on-ultra':   '@media (min-width:1536px)',
    'sm':         '@media (min-width:640px)',
    'md':         '@media (min-width:768px)',
    'lg':         '@media (min-width:1024px)',
    'xl':         '@media (min-width:1280px)',
    'xxl':        '@media (min-width:1536px)',
  };

  // ─── Escape CSS selector ──────────────────────────────────────────────────
  function esc(cls) {
    return cls.replace(/[:\[\]\/%.]/g, function(c){ return '\\'+c; });
  }

  // ─── Generate CSS props for a base class ─────────────────────────────────
  function baseProps(cls) {
    if (STATIC[cls]) return STATIC[cls];
    for (var i = 0; i < RULES.length; i++) {
      var m = cls.match(RULES[i][0]);
      if (m) {
        var result = RULES[i][1].apply(null, m.slice(1));
        if (result) return result;
      }
    }
    return null;
  }

  // ─── Generate a full CSS rule string for a class name ────────────────────
  function generateRule(cls) {
    // Dark mode
    if (cls.startsWith('dark:')) {
      var inner = cls.slice(5);
      var props = baseProps(inner);
      if (!props) return null;
      return '@media (prefers-color-scheme:dark){.'+esc(cls)+'{'+props+'}}';
    }

    // State variants (on-hover:, on-focus:, group-hover:, etc.)
    for (var state in STATES) {
      if (cls.startsWith(state+':')) {
        var inner = cls.slice(state.length+1);
        var props = baseProps(inner);
        if (!props) return null;
        return STATES[state](esc(cls), props);
      }
    }

    // Responsive variants
    for (var bp in RESPONSIVE) {
      if (cls.startsWith(bp+':')) {
        var inner = cls.slice(bp.length+1);
        var props = baseProps(inner);
        if (!props) return null;
        return RESPONSIVE[bp]+'{.'+esc(cls)+'{'+props+'}}';
      }
    }

    // Base class
    var props = baseProps(cls);
    if (!props) return null;
    return '.'+esc(cls)+'{'+props+'}';
  }

  // ─── Keyframes (injected once) ────────────────────────────────────────────
  var KEYFRAMES =
    // Core
    '@keyframes santy-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'+
    '@keyframes santy-ping{75%,100%{transform:scale(2);opacity:0}}'+
    '@keyframes santy-pulse{0%,100%{opacity:1}50%{opacity:.5}}'+
    '@keyframes santy-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)}}'+
    '@keyframes santy-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}'+
    // Attention seekers
    '@keyframes santy-flash{from,50%,to{opacity:1}25%,75%{opacity:0}}'+
    '@keyframes santy-rubber-band{from{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,.75,1)}40%{transform:scale3d(.75,1.25,1)}50%{transform:scale3d(1.15,.85,1)}65%{transform:scale3d(.95,1.05,1)}75%{transform:scale3d(1.05,.95,1)}to{transform:scale3d(1,1,1)}}'+
    '@keyframes santy-shake-x{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}'+
    '@keyframes santy-shake-y{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}20%,40%,60%,80%{transform:translate3d(0,10px,0)}}'+
    '@keyframes santy-shake-head{0%{transform:rotateY(0)}6.5%{transform:rotateY(-9deg)}18.5%{transform:rotateY(7deg)}31.5%{transform:rotateY(-5deg)}43.5%{transform:rotateY(3deg)}50%{transform:rotateY(0)}}'+
    '@keyframes santy-swing{20%{transform:rotate3d(0,0,1,15deg)}40%{transform:rotate3d(0,0,1,-10deg)}60%{transform:rotate3d(0,0,1,5deg)}80%{transform:rotate3d(0,0,1,-5deg)}to{transform:rotate3d(0,0,1,0deg)}}'+
    '@keyframes santy-tada{from{transform:scale3d(1,1,1)}10%,20%{transform:scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}to{transform:scale3d(1,1,1)}}'+
    '@keyframes santy-wobble{from{transform:translate3d(0,0,0)}15%{transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-jelly{from,11.1%,to{transform:translate3d(0,0,0)}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{transform:skewX(.390625deg) skewY(.390625deg)}88.8%{transform:skewX(-.1953125deg) skewY(-.1953125deg)}}'+
    '@keyframes santy-heartbeat{from{transform:scale(1);animation-timing-function:ease-out}10%{transform:scale(1.12);animation-timing-function:ease-in}17%{transform:scale(1.08);animation-timing-function:ease-out}33%{transform:scale(1.18);animation-timing-function:ease-in}45%{transform:scale(1);animation-timing-function:ease-out}}'+
    // Fade in
    '@keyframes santy-fade-in{from{opacity:0}to{opacity:1}}'+
    '@keyframes santy-fade-in-from-top{from{opacity:0;transform:translate3d(0,-30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-from-bottom{from{opacity:0;transform:translate3d(0,30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-from-left{from{opacity:0;transform:translate3d(-30px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-from-right{from{opacity:0;transform:translate3d(30px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-top-left{from{opacity:0;transform:translate3d(-30px,-30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-top-right{from{opacity:0;transform:translate3d(30px,-30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-bottom-left{from{opacity:0;transform:translate3d(-30px,30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-fade-in-bottom-right{from{opacity:0;transform:translate3d(30px,30px,0)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    // Fade out
    '@keyframes santy-fade-out{from{opacity:1}to{opacity:0}}'+
    '@keyframes santy-fade-out-to-top{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(0,-30px,0)}}'+
    '@keyframes santy-fade-out-to-bottom{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(0,30px,0)}}'+
    '@keyframes santy-fade-out-to-left{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-30px,0,0)}}'+
    '@keyframes santy-fade-out-to-right{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(30px,0,0)}}'+
    '@keyframes santy-fade-out-top-left{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-30px,-30px,0)}}'+
    '@keyframes santy-fade-out-top-right{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(30px,-30px,0)}}'+
    '@keyframes santy-fade-out-bottom-left{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-30px,30px,0)}}'+
    '@keyframes santy-fade-out-bottom-right{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(30px,30px,0)}}'+
    // Bounce in
    '@keyframes santy-bounce-in{from,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scale3d(1,1,1)}}'+
    '@keyframes santy-bounce-in-from-top{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0) scaleY(3)}60%{opacity:1;transform:translate3d(0,25px,0) scaleY(.9)}75%{transform:translate3d(0,-10px,0) scaleY(.95)}90%{transform:translate3d(0,5px,0) scaleY(.985)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-bounce-in-from-bottom{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0) scaleY(5)}60%{opacity:1;transform:translate3d(0,-20px,0) scaleY(.9)}75%{transform:translate3d(0,10px,0) scaleY(.95)}90%{transform:translate3d(0,-5px,0) scaleY(.985)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-bounce-in-from-left{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0) scaleX(3)}60%{opacity:1;transform:translate3d(25px,0,0) scaleX(1)}75%{transform:translate3d(-10px,0,0) scaleX(.98)}90%{transform:translate3d(5px,0,0) scaleX(.995)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-bounce-in-from-right{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0) scaleX(3)}60%{opacity:1;transform:translate3d(-25px,0,0) scaleX(1)}75%{transform:translate3d(10px,0,0) scaleX(.98)}90%{transform:translate3d(-5px,0,0) scaleX(.995)}to{transform:translate3d(0,0,0)}}'+
    // Bounce out
    '@keyframes santy-bounce-out{20%{transform:scale3d(.9,.9,.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(.3,.3,.3)}}'+
    '@keyframes santy-bounce-out-to-top{20%{transform:translate3d(0,-10px,0) scaleY(.985)}40%,45%{opacity:1;transform:translate3d(0,20px,0) scaleY(.9)}to{opacity:0;transform:translate3d(0,-2000px,0) scaleY(3)}}'+
    '@keyframes santy-bounce-out-to-bottom{20%{transform:translate3d(0,10px,0) scaleY(.985)}40%,45%{opacity:1;transform:translate3d(0,-20px,0) scaleY(.9)}to{opacity:0;transform:translate3d(0,2000px,0) scaleY(5)}}'+
    '@keyframes santy-bounce-out-to-left{20%{opacity:1;transform:translate3d(20px,0,0) scaleX(.9)}to{opacity:0;transform:translate3d(-2000px,0,0) scaleX(2)}}'+
    '@keyframes santy-bounce-out-to-right{20%{opacity:1;transform:translate3d(-20px,0,0) scaleX(.9)}to{opacity:0;transform:translate3d(2000px,0,0) scaleX(2)}}'+
    // Slide in / out
    '@keyframes santy-slide-in-from-top{from{visibility:visible;transform:translate3d(0,-100%,0)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-slide-in-from-bottom{from{visibility:visible;transform:translate3d(0,100%,0)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-slide-in-from-left{from{visibility:visible;transform:translate3d(-100%,0,0)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-slide-in-from-right{from{visibility:visible;transform:translate3d(100%,0,0)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-slide-out-to-top{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,-100%,0)}}'+
    '@keyframes santy-slide-out-to-bottom{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,100%,0)}}'+
    '@keyframes santy-slide-out-to-left{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(-100%,0,0)}}'+
    '@keyframes santy-slide-out-to-right{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(100%,0,0)}}'+
    // Zoom in / out
    '@keyframes santy-zoom-in{from{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}'+
    '@keyframes santy-zoom-in-from-top{from{opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,-1000px,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}60%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}}'+
    '@keyframes santy-zoom-in-from-bottom{from{opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,1000px,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}60%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}}'+
    '@keyframes santy-zoom-in-from-left{from{opacity:0;transform:scale3d(.1,.1,.1) translate3d(-1000px,0,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}60%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(10px,0,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}}'+
    '@keyframes santy-zoom-in-from-right{from{opacity:0;transform:scale3d(.1,.1,.1) translate3d(1000px,0,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}60%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(-10px,0,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}}'+
    '@keyframes santy-zoom-out{from{opacity:1}50%{opacity:0;transform:scale3d(.3,.3,.3)}to{opacity:0}}'+
    '@keyframes santy-zoom-out-to-top{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}to{opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,-2000px,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}}'+
    '@keyframes santy-zoom-out-to-bottom{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}to{opacity:0;transform:scale3d(.1,.1,.1) translate3d(0,2000px,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}}'+
    '@keyframes santy-zoom-out-to-left{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(42px,0,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}to{opacity:0;transform:scale3d(.1,.1,.1) translate3d(-2000px,0,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}}'+
    '@keyframes santy-zoom-out-to-right{40%{opacity:1;transform:scale3d(.475,.475,.475) translate3d(-42px,0,0);animation-timing-function:cubic-bezier(.175,.885,.32,1)}to{opacity:0;transform:scale3d(.1,.1,.1) translate3d(2000px,0,0);animation-timing-function:cubic-bezier(.55,.055,.675,.19)}}'+
    // Flip
    '@keyframes santy-flip{from{transform:perspective(400px) scale3d(1,1,1) rotate3d(0,1,0,-360deg);animation-timing-function:ease-out}40%{transform:perspective(400px) scale3d(1,1,.5) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);animation-timing-function:ease-out}50%{transform:perspective(400px) scale3d(1,1,.5) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(.95,1,1) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}to{transform:perspective(400px) scale3d(1,1,1) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}}'+
    '@keyframes santy-flip-in-x{from{transform:perspective(400px) rotate3d(1,0,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(1,0,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(1,0,0,-5deg)}to{transform:perspective(400px)}}'+
    '@keyframes santy-flip-in-y{from{transform:perspective(400px) rotate3d(0,1,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(0,1,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(0,1,0,-5deg)}to{transform:perspective(400px)}}'+
    '@keyframes santy-flip-out-x{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}to{transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}'+
    '@keyframes santy-flip-out-y{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}to{transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}'+
    // Rotate in / out
    '@keyframes santy-rotate-in{from{transform:rotate3d(0,0,1,-200deg);opacity:0}to{transform:translate3d(0,0,0);opacity:1}}'+
    '@keyframes santy-rotate-in-from-top-left{from{transform:rotate3d(0,0,1,-45deg);opacity:0}to{transform:translate3d(0,0,0);opacity:1}}'+
    '@keyframes santy-rotate-in-from-top-right{from{transform:rotate3d(0,0,1,45deg);opacity:0}to{transform:translate3d(0,0,0);opacity:1}}'+
    '@keyframes santy-rotate-in-from-bottom-left{from{transform:rotate3d(0,0,1,45deg);opacity:0}to{transform:translate3d(0,0,0);opacity:1}}'+
    '@keyframes santy-rotate-in-from-bottom-right{from{transform:rotate3d(0,0,1,-90deg);opacity:0}to{transform:translate3d(0,0,0);opacity:1}}'+
    '@keyframes santy-rotate-out{from{opacity:1}to{transform:rotate3d(0,0,1,200deg);opacity:0}}'+
    '@keyframes santy-rotate-out-to-top-left{from{opacity:1}to{transform:rotate3d(0,0,1,-45deg);opacity:0}}'+
    '@keyframes santy-rotate-out-to-top-right{from{opacity:1}to{transform:rotate3d(0,0,1,90deg);opacity:0}}'+
    '@keyframes santy-rotate-out-to-bottom-left{from{opacity:1}to{transform:rotate3d(0,0,1,45deg);opacity:0}}'+
    '@keyframes santy-rotate-out-to-bottom-right{from{opacity:1}to{transform:rotate3d(0,0,1,-45deg);opacity:0}}'+
    // Back in / out
    '@keyframes santy-back-in-from-top{0%{transform:translateY(-1200px) scale(.7);opacity:.7}80%{transform:translateY(0) scale(.7);opacity:.7}100%{transform:scale(1);opacity:1}}'+
    '@keyframes santy-back-in-from-bottom{0%{transform:translateY(1200px) scale(.7);opacity:.7}80%{transform:translateY(0) scale(.7);opacity:.7}100%{transform:scale(1);opacity:1}}'+
    '@keyframes santy-back-in-from-left{0%{transform:translateX(-2000px) scale(.7);opacity:.7}80%{transform:translateX(0) scale(.7);opacity:.7}100%{transform:scale(1);opacity:1}}'+
    '@keyframes santy-back-in-from-right{0%{transform:translateX(2000px) scale(.7);opacity:.7}80%{transform:translateX(0) scale(.7);opacity:.7}100%{transform:scale(1);opacity:1}}'+
    '@keyframes santy-back-out-to-top{0%{transform:scale(1);opacity:1}20%{transform:translateY(0) scale(.7);opacity:.7}100%{transform:translateY(-700px) scale(.7);opacity:.7}}'+
    '@keyframes santy-back-out-to-bottom{0%{transform:scale(1);opacity:1}20%{transform:translateY(0) scale(.7);opacity:.7}100%{transform:translateY(700px) scale(.7);opacity:.7}}'+
    '@keyframes santy-back-out-to-left{0%{transform:scale(1);opacity:1}20%{transform:translateX(0) scale(.7);opacity:.7}100%{transform:translateX(-2000px) scale(.7);opacity:.7}}'+
    '@keyframes santy-back-out-to-right{0%{transform:scale(1);opacity:1}20%{transform:translateX(0) scale(.7);opacity:.7}100%{transform:translateX(2000px) scale(.7);opacity:.7}}'+
    // Light speed
    '@keyframes santy-speed-in-from-left{from{transform:translate3d(-100%,0,0) skewX(30deg);opacity:0}60%{transform:skewX(-20deg);opacity:1}80%{transform:skewX(5deg)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-speed-in-from-right{from{transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{transform:skewX(20deg);opacity:1}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}'+
    '@keyframes santy-speed-out-to-left{from{opacity:1}to{transform:translate3d(-100%,0,0) skewX(-30deg);opacity:0}}'+
    '@keyframes santy-speed-out-to-right{from{opacity:1}to{transform:translate3d(100%,0,0) skewX(30deg);opacity:0}}'+
    // Specials
    '@keyframes santy-hinge{0%{animation-timing-function:ease-in-out}20%,60%{transform:rotate3d(0,0,1,80deg);animation-timing-function:ease-in-out}40%,80%{transform:rotate3d(0,0,1,60deg);animation-timing-function:ease-in-out;opacity:1}to{transform:translate3d(0,700px,0);opacity:0}}'+
    '@keyframes santy-jack-in-box{from{opacity:0;transform:scale(.1) rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{opacity:1;transform:scale(1)}}'+
    '@keyframes santy-roll-in{from{opacity:0;transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}to{opacity:1;transform:translate3d(0,0,0)}}'+
    '@keyframes santy-roll-out{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}';

  // ─── Base component styles (small — only rendered once) ───────────────────
  var BASE_CSS = '*,*::before,*::after{box-sizing:border-box}'+
    ':root{--santy-font-sans:ui-sans-serif,system-ui,-apple-system,sans-serif;--santy-font-mono:ui-monospace,monospace}'+
    '.container{width:100%;margin-left:auto;margin-right:auto;padding-left:16px;padding-right:16px}'+
    '@media(min-width:640px){.container{max-width:640px}}'+
    '@media(min-width:768px){.container{max-width:768px}}'+
    '@media(min-width:1024px){.container{max-width:1024px}}'+
    '@media(min-width:1280px){.container{max-width:1280px}}'+
    '@media(min-width:1536px){.container{max-width:1536px}}'+
    '.btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 20px;font-size:14px;font-weight:600;border-radius:8px;border:none;cursor:pointer;transition:all .15s ease;text-decoration:none;line-height:1.5;white-space:nowrap}'+
    '.btn:disabled{opacity:.5;cursor:not-allowed}'+
    '.btn-sm{padding:4px 12px;font-size:12px;border-radius:6px}'+
    '.btn-lg{padding:12px 28px;font-size:16px;border-radius:10px}'+
    '.btn-xl{padding:16px 36px;font-size:18px;border-radius:12px}'+
    '.btn-primary{background-color:#3b82f6;color:#fff}.btn-primary:hover{background-color:#2563eb}'+
    '.btn-secondary{background-color:#6b7280;color:#fff}.btn-secondary:hover{background-color:#4b5563}'+
    '.btn-success{background-color:#22c55e;color:#fff}.btn-success:hover{background-color:#16a34a}'+
    '.btn-danger{background-color:#ef4444;color:#fff}.btn-danger:hover{background-color:#dc2626}'+
    '.btn-warning{background-color:#f59e0b;color:#fff}.btn-warning:hover{background-color:#d97706}'+
    '.btn-outline{background-color:transparent;border:2px solid currentColor}'+
    '.btn-ghost{background-color:transparent}.btn-ghost:hover{background-color:rgba(0,0,0,.05)}'+
    '.btn-full{width:100%}'+
    '.card{background-color:#fff;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);overflow:hidden}'+
    '.card-body{padding:24px}.card-header{padding:16px 24px;border-bottom:1px solid #e5e7eb}.card-footer{padding:16px 24px;border-top:1px solid #e5e7eb}'+
    '.badge{display:inline-flex;align-items:center;padding:2px 10px;font-size:12px;font-weight:600;border-radius:9999px;line-height:1.5}'+
    '.alert{padding:12px 16px;border-radius:8px;border-left:4px solid currentColor;margin-bottom:16px}'+
    '.alert-info{background-color:#eff6ff;color:#1d4ed8}.alert-success{background-color:#f0fdf4;color:#15803d}'+
    '.alert-warning{background-color:#fffbeb;color:#b45309}.alert-danger{background-color:#fef2f2;color:#b91c1c}'+
    '.input{display:block;width:100%;padding:8px 12px;font-size:14px;border:1px solid #d1d5db;border-radius:6px;background-color:#fff;transition:border-color .15s ease,box-shadow .15s ease;outline:none}'+
    '.input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.2)}'+
    '.input-error{border-color:#ef4444}.input-error:focus{box-shadow:0 0 0 3px rgba(239,68,68,.2)}'+
    '.input-lg{padding:12px 16px;font-size:16px;border-radius:8px}.input-sm{padding:4px 8px;font-size:12px}'+
    '.divider{border:none;border-top:1px solid #e5e7eb;margin:16px 0}'+
    '.avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;flex-shrink:0}'+
    '.avatar-sm{width:32px;height:32px}.avatar-md{width:40px;height:40px}.avatar-lg{width:56px;height:56px}.avatar-xl{width:80px;height:80px}'+
    '.spinner{border:3px solid rgba(0,0,0,.1);border-top-color:#3b82f6;border-radius:50%;animation:santy-spin .7s linear infinite}'+
    '.spinner-sm{width:16px;height:16px}.spinner-md{width:24px;height:24px}.spinner-lg{width:40px;height:40px}.spinner-xl{width:56px;height:56px}'+
    '.skeleton{background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%);background-size:200% 100%;animation:santy-skeleton 1.5s ease-in-out infinite;border-radius:4px}'+
    '.progress{width:100%;height:8px;background-color:#e5e7eb;border-radius:9999px;overflow:hidden}'+
    '.progress-bar{height:100%;background-color:#3b82f6;border-radius:9999px;transition:width .3s ease}';

  // ─── Setup style element ──────────────────────────────────────────────────
  var cfg   = (root.SantyJIT) || {};
  var sheet = document.createElement('style');
  sheet.id  = 'santy-jit';
  if (cfg.nonce) sheet.setAttribute('nonce', cfg.nonce);
  document.head.appendChild(sheet);

  // Write base styles + keyframes once
  sheet.textContent = BASE_CSS + KEYFRAMES;

  var generated = {};  // cls → true

  function inject(cls) {
    if (generated[cls]) return;
    generated[cls] = true;
    var rule = generateRule(cls);
    if (rule) sheet.textContent += rule;
  }

  function processElement(el) {
    if (!el || !el.classList) return;
    for (var i = 0; i < el.classList.length; i++) {
      inject(el.classList[i]);
    }
  }

  function scan(root) {
    processElement(root);
    var els = root.querySelectorAll ? root.querySelectorAll('[class]') : [];
    for (var i = 0; i < els.length; i++) processElement(els[i]);
  }

  // ─── Initial scan ─────────────────────────────────────────────────────────
  if (document.body) {
    scan(document.body);
  } else {
    document.addEventListener('DOMContentLoaded', function(){ scan(document.body); });
  }

  // Safelist
  if (cfg.safelist) {
    cfg.safelist.forEach(function(cls){ inject(cls); });
  }

  // ─── MutationObserver — watch for class changes ───────────────────────────
  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === 'attributes' && m.attributeName === 'class') {
        processElement(m.target);
      } else if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeType === 1) scan(node);
        }
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  root.SantyJIT = root.SantyJIT || {};
  root.SantyJIT.inject  = inject;
  root.SantyJIT.scan    = scan;
  root.SantyJIT.getCSS  = function(){ return sheet.textContent; };
  root.SantyJIT.stats   = function(){
    return {
      generated: Object.keys(generated).length,
      bytes:     sheet.textContent.length,
    };
  };

}(window));
