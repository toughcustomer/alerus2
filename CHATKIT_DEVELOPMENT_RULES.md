# ChatKit Development Rules

Based on OpenAI ChatKit documentation and implementation experience.

## Core Principles

### 1. Component Structure
- **Always use the `ChatKit` component** with the `control` prop from `useChatKit` hook
- **Never render `chatkit.control` directly** - it's not a valid JSX element
- **Proper import pattern:**
  ```tsx
  import { ChatKit, useChatKit } from "@openai/chatkit-react";
  ```

### 2. Environment Variables
- **Required variables:**
  - `OPENAI_API_KEY` - Must be from the same org/project as your Agent Builder workflow
  - `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` - Workflow ID starting with `wf_...`
- **Optional variables:**
  - `CHATKIT_API_BASE` - Custom API base URL (defaults to https://api.openai.com)

### 3. Session Management
- **Use the `/api/create-session` endpoint** for session creation
- **Handle session errors gracefully** with proper error states
- **Implement retry logic** for failed session creation
- **Session cookies** are automatically managed by the API endpoint

### 4. Error Handling
- **Never hide the ChatKit component** with `pointer-events-none` or `opacity-0` during initialization
- **Use overlay patterns** for loading and error states instead of hiding the main component
- **Separate error types:**
  - Script loading errors
  - Session creation errors
  - Integration errors
- **Always provide retry mechanisms** for recoverable errors

### 5. Component Visibility
- **ChatKit component should always be visible** with:
  ```tsx
  className="block h-full w-full"
  style={{ 
    pointerEvents: 'auto',
    opacity: 1,
    visibility: 'visible'
  }}
  ```
- **Use z-index layering** for overlays (loading: z-10, errors: z-20)
- **Never conditionally hide** the main ChatKit component

### 6. Initialization Flow
1. **Script loading** - Wait for `chatkit.js` to load
2. **Session creation** - Call API endpoint to get client secret
3. **Component rendering** - Always render ChatKit component
4. **State management** - Use overlays for loading/error states

### 7. Debugging
- **Add comprehensive logging** for development:
  ```tsx
  console.log("ChatKit state:", {
    isInitializingSession,
    blockingError,
    hasControl: Boolean(chatkit.control),
    scriptStatus,
    errors
  });
  ```
- **Use visual indicators** for testing (colored borders, backgrounds)
- **Check browser console** for detailed error information

### 8. Deployment Considerations
- **Environment variables** must be set in production (Vercel dashboard)
- **Domain allowlist** - Add your domain to OpenAI dashboard
- **Organization verification** - Required for models like GPT-5
- **Build process** - Ensure all dependencies are properly installed

### 9. Common Issues and Solutions

#### Input Controls Disappearing
- **Cause:** Conditional hiding of ChatKit component during initialization
- **Solution:** Always render ChatKit, use overlays for states

#### Session Creation Failures
- **Cause:** Missing or invalid API key, workflow ID, or domain not allowlisted
- **Solution:** Verify environment variables and domain settings

#### Script Loading Errors
- **Cause:** Network issues or CDN problems
- **Solution:** Implement retry logic and fallback handling

### 10. Best Practices
- **Keep components simple** - Avoid complex conditional rendering
- **Use TypeScript** - Leverage type safety for ChatKit props
- **Test locally first** - Use `npm run dev` before deploying
- **Monitor deployments** - Check Vercel logs for build/runtime errors
- **Version control** - Commit working states before making changes

### 11. File Structure
```
components/
├── ChatKitPanel.tsx     # Main ChatKit wrapper
├── SimpleChatKit.tsx    # Minimal test component
└── ErrorOverlay.tsx     # Error display component

app/
├── api/create-session/  # Session creation endpoint
└── layout.tsx          # Script loading
```

### 12. Testing Strategy
- **Create minimal test components** to isolate issues
- **Use visual debugging** with colored borders/backgrounds
- **Test error scenarios** - Network failures, invalid keys, etc.
- **Verify in multiple browsers** - Chrome, Firefox, Safari

## Implementation Checklist

- [ ] Environment variables configured
- [ ] ChatKit component always visible
- [ ] Proper error handling with overlays
- [ ] Session creation endpoint working
- [ ] Script loading from CDN
- [ ] Domain allowlisted in OpenAI dashboard
- [ ] Organization verified (if using restricted models)
- [ ] Local testing completed
- [ ] Production deployment successful
- [ ] Error monitoring in place

## References
- [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [Agent Builder](https://platform.openai.com/agent-builder)
