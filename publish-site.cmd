@echo off
cd /d "%~dp0"

call pnpm exec wrangler whoami 2>nul | findstr /C:"You are logged in" >nul
if errorlevel 1 (
  echo.
  echo A Cloudflare page will open in your browser. Click Allow, then come back here.
  echo.
  call pnpm exec wrangler login
)

set tries=0
:deploy
set /a tries+=1
echo.
echo Publishing, try %tries% of 5...
call pnpm run deploy && goto done
if %tries% GEQ 5 goto failed
timeout /t 5 >nul
goto deploy

:done
echo.
echo DONE. The site has been published. You can close this window.
pause
exit /b 0

:failed
echo.
echo Could not publish. Your files are safe. Try again on a different network.
pause
exit /b 1
