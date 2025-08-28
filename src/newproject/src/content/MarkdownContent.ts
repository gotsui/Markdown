"use client";

import { createContext } from "react";
import { MarkdownContextValue } from "@/hooks/useMarkdown";

const MarkdownContext = createContext<MarkdownContextValue | undefined>(undefined);

export default MarkdownContext;
