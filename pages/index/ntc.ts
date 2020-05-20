/*

+-----------------------------------------------------------------+
|     Created by Chirag Mehta - http://chir.ag/projects/ntc       |
|   Modified by K. Chantrachirathumrong - https://kamontat.net    |
|-----------------------------------------------------------------|
|               ntc js (Name that Color JavaScript)               |
+-----------------------------------------------------------------+

All the functions, code, lists etc. have been written specifically
for the Name that Color JavaScript by Chirag Mehta unless otherwise
specified.

This script is released under the: Creative Commons License:
Attribution 2.5 http://creativecommons.org/licenses/by/2.5/

*/

import res from "./ntc.json";

interface Resource {
  index: number;
  hex: string;
  name: string;
  rgb: {
    red: number;
    green: number;
    blue: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
}

export interface NameResult {
  valid: boolean;
  name: string;
  hex: string;
  raw: string;
}

export const ntcToName = (name: string, hex?: string): NameResult => {
  return {
    valid: true,
    name: name,
    hex: hex ?? name,
    raw: hex ?? name,
  };
};

export class NTC {
  private resources: Resource[];

  constructor(private dead: boolean = false) {
    this.resources = [];

    this.resources = res.names.map((name, i) => {
      const hex = "#" + name[0];

      const rgb = this.rgb(hex);
      const hsl = this.hsl(hex);

      return {
        index: i,
        name: name[1],
        hex: hex,
        rgb: {
          red: rgb[0],
          green: rgb[1],
          blue: rgb[2],
        },
        hsl: {
          h: hsl[0],
          s: hsl[1],
          l: hsl[2],
        },
      };
    });
  }

  name(_color: string): NameResult {
    let color = _color.toUpperCase();
    if (color.length < 3 || color.length > 7) {
      if (this.dead) throw new Error(`Invalid color name: ${color}`);
      else return { name: color, valid: false, hex: color, raw: color };
    }

    if (color.length % 3 == 0) color = `#${color}`;
    if (color.length == 4)
      color =
        "#" +
        color.substr(1, 1) +
        color.substr(1, 1) +
        color.substr(2, 1) +
        color.substr(2, 1) +
        color.substr(3, 1) +
        color.substr(3, 1);

    const rgb = this.rgb(color);
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    const hsl = this.hsl(color);
    const h = hsl[0];
    const s = hsl[1];
    const l = hsl[2];

    let df = -1;
    let cl = -1;

    for (const res of this.resources) {
      if (color === "#" + res.hex) return { name: res.name, hex: res.hex, raw: color, valid: true };

      const ndf1 = Math.pow(r - res.rgb.red, 2) + Math.pow(g - res.rgb.green, 2) + Math.pow(b - res.rgb.blue, 2);
      const ndf2 = Math.pow(h - res.hsl.h, 2) + Math.pow(s - res.hsl.s, 2) + Math.pow(l - res.hsl.l, 2);
      const ndf = ndf1 + ndf2 * 2;
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = res.index;
      }
    }

    if (cl < 0) {
      if (this.dead) throw new Error(`Invalid color name: ${color}`);
      else return { name: color, valid: false, hex: color, raw: color };
    }
    return {
      valid: false,
      name: this.resources[cl].name,
      hex: this.resources[cl].hex,
      raw: color,
    };
  }

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  private rgb(hex: string) {
    return [
      parseInt("0x" + hex.substring(1, 3)),
      parseInt("0x" + hex.substring(3, 5)),
      parseInt("0x" + hex.substring(5, 7)),
    ];
  }

  // adopted from: Farbtastic 1.2
  // http://acko.net/dev/farbtastic
  private hsl(hex: string) {
    const rgb = this.rgb(hex).map((v) => v / 255);

    const min = Math.min(rgb[0], Math.min(rgb[1], rgb[2]));
    const max = Math.max(rgb[0], Math.max(rgb[1], rgb[2]));
    const delta = max - min;
    const l = (min + max) / 2;
    const s = l > 0 && l < 1 ? delta / (l < 0.5 ? 2 * l : 2 - 2 * l) : 0;
    let h = 0;
    if (delta > 0) {
      if (max == rgb[0] && max != rgb[1]) h += (rgb[1] - rgb[2]) / delta;
      if (max == rgb[1] && max != rgb[2]) h += 2 + (rgb[2] - rgb[0]) / delta;
      if (max == rgb[2] && max != rgb[0]) h += 4 + (rgb[0] - rgb[1]) / delta;
      h /= 6;
    }

    return [h * 255, s * 255, l * 255];
  }
}
