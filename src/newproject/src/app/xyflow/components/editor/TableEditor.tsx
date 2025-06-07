import { useState } from "react";
import { Column, ERNode } from "../../types/erd"
import ColumnForm from "./ColumnForm";

type TableEditorProps = {
    node: ERNode | null;
    updateTableName: (name: string) => void;
    addColumn: (column: Column) => void;
    updateColumn: (column: Column) => void;
    removeColumn: (columnId: string) => void;
};

const TableEditor: React.FC<TableEditorProps> = ({
    node,
    updateTableName,
    addColumn,
    updateColumn,
    removeColumn,
}) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);

    if (!node) {
        return null;
    }

    const handleAddColumn = (column: Column) => {
        const colNum = (node.data.columns?.length || 0) + 1;
        addColumn({ ...column, id: `${node.id}-col${colNum}` });
        setIsFormVisible(false);
    };

    const handleEditColumn = (column: Column) => {
        updateColumn(column);
        setEditingColumn(column);
    };

    return (
        <div className="mb-4">
            <h4 className="text-md font-medium mb-2">テーブル: {node.data.label}</h4>
            <input
                type="text"
                value={node.data.label}
                onChange={(e) => updateTableName(e.target.value)}
                className="
                    w-full p-2 border rounded mb-2
                    focus:outline-none focus:border-blue-500
                "
                placeholder="テーブル名"
            />
            <h5 className="text-sm font-medium mb-2">カラム</h5>
            <div className="space-y-2">
                {node.data.columns.map((column) => (
                    <div
                        key={column.id}
                        className="flex items-center justify-between"
                    >
                        {editingColumn && editingColumn.id === column.id ? (
                            <ColumnForm
                                initialColumn={editingColumn}
                                onSave={handleEditColumn}
                                onCancel={() => setEditingColumn(null)}
                            />
                        ) : (
                            <>
                                <div className="px-4">
                                    {column.name} ({column.type})
                                    {column.isPrimaryKey && <span className="text-red-500"> PK</span>}
                                    {column.isForeignKey && <span className="text-blue-500"> FK</span>}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setEditingColumn(column)}
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
                    className="
                        w-full bg-blue-500 text-white p-2 rounded
                        hover:bg-blue-600 transition mt-2
                    "
                >
                    カラム追加
                </button>
            )}
            {isFormVisible && (
                <ColumnForm
                    initialColumn={{
                        id: "",
                        name: "",
                        type: "VARCHAR",
                        isPrimaryKey: false,
                        isForeignKey: false,
                    }}
                    onSave={handleAddColumn}
                    onCancel={() => setIsFormVisible(false)}
                />
            )}
        </div>
    );
};

export default TableEditor;