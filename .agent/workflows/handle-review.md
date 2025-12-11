---
description: Check for PR on current branch and address review comments.
---

1. **Identify Context**
   - Get the current branch name:
   ```bash
   git branch --show-current
   ```
   // turbo

2. **Find Pull Request**
   - Check for an open PR for this branch:
   ```bash
   gh pr list --head $(git branch --show-current) --json number,url,title,state
   ```
   // turbo
   - If no PR is found, notify the user and exit.

3. **Fetch Review Comments**
   - If a PR exists, get the details and comments (replace `<number>` with the PR number found):
   ```bash
   gh pr view <number> --json comments,reviews,body
   ```
   - Also check the latest checks status if relevant:
   ```bash
   gh pr checks <number>
   ```

4. **Analyze Feedback**
   - Read the comments and reviews.
   - Summarize the requested changes or feedback.
   - If there are no actionable comments (e.g., only "LGTM" or no new comments since last push), notify the user and exit.

5. **Plan and Address**
   - If changes are requested:
     - Create or update `task.md` to track the feedback items.
     - Create an `implementation_plan.md` if the changes are significant, otherwise just plan in the chat.
     - Modify the code to address the feedback.

6. **Verify**
   - Run tests or verify UI as appropriate for the changes.
   - Ensure you haven't introduced regressions.

7. **Update Pull Request**
   - Commit the changes:
   ```bash
   git commit -am "fix: address review comments"
   ```
   - Push to the branch:
   ```bash
   git push origin $(git branch --show-current)
   ```
   - Optionally reply to the PR comments to indicate they have been resolved (can be done in browser or via `gh pr comment`).
