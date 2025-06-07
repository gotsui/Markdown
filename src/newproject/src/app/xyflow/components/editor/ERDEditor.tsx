"use client";

import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    Background,
    useReactFlow,
    Connection,
    Node,
} from "@xyflow/react";
import Sidebar from "./Sidebar";
import TableNode from "./TableNode";
import { ERNode, EREdge, ERNodeType } from "../../types/erd";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
    table: TableNode,
};

const ERDEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<ERNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EREdge>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(new Set());
    const { screenToFlowPosition } = useReactFlow();

    // データの読み込み
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/erd");
                const data = await response.json();

                if (data.nodes && data.edges) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                    setSelectedTableIds(new Set(data.nodes.map((n: ERNode) => n.id)));
                }
            } catch (error) {
                console.error("Error fetching ERD data:", error);
            }
        };

        fetchData();
    }, [setNodes, setEdges]);

    // データの保存
    const saveData = useCallback(async () => {
        try {
            const response = await fetch("/api/erd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error("Failed to save data");
            }

            alert("Data saved successfully");
        } catch (error) {
            console.error("Error saving ERD data:", error);
            alert("Failed to save data");
        }
    }, [nodes, edges]);

    // 表示フィルタリング
    const filteredNodes = useMemo(() => {
        if (selectedTableIds.size === 0) {
            return nodes;
        }

        return nodes.filter((node) => selectedTableIds.has(node.id));
    }, [nodes, selectedTableIds]);

    const filteredEdges = useMemo(() => {
        if (selectedTableIds.size === 0) {
            return edges;
        }

        return edges.filter(
            (edge) => selectedTableIds.has(edge.source) && selectedTableIds.has(edge.target)
        );
    }, [edges, selectedTableIds]);

    const toggleTableSelection = useCallback((tableId: string) => {
        setSelectedTableIds((prev) => {
            const nextSet = new Set(prev);

            if (nextSet.has(tableId)) {
                nextSet.delete(tableId);
            } else {
                nextSet.add(tableId);
            }
            return nextSet;
        });
    }, []);

    const onConnect = useCallback((params: Connection) => {
        if (!params.sourceHandle || !params.targetHandle) {
            return;
        }

        setEdges((eds) =>
            addEdge(
                {
                    ...params,
                    id: `edge-${params.sourceHandle}-${params.targetHandle}`,
                    sourceHandle: params.sourceHandle,
                    targetHandle: params.targetHandle,
                    label: "1:N",
                },
                eds
            )
        );
    }, [setEdges]);

    const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: EREdge) => {
        const nextLabel = prompt("Enter relation type (e.g., 1:N, 1:1, N:N):", edge.label);

        if (nextLabel) {
            setEdges((eds) => eds.map((e) => (e.id === edge.id ? { ...e, label: nextLabel } : e)));
        }
    }, [setEdges]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("application/reactflow") as ERNodeType;

        if (type !== "table") {
            return;
        }

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const nextNode: ERNode = {
            id: `table-${uuidv4()}`,
            type,
            position,
            data: { label: "New Table", columns: [] },
        };

        setNodes((nds) => nds.concat(nextNode));
        setSelectedNodeId(nextNode.id);
        setSelectedTableIds((prev) => new Set(prev).add(nextNode.id));
    }, [screenToFlowPosition, setNodes]);

    return (
        <div className="flex h-screen">
            <Sidebar
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
                selectedNodeId={selectedNodeId}
                selectedTableIds={selectedTableIds}
                saveData={saveData}
                toggleTableSelection={toggleTableSelection}
            />
            <div className="flex-1" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={filteredNodes}
                    edges={filteredEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeDoubleClick={onEdgeDoubleClick}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

export default ERDEditor;