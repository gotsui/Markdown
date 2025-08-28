"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ErdEditor from "./components/editor/ErdEditor";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <ReactFlowProvider>
            <ErdEditor />
        </ReactFlowProvider>
    );
};

export default Home;