# SpeedWatch NZ

SpeedWatch NZ is a modern web application that provides real-time traffic camera feeds from across New Zealand, plotted on an interactive map. Built with the latest web technologies, it offers a seamless and responsive experience for users to monitor traffic conditions. The app is powered by data from the NZTA Waka Kotahi traffic APIs.

![SpeedWatch NZ Screenshot](https://storage.googleapis.com/studioprompt/speedwatch-screenshot.png)

## Features

- **Live Traffic Cameras**: View up-to-date images from NZTA's nationwide network of traffic cameras.
- **Interactive Map**: Navigate across New Zealand with a familiar Google Maps interface, with camera locations clearly marked.
- **User Location**: The map automatically centers on your current GPS location for immediate relevance.
- **Camera Details**: Click on any camera to see its name, description, direction, and a live image.
-**Camera List**: A searchable list of all available cameras, filterable by region.
- **Responsive Design**: A fluid user interface that works beautifully on both desktop and mobile devices.
- **Report an Issue**: Users can submit reports for data inaccuracies, helping to improve the service.
- **Light & Dark Mode**: Switch between light and dark themes for your viewing comfort.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Mapping**: [Google Maps Platform](https://mapsplatform.google.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/speedwatch-nz.git
    cd speedwatch-nz
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your Google Maps API key. You can get one from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview).

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
