import { EREdge, ERNode } from "../../types/erd";

type RelationEditorProps = {
    nodes: ERNode[];
    edges: EREdge[];
    updateEdgeLabel: (edgeId: string, label: string) => void;
};

const RelationEditor: React.FC<RelationEditorProps> = ({
    nodes,
    edges,
    updateEdgeLabel,
}) => {
    return (
        <div className="mb-4">
            <h4 className="text-md font-medium mb-2">リレーション</h4>
            {edges.length === 0 && <p className="text-gray-500">No relations</p>}
            {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                const sourceColumn = sourceNode?.data.columns.find((col) => col.id === edge.sourceHandle);
                const targetColumn = targetNode?.data.columns.find((col) => col.id === edge.targetHandle);

                return (
                    <div key={edge.id} className="flex items-center justify-between mb-2">
                        <span>
                            {sourceNode?.data.label || "Unknown"}.{sourceColumn?.name || "Unknown"}
                            -
                            {targetNode?.data.label || "Unknown"}.{targetColumn?.name || "Unknown"}
                        </span>
                        <input
                            type="text"
                            value={edge.label || ""}
                            onChange={(e) => updateEdgeLabel(edge.id, e.target.value)}
                            className="
                                w-20 p-1 border rounded
                                focus:outline-none focus:border-blue-500
                            "
                            placeholder="1:N"
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default RelationEditor;