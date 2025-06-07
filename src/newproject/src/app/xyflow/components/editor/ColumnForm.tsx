import { useState } from "react";
import { Column } from "../../types/erd";

type ColumnFormProps = {
    initialColumn: Column;
    onSave: (column: Column) => void;
    onCancel: () => void;
};

const ColumnForm: React.FC<ColumnFormProps> = ({
    initialColumn,
    onSave,
    onCancel,
}) => {
    const [column, setColumn] = useState(initialColumn);

    const handleSave = () => {
        if (!column.name) {
            alert("カラム名を入力してください");
            return;
        }

        onSave(column);
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                value={column.name}
                onChange={(e) => setColumn({ ...column, name: e.target.value })}
                placeholder="カラム名"
                className="
                    w-full p-1 border rounded
                    focus: outline-none focus:border-blue-500    
                "
            />
            <select
                value={column.type}
                onChange={(e) => setColumn({ ...column, type: e.target.value })}
                className="w-full p-1 border rounded"
            >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="BOOLEAN">BOOLEAN</option>
            </select>
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={column.isPrimaryKey || false}
                    onChange={(e) => setColumn({ ...column, isPrimaryKey: e.target.checked })}
                    className="mr-2"
                />
                PK
            </label>
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={column.isForeignKey || false}
                    onChange={(e) => setColumn({ ...column, isForeignKey: e.target.checked })}
                    className="mr-2"
                />
                FK
            </label>
            <div className="flex space-x-2">
                <button
                    onClick={handleSave}
                    className="
                        flex-1 bg-blue-500 text-white p-2 rounded
                        hover:bg-blue-600 transition
                    "
                >
                    保存
                </button>
                <button
                    onClick={onCancel}
                    className="
                        flex-1 bg-gray-300 text-gray-800 p-2 rounded
                        hover:bg-gray-400 transition
                    "
                >
                    キャンセル
                </button>
            </div>
        </div>
    );
};

export default ColumnForm;