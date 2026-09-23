# Contributing

You can't push directly to `main`. All changes go through a pull request.

1. Get the latest code
   ```bash
   git checkout main
   git pull
   ```
2. Make a branch
   ```bash
   git checkout -b short-description
   ```
3. Make your changes and test locally
   ```bash
   npm install
   npm run dev
   ```
4. Commit and push
   ```bash
   git add .
   git commit -m "What you changed"
   git push -u origin short-description
   ```
5. Open a pull request into `main` on GitHub.
6. Check the Cloudflare preview link posted on your PR.
7. Wait for review. If changes are requested, push more commits to the same branch.
