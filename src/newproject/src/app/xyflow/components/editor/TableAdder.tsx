import { ERNodeType } from "../../types/erd";

type TableAdderProps = {
    onDragStart: (e: React.DragEvent, nodeType: ERNodeType) => void;
};

const TableAdder: React.FC<TableAdderProps> = ({ onDragStart }) => {
    return (
        <div className="mb-4">
            <h4 className="text-md font-medium mb-2">テーブル追加</h4>
            <div
                className="
                    p-3 bg-gray-100 rounded-md cursor-grab
                    hover:bg-gray-200 transition
                "
                draggable
                onDragStart={(e) => onDragStart(e, "table")}
            >
                ドラッグしてテーブルを追加
            </div>
        </div>
    )
};

export default TableAdder;