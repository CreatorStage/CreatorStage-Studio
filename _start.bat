@echo off
if not exist node_modules (
    call npm install
)
call npx vite --port 3001 --host 0.0.0.0 --strictPort
