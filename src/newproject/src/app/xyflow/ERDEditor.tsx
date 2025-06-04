"use client";

import React, { useCallback, useRef } from "react";
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
import CustomNode from "./CustomNode";
import { ERNode, EREdge, ERNodeType } from "./erd";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
    entity: CustomNode,
    attribute: CustomNode,
    relationship: CustomNode,
};

const ERDEditor: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<ERNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EREdge>([]);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge({
            ...params,
            id: `edge-${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
            label: "related",
        }, eds));
    }, [setEdges]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("application/reactflow") as ERNodeType;

        if (!type) {
            return;
        }

        const position = screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
        });

        const newNode: ERNode = {
            id: `${type}-${uuidv4()}`,
            type,
            position,
            data: {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                columns: type === "entity" ? [] : undefined,
            },
        };

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);

    const onAddColumn = useCallback(
        (nodeId: string, column: { name: string; dataType: string; isPrimaryKey?: boolean; isForeignKey?: boolean }) => {
            setNodes((nds) =>
                nds.map((node) =>
                node.id === nodeId && node.type === "entity"
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            columns: [...(node.data.columns || []), { ...column, id: uuidv4() }],
                        },
                    }
                    : node
                )
            );
        },
        [setNodes]
    );

    return (
        <div className="flex h-screen">
            <Sidebar onAddColumn={onAddColumn} nodes={nodes} />
            <div className="flex-1" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
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