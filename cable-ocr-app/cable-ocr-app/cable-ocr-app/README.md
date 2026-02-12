# Cable OCR Application

This application extracts technical parameters from cable datasheet PDFs and generates reports.

## Prerequisites

Before running the application, ensure you have the following installed on your Windows machine:

1.  **Python 3.10+**: [Download Python](https://www.python.org/downloads/)
2.  **Tesseract OCR**:
    *   Download and install from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki).
    *   **Important**: The application expects Tesseract to be installed at:
        `C:\Program Files\Tesseract-OCR\tesseract.exe`
    *   If you install it elsewhere, update the `TESSERACT_EXE` path in `app_enhanced.py`.
3.  **Poppler for Windows**:
    *   Download the latest Release (e.g., `Release-24.08.0-0.zip`) from [github.com/oschwartz10612/poppler-windows/releases](https://github.com/oschwartz10612/poppler-windows/releases/).
    *   Extract the zip file to `C:\`.
    *   **Important**: The application expects Poppler binaries at:
        `C:\poppler-24.08.0\Library\bin`
    *   If you extract it elsewhere or use a different version, update the `POPPLER_PATH` in `app_enhanced.py`.

## Installation

1.  **Navigate to the project directory**:
    Open a terminal (Command Prompt or PowerShell) and navigate to the folder containing `app_enhanced.py`.

2.  **Create a Virtual Environment**:
    ```cmd
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**:
    *   Command Prompt:
        ```cmd
        venv\Scripts\activate
        ```
    *   PowerShell:
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```

4.  **Install Python Dependencies**:
    ```cmd
    pip install -r requirements.txt
    ```

## Running the Application

1.  **Start the Server**:
    Make sure your virtual environment is activated, then run:
    ```cmd
    python app_enhanced.py
    ```

2.  **Access the App**:
    Open your web browser and go to:
    [http://localhost:5001](http://localhost:5001)

## Troubleshooting

*   **"Tesseract is not installed or it's not in your PATH"**: Verify that `tesseract.exe` exists at the path defined in `app_enhanced.py`.
*   **"Unable to get page count" / Poppler errors**: Verify that the Poppler `bin` directory path in `app_enhanced.py` is correct and contains `pdftoppm.exe` and `pdfinfo.exe`.