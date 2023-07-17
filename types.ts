export interface Pt {
  x: number;
  y: number;
}

export interface Ellipse {
  center: Pt;
  rx: number;
  ry: number;
}

export interface FunnelDef {
  id: string;
  axialPath: Pt[];
  ellipses: Ellipse[];
}
