export interface RouterConfig {
    model: string;
    prompt: string;
    history?: Array<{
        role: string;
        content: string;
    }>;
    temperature?: number;
}
export interface RouterResponse {
    reply: string;
    modelUsed: string;
    costEstimate: number;
    latencyMs: number;
}
export declare class AiGateway {
    /**
     * Route prompts with automatic fallback strategies
     */
    static generate(config: RouterConfig): Promise<RouterResponse>;
    private static getFallbackChain;
    private static verifyProviderKey;
    private static calculateCost;
    private static getMockResponse;
}
