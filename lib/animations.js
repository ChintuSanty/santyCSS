'use strict';
/**
 * SantyCSS Extended Animations
 * Full animate.css set with plain-English SantyCSS naming convention.
 *
 * Naming rules:
 *   animate-{type}                     →  basic animation
 *   animate-{type}-in / out            →  entrance / exit
 *   animate-{type}-in-from-{side}      →  directional entrance
 *   animate-{type}-out-to-{side}       →  directional exit
 *   animation-speed-{name}             →  duration helper
 *   animation-delay-{ms}               →  delay helper
 *   animation-loop-{n} / forever       →  iteration helper
 *   animation-fill-{mode}              →  fill-mode helper
 */

const ANIMATION_CSS = `
/* ═══════════════════════════════════════════════════════════════════════
   SANTY ANIMATIONS — animate.css compatible · Plain-English naming
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Speed helpers ── */
.animation-speed-fastest { animation-duration: 0.3s !important; }
.animation-speed-fast    { animation-duration: 0.5s !important; }
.animation-speed-normal  { animation-duration: 1s   !important; }
.animation-speed-slow    { animation-duration: 1.5s !important; }
.animation-speed-slowest { animation-duration: 2s   !important; }
.animation-speed-glacial { animation-duration: 3s   !important; }

/* ── Delay helpers ── */
.animation-delay-100  { animation-delay: 0.1s; }
.animation-delay-200  { animation-delay: 0.2s; }
.animation-delay-300  { animation-delay: 0.3s; }
.animation-delay-400  { animation-delay: 0.4s; }
.animation-delay-500  { animation-delay: 0.5s; }
.animation-delay-600  { animation-delay: 0.6s; }
.animation-delay-700  { animation-delay: 0.7s; }
.animation-delay-800  { animation-delay: 0.8s; }
.animation-delay-900  { animation-delay: 0.9s; }
.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-1500 { animation-delay: 1.5s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-3000 { animation-delay: 3s; }

/* ── Iteration helpers ── */
.animation-loop-1       { animation-iteration-count: 1; }
.animation-loop-2       { animation-iteration-count: 2; }
.animation-loop-3       { animation-iteration-count: 3; }
.animation-loop-4       { animation-iteration-count: 4; }
.animation-loop-5       { animation-iteration-count: 5; }
.animation-loop-forever { animation-iteration-count: infinite; }

/* ── Fill-mode helpers ── */
.animation-fill-none      { animation-fill-mode: none; }
.animation-fill-forwards  { animation-fill-mode: forwards; }
.animation-fill-backwards { animation-fill-mode: backwards; }
.animation-fill-both      { animation-fill-mode: both; }

/* ── Timing-function helpers ── */
.animation-ease        { animation-timing-function: ease; }
.animation-ease-in     { animation-timing-function: ease-in; }
.animation-ease-out    { animation-timing-function: ease-out; }
.animation-ease-in-out { animation-timing-function: ease-in-out; }
.animation-linear      { animation-timing-function: linear; }

/* ── Pause / play ── */
.animation-paused { animation-play-state: paused; }
.animation-running{ animation-play-state: running; }
.animation-none   { animation: none; }

/* ════════════════════════════════════════════════════
   ATTENTION SEEKERS
   Keep looping or use once (add animation-loop-1)
   ════════════════════════════════════════════════════ */
.animate-flash       { animation: santy-flash       1s   ease         both; }
.animate-rubber-band { animation: santy-rubber-band 1s   ease         both; }
.animate-shake-x     { animation: santy-shake-x     1s   ease         both; }
.animate-shake-y     { animation: santy-shake-y     1s   ease         both; }
.animate-shake-head  { animation: santy-shake-head  1s   ease-in-out  both; }
.animate-swing       { animation: santy-swing       1s   ease         both; transform-origin: top center; }
.animate-tada        { animation: santy-tada        1s   ease         both; }
.animate-wobble      { animation: santy-wobble      1s   ease         both; }
.animate-jelly       { animation: santy-jelly       1s   ease         both; }
.animate-heartbeat   { animation: santy-heartbeat   1.3s ease-in-out  both; }

/* ════════════════════════════════════════════════════
   FADING ENTRANCES
   ════════════════════════════════════════════════════ */
.animate-fade-in              { animation: santy-fade-in              0.5s ease both; }
.animate-fade-in-from-top     { animation: santy-fade-in-from-top     0.5s ease both; }
.animate-fade-in-from-bottom  { animation: santy-fade-in-from-bottom  0.5s ease both; }
.animate-fade-in-from-left    { animation: santy-fade-in-from-left    0.5s ease both; }
.animate-fade-in-from-right   { animation: santy-fade-in-from-right   0.5s ease both; }
.animate-fade-in-top-left     { animation: santy-fade-in-top-left     0.5s ease both; }
.animate-fade-in-top-right    { animation: santy-fade-in-top-right    0.5s ease both; }
.animate-fade-in-bottom-left  { animation: santy-fade-in-bottom-left  0.5s ease both; }
.animate-fade-in-bottom-right { animation: santy-fade-in-bottom-right 0.5s ease both; }

/* ════════════════════════════════════════════════════
   FADING EXITS
   ════════════════════════════════════════════════════ */
.animate-fade-out              { animation: santy-fade-out              0.5s ease both; }
.animate-fade-out-to-top       { animation: santy-fade-out-to-top       0.5s ease both; }
.animate-fade-out-to-bottom    { animation: santy-fade-out-to-bottom    0.5s ease both; }
.animate-fade-out-to-left      { animation: santy-fade-out-to-left      0.5s ease both; }
.animate-fade-out-to-right     { animation: santy-fade-out-to-right     0.5s ease both; }
.animate-fade-out-top-left     { animation: santy-fade-out-top-left     0.5s ease both; }
.animate-fade-out-top-right    { animation: santy-fade-out-top-right    0.5s ease both; }
.animate-fade-out-bottom-left  { animation: santy-fade-out-bottom-left  0.5s ease both; }
.animate-fade-out-bottom-right { animation: santy-fade-out-bottom-right 0.5s ease both; }

/* ════════════════════════════════════════════════════
   BOUNCING ENTRANCES
   ════════════════════════════════════════════════════ */
.animate-bounce-in             { animation: santy-bounce-in             0.75s ease both; }
.animate-bounce-in-from-top    { animation: santy-bounce-in-from-top    0.75s ease both; }
.animate-bounce-in-from-bottom { animation: santy-bounce-in-from-bottom 0.75s ease both; }
.animate-bounce-in-from-left   { animation: santy-bounce-in-from-left   0.75s ease both; }
.animate-bounce-in-from-right  { animation: santy-bounce-in-from-right  0.75s ease both; }

/* ════════════════════════════════════════════════════
   BOUNCING EXITS
   ════════════════════════════════════════════════════ */
.animate-bounce-out             { animation: santy-bounce-out             0.75s ease both; }
.animate-bounce-out-to-top      { animation: santy-bounce-out-to-top      0.75s ease both; }
.animate-bounce-out-to-bottom   { animation: santy-bounce-out-to-bottom   0.75s ease both; }
.animate-bounce-out-to-left     { animation: santy-bounce-out-to-left     0.75s ease both; }
.animate-bounce-out-to-right    { animation: santy-bounce-out-to-right    0.75s ease both; }

/* ════════════════════════════════════════════════════
   SLIDING ENTRANCES
   ════════════════════════════════════════════════════ */
.animate-slide-in-from-top    { animation: santy-slide-in-from-top    0.4s ease both; }
.animate-slide-in-from-bottom { animation: santy-slide-in-from-bottom 0.4s ease both; }
.animate-slide-in-from-left   { animation: santy-slide-in-from-left   0.4s ease both; }
.animate-slide-in-from-right  { animation: santy-slide-in-from-right  0.4s ease both; }

/* ════════════════════════════════════════════════════
   SLIDING EXITS
   ════════════════════════════════════════════════════ */
.animate-slide-out-to-top    { animation: santy-slide-out-to-top    0.4s ease both; }
.animate-slide-out-to-bottom { animation: santy-slide-out-to-bottom 0.4s ease both; }
.animate-slide-out-to-left   { animation: santy-slide-out-to-left   0.4s ease both; }
.animate-slide-out-to-right  { animation: santy-slide-out-to-right  0.4s ease both; }

/* ════════════════════════════════════════════════════
   ZOOMING ENTRANCES
   ════════════════════════════════════════════════════ */
.animate-zoom-in             { animation: santy-zoom-in             0.3s ease both; }
.animate-zoom-in-from-top    { animation: santy-zoom-in-from-top    0.5s ease both; }
.animate-zoom-in-from-bottom { animation: santy-zoom-in-from-bottom 0.5s ease both; }
.animate-zoom-in-from-left   { animation: santy-zoom-in-from-left   0.5s ease both; }
.animate-zoom-in-from-right  { animation: santy-zoom-in-from-right  0.5s ease both; }

/* ════════════════════════════════════════════════════
   ZOOMING EXITS
   ════════════════════════════════════════════════════ */
.animate-zoom-out             { animation: santy-zoom-out             0.3s ease both; }
.animate-zoom-out-to-top      { animation: santy-zoom-out-to-top      0.5s ease both; }
.animate-zoom-out-to-bottom   { animation: santy-zoom-out-to-bottom   0.5s ease both; }
.animate-zoom-out-to-left     { animation: santy-zoom-out-to-left     0.5s ease both; }
.animate-zoom-out-to-right    { animation: santy-zoom-out-to-right    0.5s ease both; }

/* ════════════════════════════════════════════════════
   FLIPPING
   ════════════════════════════════════════════════════ */
.animate-flip       { animation: santy-flip       1s   ease both; backface-visibility: visible !important; }
.animate-flip-in-x  { animation: santy-flip-in-x  0.75s ease both; backface-visibility: visible !important; }
.animate-flip-in-y  { animation: santy-flip-in-y  0.75s ease both; backface-visibility: visible !important; }
.animate-flip-out-x { animation: santy-flip-out-x 0.75s ease both; backface-visibility: visible !important; }
.animate-flip-out-y { animation: santy-flip-out-y 0.75s ease both; backface-visibility: visible !important; }

/* ════════════════════════════════════════════════════
   ROTATING ENTRANCES
   ════════════════════════════════════════════════════ */
.animate-rotate-in                   { animation: santy-rotate-in                   0.6s ease both; }
.animate-rotate-in-from-top-left     { animation: santy-rotate-in-from-top-left     0.6s ease both; transform-origin: left top;     }
.animate-rotate-in-from-top-right    { animation: santy-rotate-in-from-top-right    0.6s ease both; transform-origin: right top;    }
.animate-rotate-in-from-bottom-left  { animation: santy-rotate-in-from-bottom-left  0.6s ease both; transform-origin: left bottom;  }
.animate-rotate-in-from-bottom-right { animation: santy-rotate-in-from-bottom-right 0.6s ease both; transform-origin: right bottom; }

/* ════════════════════════════════════════════════════
   ROTATING EXITS
   ════════════════════════════════════════════════════ */
.animate-rotate-out                   { animation: santy-rotate-out                   0.6s ease both; }
.animate-rotate-out-to-top-left       { animation: santy-rotate-out-to-top-left       0.6s ease both; transform-origin: left top;     }
.animate-rotate-out-to-top-right      { animation: santy-rotate-out-to-top-right      0.6s ease both; transform-origin: right top;    }
.animate-rotate-out-to-bottom-left    { animation: santy-rotate-out-to-bottom-left    0.6s ease both; transform-origin: left bottom;  }
.animate-rotate-out-to-bottom-right   { animation: santy-rotate-out-to-bottom-right   0.6s ease both; transform-origin: right bottom; }

/* ════════════════════════════════════════════════════
   BACK ENTRANCES (scale from afar)
   ════════════════════════════════════════════════════ */
.animate-back-in-from-top    { animation: santy-back-in-from-top    0.7s ease both; }
.animate-back-in-from-bottom { animation: santy-back-in-from-bottom 0.7s ease both; }
.animate-back-in-from-left   { animation: santy-back-in-from-left   0.7s ease both; }
.animate-back-in-from-right  { animation: santy-back-in-from-right  0.7s ease both; }

/* ════════════════════════════════════════════════════
   BACK EXITS
   ════════════════════════════════════════════════════ */
.animate-back-out-to-top    { animation: santy-back-out-to-top    0.7s ease both; }
.animate-back-out-to-bottom { animation: santy-back-out-to-bottom 0.7s ease both; }
.animate-back-out-to-left   { animation: santy-back-out-to-left   0.7s ease both; }
.animate-back-out-to-right  { animation: santy-back-out-to-right  0.7s ease both; }

/* ════════════════════════════════════════════════════
   LIGHT SPEED (skew + slide)
   ════════════════════════════════════════════════════ */
.animate-speed-in-from-left  { animation: santy-speed-in-from-left  0.5s ease-out both; }
.animate-speed-in-from-right { animation: santy-speed-in-from-right 0.5s ease-out both; }
.animate-speed-out-to-left   { animation: santy-speed-out-to-left   0.5s ease-in  both; }
.animate-speed-out-to-right  { animation: santy-speed-out-to-right  0.5s ease-in  both; }

/* ════════════════════════════════════════════════════
   SPECIALS
   ════════════════════════════════════════════════════ */
.animate-hinge       { animation: santy-hinge       2s   ease both; transform-origin: top left; }
.animate-jack-in-box { animation: santy-jack-in-box 1s   ease both; transform-origin: center bottom; }
.animate-roll-in     { animation: santy-roll-in     0.6s ease both; }
.animate-roll-out    { animation: santy-roll-out    0.6s ease both; }

/* ── Original utilities (kept for backwards compat) ── */
.animate-spin        { animation: santy-spin  1s linear infinite; }
.animate-ping        { animation: santy-ping  1s cubic-bezier(0,0,.2,1) infinite; }
.animate-pulse       { animation: santy-pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
.animate-bounce      { animation: santy-bounce 1s infinite; }
.animate-slide-up    { animation: santy-slide-in-from-bottom 0.4s ease both; }
.animate-slide-down  { animation: santy-slide-in-from-top    0.4s ease both; }
.animate-zoom-in     { animation: santy-zoom-in  0.3s ease both; }
.animate-zoom-out    { animation: santy-zoom-out 0.3s ease both; }

/* ═══════════════════════════════════════════════════════════════════════
   KEYFRAMES
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Core ── */
@keyframes santy-spin    { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
@keyframes santy-ping    { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes santy-pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes santy-bounce  { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,.2,1); } }
@keyframes santy-skeleton{ 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── Attention Seekers ── */
@keyframes santy-flash {
  from, 50%, to { opacity: 1; }
  25%, 75%      { opacity: 0; }
}
@keyframes santy-rubber-band {
  from { transform: scale3d(1, 1, 1); }
  30%  { transform: scale3d(1.25, .75, 1); }
  40%  { transform: scale3d(.75, 1.25, 1); }
  50%  { transform: scale3d(1.15, .85, 1); }
  65%  { transform: scale3d(.95, 1.05, 1); }
  75%  { transform: scale3d(1.05, .95, 1); }
  to   { transform: scale3d(1, 1, 1); }
}
@keyframes santy-shake-x {
  from, to              { transform: translate3d(0, 0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate3d(-10px, 0, 0); }
  20%, 40%, 60%, 80%    { transform: translate3d(10px, 0, 0); }
}
@keyframes santy-shake-y {
  from, to              { transform: translate3d(0, 0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate3d(0, -10px, 0); }
  20%, 40%, 60%, 80%    { transform: translate3d(0, 10px, 0); }
}
@keyframes santy-shake-head {
  0%    { transform: rotateY(0deg); }
  6.5%  { transform: rotateY(-9deg); }
  18.5% { transform: rotateY(7deg); }
  31.5% { transform: rotateY(-5deg); }
  43.5% { transform: rotateY(3deg); }
  50%   { transform: rotateY(0deg); }
}
@keyframes santy-swing {
  20% { transform: rotate3d(0, 0, 1, 15deg); }
  40% { transform: rotate3d(0, 0, 1, -10deg); }
  60% { transform: rotate3d(0, 0, 1, 5deg); }
  80% { transform: rotate3d(0, 0, 1, -5deg); }
  to  { transform: rotate3d(0, 0, 1, 0deg); }
}
@keyframes santy-tada {
  from       { transform: scale3d(1, 1, 1); }
  10%, 20%   { transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg); }
  30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }
  40%, 60%, 80%      { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }
  to  { transform: scale3d(1, 1, 1); }
}
@keyframes santy-wobble {
  from { transform: translate3d(0, 0, 0); }
  15%  { transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg); }
  30%  { transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg); }
  45%  { transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg); }
  60%  { transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg); }
  75%  { transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg); }
  to   { transform: translate3d(0, 0, 0); }
}
@keyframes santy-jelly {
  from, 11.1%, to { transform: translate3d(0, 0, 0); }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  33.3% { transform: skewX(6.25deg)  skewY(6.25deg); }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  66.6% { transform: skewX(-.78125deg) skewY(-.78125deg); }
  77.7% { transform: skewX(.390625deg) skewY(.390625deg); }
  88.8% { transform: skewX(-.1953125deg) skewY(-.1953125deg); }
}
@keyframes santy-heartbeat {
  from { transform: scale(1);    animation-timing-function: ease-out; }
  10%  { transform: scale(1.12); animation-timing-function: ease-in; }
  17%  { transform: scale(1.08); animation-timing-function: ease-out; }
  33%  { transform: scale(1.18); animation-timing-function: ease-in; }
  45%  { transform: scale(1);    animation-timing-function: ease-out; }
}

/* ── Fade In ── */
@keyframes santy-fade-in              { from { opacity: 0; } to { opacity: 1; } }
@keyframes santy-fade-in-from-top     { from { opacity: 0; transform: translate3d(0, -30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-from-bottom  { from { opacity: 0; transform: translate3d(0,  30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-from-left    { from { opacity: 0; transform: translate3d(-30px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-from-right   { from { opacity: 0; transform: translate3d( 30px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-top-left     { from { opacity: 0; transform: translate3d(-30px, -30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-top-right    { from { opacity: 0; transform: translate3d( 30px, -30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-bottom-left  { from { opacity: 0; transform: translate3d(-30px,  30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes santy-fade-in-bottom-right { from { opacity: 0; transform: translate3d( 30px,  30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }

/* ── Fade Out ── */
@keyframes santy-fade-out              { from { opacity: 1; } to { opacity: 0; } }
@keyframes santy-fade-out-to-top       { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(0, -30px, 0); } }
@keyframes santy-fade-out-to-bottom    { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(0,  30px, 0); } }
@keyframes santy-fade-out-to-left      { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(-30px, 0, 0); } }
@keyframes santy-fade-out-to-right     { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d( 30px, 0, 0); } }
@keyframes santy-fade-out-top-left     { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(-30px, -30px, 0); } }
@keyframes santy-fade-out-top-right    { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d( 30px, -30px, 0); } }
@keyframes santy-fade-out-bottom-left  { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d(-30px,  30px, 0); } }
@keyframes santy-fade-out-bottom-right { from { opacity: 1; transform: translate3d(0, 0, 0); } to { opacity: 0; transform: translate3d( 30px,  30px, 0); } }

/* ── Bounce In ── */
@keyframes santy-bounce-in {
  from,20%,40%,60%,80%,to { animation-timing-function: cubic-bezier(.215,.61,.355,1); }
  0%  { opacity: 0; transform: scale3d(.3, .3, .3); }
  20% { transform: scale3d(1.1, 1.1, 1.1); }
  40% { transform: scale3d(.9, .9, .9); }
  60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
  80% { transform: scale3d(.97, .97, .97); }
  to  { opacity: 1; transform: scale3d(1, 1, 1); }
}
@keyframes santy-bounce-in-from-top {
  from,60%,75%,90%,to { animation-timing-function: cubic-bezier(.215,.61,.355,1); }
  0%  { opacity: 0; transform: translate3d(0, -3000px, 0) scaleY(3); }
  60% { opacity: 1; transform: translate3d(0, 25px, 0) scaleY(.9); }
  75% { transform: translate3d(0, -10px, 0) scaleY(.95); }
  90% { transform: translate3d(0, 5px, 0) scaleY(.985); }
  to  { transform: translate3d(0, 0, 0); }
}
@keyframes santy-bounce-in-from-bottom {
  from,60%,75%,90%,to { animation-timing-function: cubic-bezier(.215,.61,.355,1); }
  0%  { opacity: 0; transform: translate3d(0, 3000px, 0) scaleY(5); }
  60% { opacity: 1; transform: translate3d(0, -20px, 0) scaleY(.9); }
  75% { transform: translate3d(0, 10px, 0) scaleY(.95); }
  90% { transform: translate3d(0, -5px, 0) scaleY(.985); }
  to  { transform: translate3d(0, 0, 0); }
}
@keyframes santy-bounce-in-from-left {
  from,60%,75%,90%,to { animation-timing-function: cubic-bezier(.215,.61,.355,1); }
  0%  { opacity: 0; transform: translate3d(-3000px, 0, 0) scaleX(3); }
  60% { opacity: 1; transform: translate3d(25px, 0, 0) scaleX(1); }
  75% { transform: translate3d(-10px, 0, 0) scaleX(.98); }
  90% { transform: translate3d(5px, 0, 0) scaleX(.995); }
  to  { transform: translate3d(0, 0, 0); }
}
@keyframes santy-bounce-in-from-right {
  from,60%,75%,90%,to { animation-timing-function: cubic-bezier(.215,.61,.355,1); }
  0%  { opacity: 0; transform: translate3d(3000px, 0, 0) scaleX(3); }
  60% { opacity: 1; transform: translate3d(-25px, 0, 0) scaleX(1); }
  75% { transform: translate3d(10px, 0, 0) scaleX(.98); }
  90% { transform: translate3d(-5px, 0, 0) scaleX(.995); }
  to  { transform: translate3d(0, 0, 0); }
}

/* ── Bounce Out ── */
@keyframes santy-bounce-out {
  20%     { transform: scale3d(.9, .9, .9); }
  50%,55% { opacity: 1; transform: scale3d(1.1, 1.1, 1.1); }
  to      { opacity: 0; transform: scale3d(.3, .3, .3); }
}
@keyframes santy-bounce-out-to-top {
  20%     { transform: translate3d(0, -10px, 0) scaleY(.985); }
  40%,45% { opacity: 1; transform: translate3d(0, 20px, 0) scaleY(.9); }
  to      { opacity: 0; transform: translate3d(0, -2000px, 0) scaleY(3); }
}
@keyframes santy-bounce-out-to-bottom {
  20%     { transform: translate3d(0, 10px, 0) scaleY(.985); }
  40%,45% { opacity: 1; transform: translate3d(0, -20px, 0) scaleY(.9); }
  to      { opacity: 0; transform: translate3d(0, 2000px, 0) scaleY(5); }
}
@keyframes santy-bounce-out-to-left {
  20% { opacity: 1; transform: translate3d(20px, 0, 0) scaleX(.9); }
  to  { opacity: 0; transform: translate3d(-2000px, 0, 0) scaleX(2); }
}
@keyframes santy-bounce-out-to-right {
  20% { opacity: 1; transform: translate3d(-20px, 0, 0) scaleX(.9); }
  to  { opacity: 0; transform: translate3d(2000px, 0, 0) scaleX(2); }
}

/* ── Slide In ── */
@keyframes santy-slide-in-from-top    { from { visibility: visible; transform: translate3d(0, -100%, 0); } to { transform: translate3d(0, 0, 0); } }
@keyframes santy-slide-in-from-bottom { from { visibility: visible; transform: translate3d(0,  100%, 0); } to { transform: translate3d(0, 0, 0); } }
@keyframes santy-slide-in-from-left   { from { visibility: visible; transform: translate3d(-100%, 0, 0); } to { transform: translate3d(0, 0, 0); } }
@keyframes santy-slide-in-from-right  { from { visibility: visible; transform: translate3d( 100%, 0, 0); } to { transform: translate3d(0, 0, 0); } }

/* ── Slide Out ── */
@keyframes santy-slide-out-to-top    { from { transform: translate3d(0, 0, 0); } to { visibility: hidden; transform: translate3d(0, -100%, 0); } }
@keyframes santy-slide-out-to-bottom { from { transform: translate3d(0, 0, 0); } to { visibility: hidden; transform: translate3d(0,  100%, 0); } }
@keyframes santy-slide-out-to-left   { from { transform: translate3d(0, 0, 0); } to { visibility: hidden; transform: translate3d(-100%, 0, 0); } }
@keyframes santy-slide-out-to-right  { from { transform: translate3d(0, 0, 0); } to { visibility: hidden; transform: translate3d( 100%, 0, 0); } }

/* ── Zoom In ── */
@keyframes santy-zoom-in { from { opacity: 0; transform: scale3d(.3, .3, .3); } 50% { opacity: 1; } }
@keyframes santy-zoom-in-from-top {
  from { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(0,-1000px,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
  60%  { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(0,60px,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
}
@keyframes santy-zoom-in-from-bottom {
  from { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(0,1000px,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
  60%  { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(0,-60px,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
}
@keyframes santy-zoom-in-from-left {
  from { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(-1000px,0,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
  60%  { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(10px,0,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
}
@keyframes santy-zoom-in-from-right {
  from { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(1000px,0,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
  60%  { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(-10px,0,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
}

/* ── Zoom Out ── */
@keyframes santy-zoom-out { from { opacity: 1; } 50% { opacity: 0; transform: scale3d(.3,.3,.3); } to { opacity: 0; } }
@keyframes santy-zoom-out-to-top {
  40% { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(0,60px,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
  to  { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(0,-2000px,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
}
@keyframes santy-zoom-out-to-bottom {
  40% { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(0,-60px,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
  to  { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(0,2000px,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
}
@keyframes santy-zoom-out-to-left {
  40% { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(42px,0,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
  to  { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(-2000px,0,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
}
@keyframes santy-zoom-out-to-right {
  40% { opacity: 1; transform: scale3d(.475,.475,.475) translate3d(-42px,0,0); animation-timing-function: cubic-bezier(.175,.885,.32,1); }
  to  { opacity: 0; transform: scale3d(.1,.1,.1) translate3d(2000px,0,0); animation-timing-function: cubic-bezier(.55,.055,.675,.19); }
}

/* ── Flip ── */
@keyframes santy-flip {
  from { transform: perspective(400px) scale3d(1,1,1) rotate3d(0,1,0,-360deg); animation-timing-function: ease-out; }
  40%  { transform: perspective(400px) scale3d(1,1,.5) translate3d(0,0,150px) rotate3d(0,1,0,-190deg); animation-timing-function: ease-out; }
  50%  { transform: perspective(400px) scale3d(1,1,.5) translate3d(0,0,150px) rotate3d(0,1,0,-170deg); animation-timing-function: ease-in; }
  80%  { transform: perspective(400px) scale3d(.95,1,1) rotate3d(0,1,0,0deg); animation-timing-function: ease-in; }
  to   { transform: perspective(400px) scale3d(1,1,1) rotate3d(0,1,0,0deg); animation-timing-function: ease-in; }
}
@keyframes santy-flip-in-x {
  from { transform: perspective(400px) rotate3d(1,0,0,90deg); animation-timing-function: ease-in; opacity: 0; }
  40%  { transform: perspective(400px) rotate3d(1,0,0,-20deg); animation-timing-function: ease-in; }
  60%  { transform: perspective(400px) rotate3d(1,0,0,10deg); opacity: 1; }
  80%  { transform: perspective(400px) rotate3d(1,0,0,-5deg); }
  to   { transform: perspective(400px); }
}
@keyframes santy-flip-in-y {
  from { transform: perspective(400px) rotate3d(0,1,0,90deg); animation-timing-function: ease-in; opacity: 0; }
  40%  { transform: perspective(400px) rotate3d(0,1,0,-20deg); animation-timing-function: ease-in; }
  60%  { transform: perspective(400px) rotate3d(0,1,0,10deg); opacity: 1; }
  80%  { transform: perspective(400px) rotate3d(0,1,0,-5deg); }
  to   { transform: perspective(400px); }
}
@keyframes santy-flip-out-x {
  from { transform: perspective(400px); }
  30%  { transform: perspective(400px) rotate3d(1,0,0,-20deg); opacity: 1; }
  to   { transform: perspective(400px) rotate3d(1,0,0,90deg); opacity: 0; }
}
@keyframes santy-flip-out-y {
  from { transform: perspective(400px); }
  30%  { transform: perspective(400px) rotate3d(0,1,0,-15deg); opacity: 1; }
  to   { transform: perspective(400px) rotate3d(0,1,0,90deg); opacity: 0; }
}

/* ── Rotate In ── */
@keyframes santy-rotate-in                   { from { transform: rotate3d(0,0,1,-200deg); opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }
@keyframes santy-rotate-in-from-top-left     { from { transform: rotate3d(0,0,1,-45deg);  opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }
@keyframes santy-rotate-in-from-top-right    { from { transform: rotate3d(0,0,1,45deg);   opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }
@keyframes santy-rotate-in-from-bottom-left  { from { transform: rotate3d(0,0,1,45deg);   opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }
@keyframes santy-rotate-in-from-bottom-right { from { transform: rotate3d(0,0,1,-90deg);  opacity: 0; } to { transform: translate3d(0,0,0); opacity: 1; } }

/* ── Rotate Out ── */
@keyframes santy-rotate-out                   { from { opacity: 1; } to { transform: rotate3d(0,0,1,200deg);  opacity: 0; } }
@keyframes santy-rotate-out-to-top-left       { from { opacity: 1; } to { transform: rotate3d(0,0,1,-45deg); opacity: 0; } }
@keyframes santy-rotate-out-to-top-right      { from { opacity: 1; } to { transform: rotate3d(0,0,1,90deg);  opacity: 0; } }
@keyframes santy-rotate-out-to-bottom-left    { from { opacity: 1; } to { transform: rotate3d(0,0,1,45deg);  opacity: 0; } }
@keyframes santy-rotate-out-to-bottom-right   { from { opacity: 1; } to { transform: rotate3d(0,0,1,-45deg); opacity: 0; } }

/* ── Back Entrances ── */
@keyframes santy-back-in-from-top    { 0% { transform: translateY(-1200px) scale(.7); opacity: .7; } 80% { transform: translateY(0) scale(.7); opacity: .7; } 100% { transform: scale(1); opacity: 1; } }
@keyframes santy-back-in-from-bottom { 0% { transform: translateY( 1200px) scale(.7); opacity: .7; } 80% { transform: translateY(0) scale(.7); opacity: .7; } 100% { transform: scale(1); opacity: 1; } }
@keyframes santy-back-in-from-left   { 0% { transform: translateX(-2000px) scale(.7); opacity: .7; } 80% { transform: translateX(0) scale(.7); opacity: .7; } 100% { transform: scale(1); opacity: 1; } }
@keyframes santy-back-in-from-right  { 0% { transform: translateX( 2000px) scale(.7); opacity: .7; } 80% { transform: translateX(0) scale(.7); opacity: .7; } 100% { transform: scale(1); opacity: 1; } }

/* ── Back Exits ── */
@keyframes santy-back-out-to-top    { 0% { transform: scale(1); opacity: 1; } 20% { transform: translateY(0)     scale(.7); opacity: .7; } 100% { transform: translateY(-700px) scale(.7); opacity: .7; } }
@keyframes santy-back-out-to-bottom { 0% { transform: scale(1); opacity: 1; } 20% { transform: translateY(0)     scale(.7); opacity: .7; } 100% { transform: translateY( 700px) scale(.7); opacity: .7; } }
@keyframes santy-back-out-to-left   { 0% { transform: scale(1); opacity: 1; } 20% { transform: translateX(0)     scale(.7); opacity: .7; } 100% { transform: translateX(-2000px) scale(.7); opacity: .7; } }
@keyframes santy-back-out-to-right  { 0% { transform: scale(1); opacity: 1; } 20% { transform: translateX(0)     scale(.7); opacity: .7; } 100% { transform: translateX( 2000px) scale(.7); opacity: .7; } }

/* ── Light Speed ── */
@keyframes santy-speed-in-from-left  { from { transform: translate3d(-100%,0,0) skewX(30deg); opacity: 0; } 60% { transform: skewX(-20deg); opacity: 1; } 80% { transform: skewX(5deg); } to { transform: translate3d(0,0,0); } }
@keyframes santy-speed-in-from-right { from { transform: translate3d(100%,0,0) skewX(-30deg); opacity: 0; } 60% { transform: skewX(20deg); opacity: 1; } 80% { transform: skewX(-5deg); } to { transform: translate3d(0,0,0); } }
@keyframes santy-speed-out-to-left   { from { opacity: 1; } to { transform: translate3d(-100%,0,0) skewX(-30deg); opacity: 0; } }
@keyframes santy-speed-out-to-right  { from { opacity: 1; } to { transform: translate3d(100%,0,0) skewX(30deg); opacity: 0; } }

/* ── Specials ── */
@keyframes santy-hinge {
  0%     { animation-timing-function: ease-in-out; }
  20%,60% { transform: rotate3d(0,0,1,80deg); animation-timing-function: ease-in-out; }
  40%,80% { transform: rotate3d(0,0,1,60deg); animation-timing-function: ease-in-out; opacity: 1; }
  to     { transform: translate3d(0,700px,0); opacity: 0; }
}
@keyframes santy-jack-in-box {
  from { opacity: 0; transform: scale(.1) rotate(30deg); }
  50%  { transform: rotate(-10deg); }
  70%  { transform: rotate(3deg); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes santy-roll-in  { from { opacity: 0; transform: translate3d(-100%,0,0) rotate3d(0,0,1,-120deg); } to { opacity: 1; transform: translate3d(0,0,0); } }
@keyframes santy-roll-out { from { opacity: 1; } to { opacity: 0; transform: translate3d(100%,0,0) rotate3d(0,0,1,120deg); } }
`;

module.exports = { ANIMATION_CSS };
