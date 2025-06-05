export type ERNodeType = "table";

export type Column = {
    id: string;
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
};

export type ERNode = {
    id: string;
    type: ERNodeType;
    data: {
        label: string;
        columns?: Column[];
    };
    position: { x: number; y: number; };
};

export type EREdge = {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    label?: string;
};