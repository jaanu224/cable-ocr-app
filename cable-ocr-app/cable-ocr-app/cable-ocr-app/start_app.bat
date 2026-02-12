@echo off
echo ========================================
echo Cable OCR Application Startup
echo ========================================
echo.

echo Checking Tesseract...
if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    echo [OK] Tesseract found
) else (
    echo [ERROR] Tesseract not found!
    pause
    exit /b 1
)

echo Checking Poppler...
if exist "C:\poppler-25.12.0\Library\bin\pdftoppm.exe" (
    echo [OK] Poppler found
) else (
    echo [ERROR] Poppler not found!
    pause
    exit /b 1
)

echo.
echo Starting Flask application...
echo Open your browser to: http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python app_enhanced.py

pause
