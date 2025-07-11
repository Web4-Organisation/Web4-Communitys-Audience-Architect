# Web4 Audience Architect AI

Web4 Audience Architect AI is a powerful, AI-driven user segmentation tool built with Next.js and Firebase Genkit. It allows marketing analysts, product managers, and data scientists to intuitively create, manage, and analyze user segments from their data. Leverage the power of AI to gain deep insights into your user base and make data-informed decisions.

<img width="1512" height="559" alt="image" src="https://github.com/user-attachments/assets/532bb04f-2048-4755-b608-a271749d0ccb" />
<img width="1512" height="570" alt="image" src="https://github.com/user-attachments/assets/3df52348-d0dd-4ddf-936b-d773047ffa4e" />



## Features

- **Interactive Dashboard**: A clean, card-based interface to view all your user segments at a glance.
- **Dynamic Segmentation**: Create complex user segments using a powerful, yet simple, rule editor. Filter users based on any attribute with multiple conditions.
- **CSV Data Management**: Easily import your user data from a CSV file and export specific segments for use in other tools.
- **AI-Powered Analysis**: Go beyond numbers. With a single click, use Genkit-powered AI to analyze the characteristics of any segment and receive a human-readable, insightful summary.
- **Dark Mode by Default**: A sleek, professional, and eye-friendly dark theme designed for focus.
- **Responsive Design**: Fully responsive layout that works on any device.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons
- **AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/audience-architect-ai.git
    cd audience-architect-ai
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```.env.local
    GOOGLE_API_KEY=your_google_api_key_here
    ```

4.  **Run the Genkit developer UI (optional but recommended):**

    In a separate terminal, start the Genkit development server to inspect your AI flows.

    ```sh
    npm run genkit:watch
    ```

    You can access the Genkit developer UI at `http://localhost:4000`.

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Usage

- **Import Users**: Click the "Import CSV" button in the header to upload your user data.
- **Create a Segment**: Click "New Segment" to open the rule editor. Give your segment a name and add one or more rules to define it.
- **Analyze a Segment**: On any segment card, click "Analyze with AI" to get an AI-generated summary of that segment's characteristics.
- **Export a Segment**: Click "Export CSV" on a segment card to download the user data for that specific segment.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
