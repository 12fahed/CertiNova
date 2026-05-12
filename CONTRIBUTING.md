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
- Commit your changes (`git commit -m 'Add some amazing feature'`).
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

## Join the Community

If you have questions or want to discuss the project, join our [Discord Server](https://discord.gg/sQ4sSMRjP).

---

By contributing, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).
