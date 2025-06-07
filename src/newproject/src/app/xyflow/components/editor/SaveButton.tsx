type SaveButtonProps = {
    onSave: () => Promise<void>;
};

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
    return (
        <div className="mb-4">
            <button
                onClick={onSave}
                className="
                    w-full bg-green-500 text-white 
                    px-4 py-2 rounded
                    hover:bg-green-600 transition
                "
            >
                保存
            </button>
        </div>
    );
};

export default SaveButton;