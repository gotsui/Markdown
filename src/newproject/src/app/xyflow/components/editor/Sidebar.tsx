import React from "react";
import { ERNode, EREdge, Column, ERNodeType } from "../../types/erd";
import SaveButton from "./SaveButton";
import TableSelector from "./TableSelector";
import TableAdder from "./TableAdder";
import TableEditor from "./TableEditor";
import RelationEditor from "./RelationEditor";

type SidebarProps = {
    nodes: ERNode[];
    edges: EREdge[];
    selectedNodeId: string | null;
    selectedTableIds: Set<string>;
    setNodes: (nodes: ERNode[] | ((prev: ERNode[]) => ERNode[])) => void;
    setEdges: (edges: EREdge[] | ((prev: EREdge[]) => EREdge[])) => void;
    saveData: () => Promise<void>;
    toggleTableSelection: (tableId: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
    nodes,
    edges,
    selectedNodeId,
    selectedTableIds,
    setNodes,
    setEdges,
    saveData,
    toggleTableSelection,
}) => {
    const selectedNode = nodes.find((node) => node.id === selectedNodeId);

    const updateTableName = (name: string) => {
        if (!selectedNode) {
            return;
        }

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id ? { ...n, data: { ...n.data, label: name } } : n
            )
        );
    };

    const addColumn = (column: Column) => {
        if (!selectedNode) {
            return;
        }

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id
                    ? { ...n, data: { ...n.data, columns: [...n.data.columns, column] } }
                    : n
            )
        );
    };

    const updateColumn = (updatedColumn: Column) => {
        if (!selectedNode) {
            return;
        }

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id
                    ? {
                        ...n,
                        data: {
                            ...n.data,
                            columns: n.data.columns.map((col) =>
                                col.id === updatedColumn.id ? updatedColumn : col
                            ),
                        },
                    }
                    : n
                )
        );
    };

    const removeColumn = (columnId: string) => {
        if (!selectedNode) {
            return;
        }

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id
                    ? {
                        ...n,
                        data: { ...n.data, columns: n.data.columns.filter((col) => col.id !== columnId) },
                    }
                    : n
                )
        );
        setEdges((eds) => eds.filter((e) => e.sourceHandle !== columnId && e.targetHandle !== columnId));
    };

    const updateEdgeLabel = (edgeId: string, label: string) => {
        setEdges((eds) => eds.map((e) => (e.id === edgeId ? { ...e, label } : e)));
    };

    const handleDragStart = (event: React.DragEvent, nodeType: ERNodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="w-80 p-4 border-r border-gray-200 bg-gray-50 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">ER図エディタ</h3>
            <SaveButton onSave={saveData} />
            <TableSelector
                nodes={nodes}
                selectedTableIds={selectedTableIds}
                toggleTableSelection={toggleTableSelection}
            />
            <TableAdder onDragStart={handleDragStart} />
            <TableEditor
                node={selectedNode || null}
                updateTableName={updateTableName}
                addColumn={addColumn}
                updateColumn={updateColumn}
                removeColumn={removeColumn}
            />
            <RelationEditor nodes={nodes} edges={edges} updateEdgeLabel={updateEdgeLabel} />
        </aside>
    );
};

export default Sidebar;