import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Column } from "./erd";

type CustomNode = Node<
    {
        label: string;
        columns?: Column[];
    }
>;

const CustomNode: React.FC<NodeProps<CustomNode>> = ({ data, type, id }) => {
    return (
        <div
            className={`
                ${type === "entity" ? "border-2 border-green-500 bg-green-50 rounded-md p-3" : ""}
                ${type === "attribute" ? "border border-dashed border-blue-500 bg-blue-50 rounded-full p-3" : ""}
                ${type === "relationship" ? "border-2 border-orange-500 bg-orange-50 rounded-lg p-3" : ""}
            `}
        >
            {type === "entity" && 
                <>
                    <div className="font-bold text-center mb-2">{data.label}</div>
                    <div className="border-t border-gray-300 pt-2">
                        {data.columns?.map((column) => (
                            <div key={column.id} className="flex items-center justify-between py-1">
                                <div>
                                    {column.name} ({column.dataType})
                                    {column.isPrimaryKey && <span className="text-red-500"> PK</span>}
                                    {column.isForeignKey && <span className="text-blue-500"> FK</span>}
                                </div>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`${id}-${column.id}-source`}
                                    className="w-2 h-2"
                                />
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`${id}-${column.id}-target`}
                                    className="w-2 h-2"
                                />
                            </div>
                        ))}
                    </div>
                </>
            }
            {type !== "entity" &&
                <>
                    <Handle type="target" position={Position.Top} />
                    <div>{data.label}</div>
                    <Handle type="source" position={Position.Bottom} />
                </>
            }
        </div>
    );
};

export default CustomNode;