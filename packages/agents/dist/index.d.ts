export interface AgentStep {
    id: string;
    status: "thinking" | "executing" | "verifying" | "completed" | "error";
    message: string;
    progress: number;
    outputLog?: string;
}
export interface AgentConfig {
    agentId: string;
    goalPrompt: string;
    workspaceDir: string;
}
export declare const AGENT_REGISTRY: {
    id: string;
    name: string;
    role: string;
    capabilities: string[];
}[];
export declare class AgentRuntime {
    /**
     * Run the recursive LangGraph-style agent loop
     */
    static execute(config: AgentConfig, onStep: (step: AgentStep) => void): Promise<void>;
    private static delay;
}
