import { ERNode } from "../../types/erd";

type TableSelectorProps = {
    nodes: ERNode[];
    selectedTableIds: Set<string>;
    toggleTableSelection: (tableId: string) => void;
};

const TableSelector: React.FC<TableSelectorProps> = ({
    nodes,
    selectedTableIds,
    toggleTableSelection,
}) => {
    return (
        <div className="mb-4">
            <h4 className="text-md font-medium mb-2">テーブル選択</h4>
            {nodes.length === 0 && <p className="text-gray-500>">選択可能なテーブルがありません</p>}
            {nodes.map((node) => (
                <label key={node.id} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={selectedTableIds.has(node.id)}
                        onChange={() => toggleTableSelection(node.id)}
                        className="mr-2"
                    />
                    <span>{node.data.label || 'Unnamed Table'}</span>
                </label>
            ))}
        </div>
    );
};

export default TableSelector;