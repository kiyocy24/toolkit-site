---
description: Check GitHub issues, prioritize one, and implement the fix.
---

1. **List Issues**
   Run the following command to see open issues:
   ```bash
   gh issue list --limit 10
   ```
   // turbo

2. **Analyze and Select**
   - Read the list of issues from the command output.
   - specific criteria for selection:
     1. **Bug** (labeled `bug` or implies incorrect behavior)
     2. **High Priority** (labeled `urgent` or `high`)
     3. **Oldest** if no clear priority exists.
   - **Notify the user** of your decision: "I have selected issue #X: [Title] because [Reason]. I will now proceed to fix it."

3. **Get Issue Details**
   Run the command to see details (replace `<number>` with the selected issue):
   ```bash
   gh issue view <number>
   ```

4. **Plan and Solve**
   - Create a new branch: `git checkout -b <type>/<short-description>` (e.g., `feat/add-new-tool`, `fix/layout-bug`)
   - Create a proper `task_boundary` for this task.
   - Analyze the codebase (`view_file`, `grep_search`).
   - Create an `implementation_plan.md` and get approval.
   - Implement the changes.
   - Verify with tests or browser.

5. **Submit**
   - Commit changes: `git commit -m "<type>: <description>"`
   - Create PR:
     ```bash
     git push origin <branch-name>
     gh pr create --title "<type>: <description>" --body "## Overview

[Description of changes]

close #<number>"
     ```