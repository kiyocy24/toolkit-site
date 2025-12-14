---
description: Create a GitHub issue based on a simple description, with AI-generated Japanese title and body.
---

1.  **Understand the Request**:
    -   Analyze the user's simple description of the issue.
    -   Identify the core problem or feature request.

2.  **Context Gathering**:
    -   Search for relevant files in the codebase using `find_by_name` or `grep_search`.
    -   Read the content of related files using `view_file` to understand the current implementation and potential impact.

3.  **Draft Issue Content**:
    -   Based on the analysis and file contents, generate a **Japanese** title and description for the GitHub issue.
    -   **Title**: Concise, descriptive, and in Japanese.
    -   **Body**: Detailed, in Japanese. Should include:
        -   **Overview**: What is the problem or feature?
        -   **Current Behavior**: How does it work now? (if applicable)
        -   **Expected Behavior**: How should it work?
        -   **Relevant Code**: file paths and lines (if found).
    -   **Labels**: Determine appropriate labels (e.g., `bug`, `enhancement`, `documentation`, `good first issue`) based on the content.

4.  **Confirm with User**:
    -   **CRITICAL**: Before executing the command, you **MUST** show the proposed Title, Body, and Labels to the user for confirmation.
    -   Ask the user if the content is correct.
    -   Only proceed to the next step if the user approves.

5.  **Create Issue**:
    -   Construct the `gh issue create` command.
    -   Use the `--title`, `--body`, and `--label` flags.
    -   **IMPORTANT**: Use `run_command` to propose the command. Do **NOT** use `SafeToAutoRun: true` for this step.

    ```bash
    gh issue create --title "<Japanese Title>" --body "<Japanese Description>" --label "<Label1>,<Label2>"
    ```

6.  **Finalize**:
    -   Once the user approves and the command runs, confirm the issue URL from the output.

5.  **Finalize**:
    -   Once the user approves and the command runs, confirm the issue URL from the output.
