# CLAUDE.md

## Claude Design → Claude Code hand-off workflow

This repo receives implementations of designs exported from Claude Design
(claude.ai/design). The hand-off ("Hand off to Claude Code" → "Web session")
always spins up a **fresh, sourceless** cloud session — it has no git remote
and no push access to this repo, and there is no repo picker in that dialog.

When, in one of those hand-off sessions, the user provides this repo's
GitHub owner/name (or URL) and asks to push the implemented code here:

1. Call `mcp__Claude_Code_Remote__add_repo` with `owner`, `repo`, and
   `access: "push"`. This grants the *current* session push access —
   adding the repo via the claude.ai/code Settings UI mid-session does
   **not** work (the session's authorized-repo set is otherwise fixed at
   creation time), and pasting a personal access token doesn't bypass it
   either (the session's git proxy denies unauthorized repos before any
   credential is even checked).
2. Clone the repo it returns (`git clone --depth 1 <clone_url> <path>`),
   giving the command a generous timeout (~10 min) — large repos can take
   a while through the proxy. Don't kill/retry a slow `index-pack`.
3. Call `mcp__Claude_Code_Remote__register_repo_root` with the same
   owner/repo and the absolute clone path, so this CLAUDE.md and any
   skills/plugins in the repo load for the rest of the session.
4. Copy the implemented files from the design hand-off's working directory
   into the clone, `git add`, `git commit`, `git push -u origin <branch>`.

No zip export/second-session hand-off is needed — everything happens in
the single hand-off session.
