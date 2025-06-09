"use client";

import { useEffect, useState } from "react";

type SaveButtonProps = {
    onSave: (name: string) => Promise<void>;
    onLoad: (name: string) => Promise<void>;
};

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, onLoad }) => {
    const [diagramName, setDiagramName] = useState("");
    const [selectedDiagram, setSelectedDiagram] = useState("");
    const [diagrams, setDiagrams] = useState<string[]>([]);

    useEffect(() => {
        const fetchDiagrams = async () => {
            const res = await fetch("/api/erd/list");
            const result = await res.json();
            setDiagrams(result.diagrams);
        };

        fetchDiagrams();
    }, []);

    const handleSave = async () => {
        if (!diagramName.trim()) {
            alert("名前を入力してください");
            return;
        }

        onSave(diagramName);
    };

    const handleLoad = async () => {
        if (!selectedDiagram) {
            alert("読み込む図を選択してください");
            return;
        }

        onLoad(selectedDiagram);
        setDiagramName(selectedDiagram);
    };

    return (
        <div className="space-y-4 mb-4">
            <div>
                <label className="block mb-1">ER図の名前</label>
                <input
                    type="text"
                    value={diagramName}
                    onChange={(e) => setDiagramName(e.target.value)}
                    className="
                        w-full p-2 border rounded mb-2
                        focus:outline-none focus:border-blue-500
                    "
                    placeholder="diagram-name"
                />
                <button
                    onClick={handleSave}
                    className="
                        w-full mt-2 p-2 bg-green-600 text-white
                        rounded hover:bg-green-700
                    "
                >
                    保存
                </button>
            </div>
            <div>
                <label className="block mb-1">保存済みの図</label>
                <select
                    value={selectedDiagram}
                    onChange={(e) => setSelectedDiagram(e.target.value)}
                    className="
                        w-full p-2 border rounded mb-2
                        focus:outline-none focus:border-blue-500
                    "
                >
                    <option value="">選択してください</option>
                    {diagrams.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <button
                    onClick={handleLoad}
                    className="
                        w-full mt-2 p-2 bg-blue-600 text-white
                        rounded hover:bg-blue-700
                    "
                >
                    読み込み
                </button>
            </div>
        </div>
    );
};

export default SaveButton;