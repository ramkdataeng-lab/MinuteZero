@echo off
npm init -y
npx -y create-next-app@latest resq-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
