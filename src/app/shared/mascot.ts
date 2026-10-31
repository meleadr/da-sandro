import { Component } from '@angular/core';

@Component({
  selector: 'app-mascot',
  host: { class: 'block' },
  template: `
    <svg
      viewBox="0 0 120 120"
      class="size-full origin-[50%_90%] animate-balance drop-shadow-[4px_5px_0_rgb(58_36_19_/_0.55)] motion-reduce:animate-none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 26 Q60 2 108 26 L62 114 Q60 118 58 114 Z"
        fill="#F9C22E"
        stroke="#F9E7BE"
        stroke-width="6"
        stroke-linejoin="round"
      />
      <path
        d="M12 26 Q60 2 108 26 L100 40 Q60 20 20 40 Z"
        fill="#F07C12"
        stroke="#3A2413"
        stroke-width="3"
      />
      <circle cx="44" cy="74" r="7" fill="#D8401F" stroke="#3A2413" stroke-width="2.5" />
      <circle cx="69" cy="84" r="5.5" fill="#D8401F" stroke="#3A2413" stroke-width="2.5" />
      <rect x="29" y="40" width="26" height="17" rx="5" fill="#3A2413" />
      <rect x="65" y="40" width="26" height="17" rx="5" fill="#3A2413" />
      <rect x="53" y="45" width="14" height="4" fill="#3A2413" />
      <path
        d="M51 62 Q60 72 69 62"
        fill="#fff"
        stroke="#3A2413"
        stroke-width="3"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class Mascot {}
