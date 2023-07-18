export interface Pt {
  x: number;
  y: number;
}

export interface Ring {
  center: Pt;
  rx: number;
  ry: number;
  strokeWidth: number;
}

export interface FunnelDef {
  id: string;
  axialPath: Pt[];
  rings: Ring[];
}
