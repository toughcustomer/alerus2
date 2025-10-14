"use client";

import { useChatKit } from "@openai/chatkit-react";
import { WORKFLOW_ID } from "@/lib/config";

export function SimpleChatKit() {
  const chatkit = useChatKit({
    api: {
      getClientSecret: async () => {
        const response = await fetch('/api/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workflowId: WORKFLOW_ID })
        });
        const data = await response.json();
        return data.client_secret;
      }
    },
    theme: {
      colorScheme: 'light'
    }
  });

  console.log("SimpleChatKit render:", {
    hasControl: Boolean(chatkit.control),
    workflowId: WORKFLOW_ID
  });

  return (
    <div className="h-[90vh] w-full bg-white border-2 border-red-500">
      <div className="p-4 bg-yellow-100">
        <h2>Simple ChatKit Test</h2>
        <p>Control exists: {String(Boolean(chatkit.control))}</p>
        <p>Workflow ID: {WORKFLOW_ID}</p>
      </div>
      <div className="h-full w-full" style={{ 
        pointerEvents: 'auto',
        opacity: 1,
        visibility: 'visible',
        backgroundColor: 'lightblue'
      }}>
        <chatkit.control />
      </div>
    </div>
  );
}
