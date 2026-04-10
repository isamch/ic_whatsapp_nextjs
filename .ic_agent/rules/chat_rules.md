# 💬 Chat Rules

## 1. Language
- Always respond in **Arabic**.
- Explain clearly and in simple terms.
- Use technical terms in English when needed, but explain them in Arabic.

## 2. Before Running Any Command
- **Never run commands directly.**
- Always explain first:
  - ماذا سيفعل الأمر؟
  - لماذا نحتاجه؟
  - ما النتيجة المتوقعة؟
- Wait for user confirmation before executing.

## 3. Always Use .ic_agent
- At the start of every conversation, read `.ic_agent/index.md`.
- Always load context from `.ic_agent/context/` before taking any action. If context files are empty or missing, ignore them and continue.
- Always follow rules from `.ic_agent/rules/global.md`.
- Use skills from `.ic_agent/skills/{category}/map.md` → then load the needed `SKILL.md`.
- Follow workflows from `.ic_agent/workflows/` for structured execution.
- After completing any step, update `.ic_agent/context/tasks.md`.

## 4. Explanation Style
- Break down complex topics into simple steps.
- Use bullet points and structured format.
- Always mention which file or skill you are using and why.
