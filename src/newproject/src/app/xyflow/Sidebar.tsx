import React, { useState } from "react";
import { Column, EREdge, ERNode, ERNodeType } from "./erd";

type SidebarProps = {
    nodes: ERNode[];
    edges: EREdge[];
    setNodes: React.Dispatch<React.SetStateAction<ERNode[]>>;
    setEdges: React.Dispatch<React.SetStateAction<EREdge[]>>;
    selectedNodeId: string | null;
    saveData: () => Promise<void>;
};

const Sidebar: React.FC<SidebarProps> = ({ nodes, edges, setNodes, setEdges, selectedNodeId, saveData }) => {
    const selectedNode = nodes.find((node) => node.id === selectedNodeId);
    const [newColumn, setNewColumn] = useState({ name: "", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false });
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
    const [editColumn, setEditColumn] = useState<Column | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const onDragStart = (e: React.DragEvent, nodeType: ERNodeType) => {
        e.dataTransfer.setData("application/reactflow", nodeType);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedNode) {
            return;
        }

        setNodes((nds) => nds.map(
            (n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n
        ));
    };

    const addColumn = () => {
        if (!newColumn.name || !selectedNode) {
            return;
        }

        const idNum = selectedNode.data.columns ? selectedNode.data.columns.length : 1;
        const columns = selectedNode.data.columns ? selectedNode.data.columns : [];

        const columnId = `${selectedNode.id}-col${idNum}`;
        const nextColumns = [...columns, { ...newColumn, id: columnId}];

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id ? { ...n, data: { ...n.data, columns: nextColumns } } : n
            )
        );
        setNewColumn({ name: "", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false });
        setIsFormVisible(false);
    };

    const startEditingColumn = (column: Column) => {
        setEditingColumnId(column.id);
        setEditColumn({ ...column });
    };

    const saveEditedColumn = () => {
        if (!editColumn || !editingColumnId || !selectedNode) {
            return;
        }

        const columns = selectedNode.data.columns ? selectedNode.data.columns : [];
        const nextColumns = columns.map((col) =>
            col.id === editingColumnId ? { ...editColumn } : col
        );

        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id ? { ...n, ddata: { ...n.data, columns: nextColumns } } : n
            )
        );
        setEditingColumnId(null);
        setEditColumn(null);
    };

    const removeColumn = (columnId: string) => {
        if (!selectedNode) {
            return;
        }

        const columns = selectedNode.data.columns ? selectedNode.data.columns : [];
        const nextColumns = columns.filter((col) => col.id !== columnId);
        setNodes((nds) =>
            nds.map((n) =>
                n.id === selectedNode.id ? { ...n, ddata: { ...n.data, columns: nextColumns } } : n
            )
        );
        setEdges((eds) => eds.filter((e) => e.sourceHandle !== columnId && e.targetHandle !== columnId));
    };

    const handleEdgeLabelChange = (edgeId: string, newLabel: string) => {
        setEdges((eds) => eds.map((e) => (e.id === edgeId ? { ...e, label: newLabel } : e)));
    };

    return (
        <aside className="w-80 p-4 border-r border-gray-200 bg-gray-50 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">ERD Editor</h3>

            {/* 保存ボタン */}
            <div className="mb-4">
                <button
                    onClick={saveData}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                >
                    Save ERD
                </button>
            </div>

            {/* テーブル追加 */}
            <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Add Table</h4>
                <div
                    className="p-3 bg-gray-100 rounded-md cursor-grab hover:bg-gray-200 transition"
                    draggable
                    onDragStart={(event) => onDragStart(event, "table")}
                >
                    Table
                </div>
            </div>

            {/* 選択したテーブルの編集 */}
            {selectedNode && (
                <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Table: {selectedNode.data.label}</h4>
                    <input
                        type="text"
                        value={selectedNode.data.label}
                        onChange={handleTableNameChange}
                        className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 mb-2"
                        placeholder="Table Name"
                    />
                    <h5 className="text-sm font-medium mb-2">Columns</h5>
                    <div className="space-y-2">
                        {selectedNode.data.columns && selectedNode.data.columns.map((column) => (
                            <div key={column.id} className="flex items-center justify-between">
                                {editingColumnId === column.id ? (
                                    <div className="flex flex-col w-full space-y-2">
                                        <input
                                            type="text"
                                            value={editColumn?.name || ""}
                                            onChange={(e) =>
                                                setEditColumn((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                            }
                                            className="w-full p-1 border rounded focus:outline-none focus:border-blue-500"
                                        />
                                        <select
                                            value={editColumn?.type || "VARCHAR"}
                                            onChange={(e) =>
                                                setEditColumn((prev) => (prev ? { ...prev, type: e.target.value } : null))
                                            }
                                            className="w-full p-1 border rounded"
                                        >
                                            <option value="VARCHAR">VARCHAR</option>
                                            <option value="INT">INT</option>
                                            <option value="BOOLEAN">BOOLEAN</option>
                                        </select>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editColumn?.isPrimaryKey || false}
                                                onChange={(e) =>
                                                    setEditColumn((prev) =>
                                                        prev ? { ...prev, isPrimaryKey: e.target.checked } : null
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            Primary Key
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editColumn?.isForeignKey || false}
                                                onChange={(e) =>
                                                    setEditColumn((prev) =>
                                                        prev ? { ...prev, isForeignKey: e.target.checked } : null
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            Foreign Key
                                        </label>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={saveEditedColumn}
                                                className="flex-1 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingColumnId(null)}
                                                className="flex-1 bg-gray-300 text-gray-800 p-1 rounded hover:bg-gray-400 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            {column.name} ({column.type})
                                            {column.isPrimaryKey && <span className="text-red-500"> PK</span>}
                                            {column.isForeignKey && <span className="text-blue-500"> FK</span>}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => startEditingColumn(column)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => removeColumn(column.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition mt-2"
                        >
                            Add Column
                        </button>
                    )}
                    {isFormVisible && (
                        <div className="mt-2 space-y-2">
                            <input
                                type="text"
                                value={newColumn.name}
                                onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                                placeholder="Column Name"
                                className="w-full p-1 border rounded focus:outline-none focus:border-blue-500"
                            />
                            <select
                                value={newColumn.type}
                                onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
                                className="w-full p-1 border rounded"
                            >
                                <option value="VARCHAR">VARCHAR</option>
                                <option value="INT">INT</option>
                                <option value="BOOLEAN">BOOLEAN</option>
                            </select>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newColumn.isPrimaryKey}
                                    onChange={(e) => setNewColumn({ ...newColumn, isPrimaryKey: e.target.checked })}
                                    className="mr-2"
                                />
                                Primary Key
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newColumn.isForeignKey}
                                    onChange={(e) => setNewColumn({ ...newColumn, isForeignKey: e.target.checked })}
                                    className="mr-2"
                                />
                                Foreign Key
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={addColumn}
                                    className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsFormVisible(false)}
                                    className="flex-1 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* エッジ（リレーション）の編集 */}
            <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Relations</h4>
                {edges.length === 0 && <p className="text-gray-500">No relations</p>}
                {edges.map((edge) => {
                    const sourceNode = nodes.find((n) => n.id === edge.source);
                    const targetNode = nodes.find((n) => n.id === edge.target);
                    const sourceColumn = sourceNode?.data.columns ? sourceNode.data.columns.find((col) => col.id === edge.sourceHandle) : null;
                    const targetColumn = targetNode?.data.columns ? targetNode.data.columns.find((col) => col.id === edge.targetHandle) : null;

                    return (
                        <div key={edge.id} className="flex items-center justify-between mb-2">
                            <span>
                                {sourceNode?.data.label}.{sourceColumn?.name} → {targetNode?.data.label}.
                                {targetColumn?.name}
                            </span>
                            <input
                                type="text"
                                value={edge.label || ""}
                                onChange={(e) => handleEdgeLabelChange(edge.id, e.target.value)}
                                className="w-20 p-1 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="1:N"
                            />
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;