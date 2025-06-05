"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    Background,
    useReactFlow,
    Connection,
} from "@xyflow/react";
import Sidebar from "./Sidebar";
import { ERNode, EREdge, ERNodeType } from "./erd";
import { v4 as uuidv4 } from "uuid";
import TableNode from "./TableNode";

const nodeTypes = {
    table: TableNode,
};

const ERDEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<ERNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EREdge>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const { screenToFlowPosition } = useReactFlow();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/erd");
                const data = await response.json();

                if (data.nodes && data.edges) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                }
            } catch (error) {
                console.error("Error fetching ERD data:", error);
            }
        };

        fetchData();
    }, [setNodes, setEdges]);

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

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge({
            ...params,
            id: `edge-${params.sourceHandle}-${params.targetHandle}`,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
            label: "1:N",
        }, eds));
    }, [setEdges]);

    const onNodeClick = useCallback((e: React.MouseEvent, node: ERNode) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("application/reactflow") as ERNodeType;

        if (type !== "table") {
            return;
        }

        const position = screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
        });

        const newNode: ERNode = {
            id: `table-${uuidv4()}`,
            type,
            position,
            data: { label: "New Table", columns: [] },
        };

        setNodes((nds) => nds.concat(newNode));
        setSelectedNodeId(newNode.id);
    }, [screenToFlowPosition, setNodes]);

    return (
        <div className="flex h-screen">
            <Sidebar
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
                selectedNodeId={selectedNodeId}
                saveData={saveData}
            />
            <div className="flex-1" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
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