"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ERDEditor from "./components/editor/ERDEditor";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <ReactFlowProvider>
            <ERDEditor />
        </ReactFlowProvider>
    );
};

export default Home;