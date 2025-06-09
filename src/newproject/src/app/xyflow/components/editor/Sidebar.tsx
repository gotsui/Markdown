"use client";

import React, { useState } from "react";
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
    saveData: (name: string) => Promise<void>;
    loadData: (name: string) => Promise<void>;
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
    loadData,
    toggleTableSelection,
}) => {
    const [openPanels, setOpenPanels] = useState({
        save: false,
        tableSelector: false,
        tableAdder: false,
        tableEditor: false,
        relationEditor: false,
    });
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

    const togglePanel = (panel: keyof typeof openPanels) => {
        setOpenPanels((prev) => ({ ...prev, [panel]: !prev[panel] }));
    };

    return (
        <aside className="w-80 p-4 border-r border-gray-200 bg-gray-50 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">ER図エディタ</h3>
            <div>
                <button
                    onClick={() => togglePanel("save")}
                    className="
                        w-full flex justify-between items-center p-2
                        bg-pink-500 text-white rounded hover:bg-pink-600
                    "
                >
                    <span>保存・読み込み</span>
                    <span>{openPanels.save ? "▲" : "▼"}</span>
                </button>
                {openPanels.save && (
                    <div className="p-2 bg-pink-100 rounded">
                        <SaveButton
                            onSave={saveData}
                            onLoad={loadData}
                        />
                    </div>
                )}
            </div>
            <div>
                <button
                    onClick={() => togglePanel("tableSelector")}
                    className="
                        w-full flex justify-between items-center p-2
                        bg-blue-500 text-white rounded hover:bg-blue-600
                    "
                >
                    <span>テーブル選択</span>
                    <span>{openPanels.tableSelector ? "▲" : "▼"}</span>
                </button>
                {openPanels.tableSelector && (
                    <div className="p-2 bg-blue-100 rounded">
                        <TableSelector
                            nodes={nodes}
                            selectedTableIds={selectedTableIds}
                            toggleTableSelection={toggleTableSelection}
                        />
                    </div>
                )}
            </div>
            <div>
                <button
                    onClick={() => togglePanel("tableAdder")}
                    className="
                        w-full flex justify-between items-center p-2
                        bg-violet-500 text-white rounded hover:bg-violet-600
                    "
                >
                    <span>テーブル追加</span>
                    <span>{openPanels.tableAdder ? "▲" : "▼"}</span>
                </button>
                {openPanels.tableAdder && (
                    <div className="p-2 bg-violet-100 rounded">
                        <TableAdder onDragStart={handleDragStart} />
                    </div>
                )}
            </div>
            <div>
                <button
                    onClick={() => togglePanel("tableEditor")}
                    className="
                        w-full flex justify-between items-center p-2
                        bg-yellow-500 text-white rounded hover:bg-yellow-600
                    "
                >
                    <span>テーブル編集</span>
                    <span>{openPanels.tableEditor ? "▲" : "▼"}</span>
                </button>
                {openPanels.tableEditor && (
                    <div className="p-2 bg-yellow-100 rounded">
                        {selectedNode ? (
                            <TableEditor
                                node={selectedNode || null}
                                updateTableName={updateTableName}
                                addColumn={addColumn}
                                updateColumn={updateColumn}
                                removeColumn={removeColumn}
                            />
                        ) : (
                            <span>テーブルを選択してください</span>
                        )}
                    </div>
                )}
            </div>
            <div>
                <button
                    onClick={() => togglePanel("relationEditor")}
                    className="
                        w-full flex justify-between items-center p-2
                        bg-orange-500 text-white rounded hover:bg-orange-600
                    "
                >
                    <span>リレーション編集</span>
                    <span>{openPanels.relationEditor ? "▲" : "▼"}</span>
                </button>
                {openPanels.relationEditor && (
                    <div className="p-2 bg-orange-100 rounded">
                        <RelationEditor nodes={nodes} edges={edges} updateEdgeLabel={updateEdgeLabel} />
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;