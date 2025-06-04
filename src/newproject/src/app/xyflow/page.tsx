"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ERDEditor from "./ERDEditor";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">ER Diagram Editor</h1>
            <ReactFlowProvider>
                <ERDEditor />
            </ReactFlowProvider>
        </div>
    );
};

export default Home;