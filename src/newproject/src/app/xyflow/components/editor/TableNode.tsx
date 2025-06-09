import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import React from "react";
import { Column } from "../../types/erd";

type TableNode = Node<
    {
        label: string;
        columns: Column[];
    }
>;

const TableNode: React.FC<NodeProps<TableNode>> = ({ id, data }) => {
    return (
        <div className="border-2 border-blue-500 bg-blue-50 rounded-md py-4 w-64 shadow-md">
            <div className="text-lg font-bold mb-2 border-b border-gray-300 pb-1 px-4">
                {data.label || "Unnamed Table"}
            </div>
            <div className="space-y-2">
                {data.columns.map((column) => (
                    <div key={column.id} className="flex items-center justify-between relative py-1">
                        <div className="px-4">
                            {column.name} ({column.type})
                            {column.isPrimaryKey && <span className="text-red-500"> PK</span>}
                            {column.isForeignKey && <span className="text-blue-500"> FK</span>}
                        </div>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={column.id}
                            className="w-3 h-3 bg-blue-500 rounded-full"
                        />
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={column.id}
                            className="w-3 h-3 bg-blue-500 rounded-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableNode;