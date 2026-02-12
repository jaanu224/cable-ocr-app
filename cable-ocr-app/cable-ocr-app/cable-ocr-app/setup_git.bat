@echo off
echo Setting up Git repository for Render deployment...

git init
git add .
git commit -m "Initial commit - Cable OCR Application ready for Render"

echo.
echo Repository initialized! 
echo Next steps:
echo 1. Create a repository on GitHub
echo 2. Run: git remote add origin YOUR_GITHUB_URL
echo 3. Run: git push -u origin main
echo 4. Deploy on Render.com

pause