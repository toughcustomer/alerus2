"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { useCallback, useMemo } from "react";
import {
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
  WORKFLOW_ID,
  getThemeConfig,
} from "@/lib/config";
import type { ColorScheme } from "@/hooks/useColorScheme";

export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => void;
  onResponseEnd: () => void;
  onThemeRequest: (theme: ColorScheme) => void;
};

export function ChatKitPanel({
  theme,
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
}: ChatKitPanelProps) {
  
  // Simple session creation function
  const getClientSecret = useCallback(async () => {
    const response = await fetch('/api/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId: WORKFLOW_ID })
    });
    const data = await response.json();
    return data.client_secret;
  }, []);

  // Memoize theme config to prevent re-renders
  const themeConfig = useMemo(() => ({
    colorScheme: theme,
    ...getThemeConfig(theme),
  }), [theme]);

  // Memoize other configs
  const startScreenConfig = useMemo(() => ({
    greeting: GREETING,
    prompts: STARTER_PROMPTS,
  }), []);

  const composerConfig = useMemo(() => ({
    placeholder: PLACEHOLDER_INPUT,
    attachments: {
      enabled: true,
    },
  }), []);

  const threadItemActionsConfig = useMemo(() => ({
    feedback: false,
  }), []);

  // Simple ChatKit setup
  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: themeConfig,
    startScreen: startScreenConfig,
    composer: composerConfig,
    threadItemActions: threadItemActionsConfig,
    onClientTool: async (invocation: {
      name: string;
      params: Record<string, unknown>;
    }) => {
      if (invocation.name === "switch_theme") {
        const requested = invocation.params.theme;
        if (typeof requested === "string" && (requested === "light" || requested === "dark")) {
          onThemeRequest(requested);
          return { success: true };
        }
        return { success: false };
      }

      if (invocation.name === "record_fact") {
        const id = String(invocation.params.fact_id ?? "");
        const text = String(invocation.params.fact_text ?? "");
        if (id && text) {
          onWidgetAction({
            type: "save",
            factId: id,
            factText: text,
          });
          return { success: true };
        }
        return { success: false };
      }

      return { success: false };
    },
    onResponseEnd,
  });

  console.log("Simple ChatKitPanel render:", {
    hasControl: Boolean(chatkit.control),
    theme,
    workflowId: WORKFLOW_ID
  });

  return (
    <div className="relative pb-8 flex h-[90vh] w-full rounded-2xl flex-col overflow-hidden bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        control={chatkit.control}
        className="block h-full w-full"
        style={{ 
          pointerEvents: 'auto',
          opacity: 1,
          visibility: 'visible'
        }}
      />
    </div>
  );
}
