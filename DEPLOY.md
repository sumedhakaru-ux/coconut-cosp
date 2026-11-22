# Free publishing (Cloudflare Pages)

1. Upload this folder to a new GitHub repo (github.com -> New repository -> "uploading an existing file"). Do NOT upload node_modules or dist.
2. Go to dash.cloudflare.com -> Workers & Pages -> Create -> Pages -> Connect to Git -> pick the repo.
3. Build settings:  Framework: None | Build command: npm run build | Output directory: dist
4. Save and Deploy. You get a free https://<name>.pages.dev link. No card needed.

## Optional: turn on the AI receipt scanner (still free)
1. Get a free key at https://aistudio.google.com/apikey (do not link billing).
2. Cloudflare Pages -> your project -> Settings -> Variables and Secrets:
   - Secret   GEMINI_API_KEY = your key   (Production)
   - Variable VITE_ENABLE_AI_SCAN = true  (Production, build variable)
3. Deployments -> Retry deployment.
Notes: the free Gemini tier has daily limits, and Google may use free-tier content to improve its products.
If the model name stops working, set a variable GEMINI_MODEL to a current free-tier Flash model.
