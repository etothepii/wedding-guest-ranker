# Wedding Guest Ranker

A React application to help rank wedding guests using a pairwise comparison system.

## Features

- **Guest List Management**: Add, edit, and remove guests.
- **Plus-One Support**: Handle plus-ones, including linking to other known guests.
- **Ranking Interface**: Compare guests side-by-side to determine preference.
- **Leaderboard**: View rankings with weighted scoring (Groom vs. Bride preference) and guest highlighting limits.
- **Data Persistence**: Data is saved locally in the browser.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)

## Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment

This project is configured to automatically deploy to GitHub Pages with a custom domain.

### Configuration

- **Custom Domain**: `weddingguestranker.com`
- **CNAME File**: Located in `public/CNAME`.
- **Workflow**: `.github/workflows/deploy.yml` handles the build and deployment on push to `main`.

### How to Deploy

Simply push changes to the `main` branch:

```bash
git push origin main
```

The GitHub Action will automatically build the project and deploy it to the `gh-pages` branch, which is served at `weddingguestranker.com`.
