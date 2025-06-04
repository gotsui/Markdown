import React from "react";
import { ERNode, ERNodeType } from "./erd";

type SidebarProps = {
    onAddColumn: (nodeId: string, column: { name: string; dataType: string; isPrimaryKey?: boolean; isForeignKey?: boolean }) => void;
    nodes: ERNode[];
};

const Sidebar: React.FC<SidebarProps> = ({ onAddColumn, nodes }) => {
    const onDragStart = (e: React.DragEvent, nodeType: ERNodeType) => {
        e.dataTransfer.setData("application/reactflow", nodeType);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleAddColumn = () => {
        const name = prompt('Enter column name:') || 'new_column';
        const dataType = prompt('Enter data type (e.g., VARCHAR, INT):') || 'VARCHAR';
        const isPrimaryKey = confirm('Is this a primary key?');
        const isForeignKey = confirm('Is this a foreign key?');
        return { name, dataType, isPrimaryKey, isForeignKey };
    };

    const handleSelectEntity = (nodeId: string) => {
        const column = handleAddColumn();

        if (column) {
            onAddColumn(nodeId, column);
        }
    }

    return (
        <aside className="w-64 p-4 border-r border-gray-200 bg-gray-50 h-full">
            <h3 className="text-lg font-semibold mb-4">ERD Components</h3>
            <div
                className="p-3 m-2 bg-gray-100 rounded-md cursor-grab hover:bg-gray-200 transition"
                draggable
                onDragStart={(e) => onDragStart(e, "entity")}
            >
                Entity
            </div>
            <div
                className="p-3 m-2 bg-gray-100 rounded-md cursor-grab hover:bg-gray-200 transition"
                draggable
                onDragStart={(e) => onDragStart(e, "attribute")}
            >
                Attribute
            </div>
            <div
                className="p-3 m-2 bg-gray-100 rounded-md cursor-grab hover:bg-gray-200 transition"
                draggable
                onDragStart={(e) => onDragStart(e, "relationship")}
            >
                Relationship
            </div>
            <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Entityにカラムを追加</h4>
                {nodes.filter(node => node.type === 'entity').length > 0 ? (
                    nodes
                        .filter(node => node.type === 'entity')
                        .map(node => (
                            <button
                                key={node.id}
                                className="p-2 m-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full text-left"
                                onClick={() => handleSelectEntity(node.id)}
                            >
                                {node.data.label} (ID: {node.id})
                            </button>
                        ))
                ) : (
                    <p className="text-gray-500">Entityがありません</p>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;