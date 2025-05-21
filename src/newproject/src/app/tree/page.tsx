"use client";

import React, { useState, ChangeEvent, useRef } from "react";

const TreeEditor: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState<string>("");
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const [spaceNum, setSpaceNum] = useState(2);

    type Node = { name: string; children: Node[]; };

    const convertToTree = (text: string, spaceNum: number): string => {
        if (!text.trim()) {
            return "";
        }

        const rows = text.split("\n");

        let root: Node | null = { name: ".", children: [] };
        root = null;

        for (const rowValue of rows) {
            root = addNode(rowValue, 0, root);
        }

        if (!root) {
            return "";
        }

        const tree = writeTree(root, "", "└", "", true, spaceNum);
        return tree;
    };

    const writeTree = (node: Node, leftRuledLine: string, myRuledLine: string, childRuledLine: string, isRoot: boolean, spaceNum: number): string => {
        const childLeftRuledLine = `${leftRuledLine}${isRoot ? "" : " ".repeat(spaceNum)}${childRuledLine}`;
        let tree = "";
        let isFirstChild = true;

        for (const child of node.children.reverse()) {
            if (isFirstChild) {
                tree = writeTree(child, childLeftRuledLine, "└", "", false, spaceNum);
            } else {
                tree = `${writeTree(child, childLeftRuledLine, "├", "│", false, spaceNum)}\n${tree}`;
            }

            isFirstChild = false;
        }

        if (isRoot) {
            tree = `${node.name}${tree == "" ? "" : "\n"}${tree}`;
        } else {
            tree = `${leftRuledLine}${" ".repeat(spaceNum)}${myRuledLine} ${node.name}${tree == "" ? "" : "\n"}${tree}`;
        }

        return tree;
    }

    const addNode = (rowValue: string, nodeDepth: number, node: Node | null): Node => {
        if (!node) {
            return { name: rowValue.trim(), children: [] };
        }

        const matched = rowValue.trimEnd().match(/^\t*/g);
        const depth = matched ? matched[0].length : 0;
        const depthDiff = depth - nodeDepth;

        if (depthDiff <= 0) {
            return node;
        } else if (depthDiff === 1) {
            node.children.push({ name: rowValue.trim(), children: [] });
            return node;
        } else {
            if (node.children.length <= 0) {
                node.children.push({ name: rowValue.trim(), children: [] });
                return node;
            }

            const nextNodeDepth = nodeDepth + 1;
            const lastChild = node.children[node.children.length - 1];
            const addedChild = addNode(rowValue, nextNodeDepth, lastChild);
            node.children[node.children.length - 1] = addedChild;
            return node;
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const nextInput = e.target.value;
        setInput(nextInput);
        setOutput(convertToTree(nextInput, spaceNum));
    };

    const handleSelectAll = () => {
        if (outputRef.current) {
            outputRef.current.select();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Tab") {
            return;
        }

        // デフォルトのタブ移動をキャンセル
        e.preventDefault();

        if (e.shiftKey) {
            const textarea = e.target as HTMLTextAreaElement;
            const startPosition = textarea.selectionStart;
            const endPosition = textarea.selectionEnd;
            const value = textarea.value;
            const startRow = value.slice(0, startPosition).split("\n").length;
            const endRow = value.slice(startPosition, endPosition).split("\n").length + startRow - 1;
            const rowValues = value.split("\n");

            let nextStartPosition = startPosition;
            let nextEndPosition = endPosition;

            for (let i = startRow; i <= endRow; i++) {
                const currentIndex = i - 1;
                const currentRowValue = rowValues[currentIndex];

                if (!currentRowValue.startsWith("\t")) {
                    continue;
                }

                if (i === startRow) {
                    nextStartPosition--;
                }

                nextEndPosition--;
                rowValues[currentIndex] = currentRowValue.replace("\t", "");
            }

            const nextValue = rowValues.join("\n");
            setInput(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);

            setOutput(convertToTree(nextValue, spaceNum));
        } else {
            const textarea = e.target as HTMLTextAreaElement;
            const startPosition = textarea.selectionStart;
            const endPosition = textarea.selectionEnd;
            const value = textarea.value;
            let nextValue = "";
            let nextStartPosition = startPosition;
            let nextEndPosition = endPosition;

            if (startPosition === endPosition) {
                nextValue = value.substring(0, startPosition) + "\t" + value.substring(endPosition);
                nextStartPosition++;
                nextEndPosition++;
            } else {
                const startRow = value.slice(0, startPosition).split("\n").length;
                const endRow = value.slice(startPosition, endPosition).split("\n").length - 1 + startRow;

                if (startRow === endRow) {
                    nextValue = value.substring(0, startPosition) + "\t" + value.substring(endPosition);
                    nextEndPosition -= (endPosition - startPosition) - 1;
                } else {
                    const rowValues = value.split("\n");
                    for (let i = startRow; i <= endRow; i++) {
                        const currentIndex = i - 1;
                        rowValues[currentIndex] = "\t" + rowValues[currentIndex];
                    }

                    nextValue = rowValues.join("\n");
                    nextStartPosition++;
                    nextEndPosition += (endRow - startRow) + 1;
                }
            }

            setInput(nextValue);

            setTimeout(() => {
                textarea.selectionStart = nextStartPosition;
                textarea.selectionEnd = nextEndPosition;
            }, 0);

            setOutput(convertToTree(nextValue, spaceNum));
        }
    };

    const handleCopyToClipboard = () => {
        if (!outputRef.current || !output) {
            setCopyStatus("Nothing to copy");
            return;
        }

        try {
            outputRef.current.select();
            const success = document.execCommand("copy");
            if (success) {
                setCopyStatus("Copied to clipboard!");
            } else {
                setCopyStatus("Copy failed. Please copy manually.");
            }
        } catch (err) {
            setCopyStatus("Copy failed. Please copy manually.");
            console.error("Copy error:", err);
        }

        // ステータスメッセージを3秒後にクリア
        setTimeout(() => setCopyStatus(""), 3000);
    };

    const handleSpaceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextSpaceNum = Number(e.target.value);
        if (nextSpaceNum > 0) {
            setSpaceNum(nextSpaceNum);
            setOutput(convertToTree(input, nextSpaceNum));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Tree Editor</h2>
            <div>
                <label htmlFor="space" className="block text-sm font-medium text-gray-700 mb-1">
                    スペース数
                </label>
                <input
                    id="space"
                    type="number"
                    min="1"
                    value={spaceNum}
                    onChange={handleSpaceChange}
                    className="w-14 p-2 mb-4 border rounded"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="input" className="block text-sm font-medium text-gray-700 mt-1 mb-3">
                        Input (Tab-indexed data)
                    </label>
                    <textarea
                        id="input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter tab-indexed data (e.g., parent\n\tchild\n\t\tgrandchild)"
                        className="w-full h-160 p-3 font-mono text-sm border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                            Output (Tree)
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSelectAll}
                                disabled={!output}
                                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Select All
                            </button>
                            <button
                                onClick={handleCopyToClipboard}
                                disabled={!output}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    <textarea
                        id="output"
                        ref={outputRef}
                        value={output}
                        readOnly
                        placeholder="Tree will appear here"
                        className="w-full h-160 p-3 font-mono text-sm border rounded-md bg-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                    />
                    {copyStatus && (
                        <p
                            className={`mt-2 text-sm ${
                                copyStatus.includes("Copied") ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {copyStatus}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TreeEditor;