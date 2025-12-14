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
   - **Tip**: To check for new comments since your last push, compare the comment `createdAt` timestamp with your last commit time.
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
   git add .
   git commit -m "fix: address review comments"
   ```
   - Push to the branch:
   ```bash
   git push origin $(git branch --show-current)
   ```
   - **Reply to Review Comments**:
     - You MUST reply to **EACH** review comment individually.
     - Example: If there are 3 review comments, you must post 3 separate replies. Do not group them.
     - **If addressed**: Reply with "Fixed in [commit-hash]. [Brief description of fix]."
       - Example: "Fixed in 8e2a1b9. Removed the unused variable."
     - **If NOT addressed**: Reply with "Not addressed because [Reason]."
       - Example: "Not addressed because this will be handled in a separate PR."
