/**
 * Resolution-independent platform marks.
 *
 * The Android robot used to be assembled from absolutely positioned <i>/<b>
 * elements with hard-coded pixel offsets. Every consumer that resized it
 * (`.mobile-boot-options .android-mark`, `.android-boot-mark`) only resized the
 * *box* — the glyph inside kept its original pixel geometry and then got
 * `transform: scale()`d around the box centre, so the robot drifted out of the
 * middle of its container (up to ~29px on the Android boot splash).
 *
 * It is now a single SVG whose ink fills the viewBox exactly, so it is
 * pixel-perfectly centred at any size and inherits `currentColor`.
 */
export function AndroidMark({ className = '', label = 'Android' }: { className?: string; label?: string }) {
  return (
    <svg className={`android-mark ${className}`.trim()} viewBox="0 0 40 46" role="img" aria-label={label} focusable="false">
      <g fill="currentColor">
        {/* head + eye cut-outs (evenodd punches the eyes through to the backdrop) */}
        <path
          fillRule="evenodd"
          d="M4 20a16 16 0 0 1 32 0Z M14 11.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 1 0 0-3.6Z M26 11.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 1 0 0-3.6Z"
        />
        <rect x="4" y="22" width="32" height="18" rx="3" />
        <rect x="0" y="22" width="3.4" height="14" rx="1.7" />
        <rect x="36.6" y="22" width="3.4" height="14" rx="1.7" />
        <rect x="10.5" y="38" width="5.4" height="8" rx="2.7" />
        <rect x="24.1" y="38" width="5.4" height="8" rx="2.7" />
      </g>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M11 1 15 8" />
        <path d="M29 1 25 8" />
      </g>
    </svg>
  )
}
