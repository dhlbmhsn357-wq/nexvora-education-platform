@echo off
set "NODE_HOME=C:\Users\Muhsin Dahlab\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PATH=%NODE_HOME%;%PATH%"
cd /d "%~dp0"
start "Open NEXVORA" cmd /c "timeout /t 2 /nobreak >nul ^& start http://127.0.0.1:5173"
echo Starting NEXVORA Prototype at http://127.0.0.1:5173
echo Keep this window open while using the prototype.
"C:\Users\Muhsin Dahlab\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173
