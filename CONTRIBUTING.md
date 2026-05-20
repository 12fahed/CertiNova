# Contributing to CertiNova

Thank you for your interest in contributing to CertiNova! We welcome contributions from the community to help make this platform better, more secure, and more accessible.

## How Can I Contribute?

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/12fahed/CertiNova/issues) to report bugs.
- Provide a clear description of the issue and steps to reproduce it.
- Include environment details (OS, Browser, Node version).

### Suggesting Enhancements

- Open an issue with the "enhancement" tag.
- Describe the feature you'd like to see and why it would be useful.

### Pull Requests

- Fork the repository.
- Create a new branch for your feature or bug fix (`git checkout -b feature/amazing-feature`).
- Commit your changes (`git commit -m 'feat: Add some amazing feature'`).
- Write short and concise commit message, follow [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716).
- Push to the branch (`git push origin feature/amazing-feature`).
- Open a Pull Request.

## Development Setup

1.  **Fork and Clone**:

    ```bash
    git clone https://github.com/your-username/CertiNova.git
    cd CertiNova
    ```

2.  **Install Dependencies**:

    ```bash
    # Root dependencies
    npm install

    # Backend dependencies
    cd certinova-backend
    npm install

    # Frontend dependencies
    cd ../certinova-frontend
    npm install
    ```

3.  **Environment Variables**:
    - Follow the setup instructions in the [README.md](./README.md) for both backend and frontend.

4.  **Running Locally**:
    - Backend: `npm run dev` in `certinova-backend`
    - Frontend: `npm run dev` in `certinova-frontend`

## Code Style

- Use Prettier for code formatting.
- Follow the existing architectural patterns (Next.js App Router for frontend, Express.js for backend).
- Ensure TypeScript types are correctly defined.

## AI Code Acceptance Policy

We welcome the use of AI tools (e.g., Copilot, ChatGPT, Cursor, Antigravity) to help you write, refactor, or debug code, they can improve productivity and learning. However, we do not accept issues or pull requests that are generated or submitted entirely by bots, automation scripts, or autonomous agents without meaningful human oversight. You, as the contributor, must take full ownership of every line of code you submit. This means: understanding how it works, testing it, verifying it fits the project’s goals, and being able to explain or defend it during review. AI can assist, but it cannot be your proxy.

Examples of what is / isn’t accepted

- Accepted: You use Copilot to auto-complete a function, then you review, test, and adjust it before opening the PR.
- Accepted: You ask ChatGPT for a regex pattern, understand what it does, and integrate it responsibly.
- Not accepted: An automated bot creates an issue titled “Fix bug” with AI-generated logs and no reproduction steps.
- Not accepted: A PR submitted by a GitHub Actions bot or script with AI-generated code that you haven’t personally verified or even run locally.
- Not accepted: Copy-pasting large AI-generated refactors without understanding side effects, error handling, or performance impact.
- Not accepted: Using an AI agent to automatically comment on or close issues without human triage.

> Bottom line: AI can write code, but you are responsible for it. If you can’t explain what the PR does, don’t open it.

## Join the Community

If you have questions or want to discuss the project, join our [Discord Server](https://discord.gg/sQ4sSMRjP).

---

By contributing, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).
