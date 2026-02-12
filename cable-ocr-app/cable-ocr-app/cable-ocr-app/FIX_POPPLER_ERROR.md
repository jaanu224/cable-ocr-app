# Fix: "Unable to get page count. Is poppler installed and in PATH?"

## ✅ Quick Fix

The error occurs because the Flask app needs to be **restarted** after configuring the Poppler path.

### Solution:

1. **Stop the Flask app** (if it's running):
   - Press `Ctrl+C` in the terminal where Flask is running
   - Or close the terminal window

2. **Restart the Flask app**:
   ```bash
   cd cable-ocr-app\cable-ocr-app
   python app_enhanced.py
   ```
   
   Or double-click: `start_app.bat`

3. **Refresh your browser** and try uploading the PDF again

---

## 🔍 Why This Happens

The Flask app was started **before** the Poppler path was configured in `app_enhanced.py`. Python loads the configuration when the app starts, so changes require a restart.

---

## ✅ Verification Steps

### Step 1: Verify Poppler is installed
```cmd
dir "C:\poppler-25.12.0\Library\bin\pdftoppm.exe"
```
Should show the file exists.

### Step 2: Verify the path in app_enhanced.py
Open `app_enhanced.py` and check line 48:
```python
POPPLER_PATH = r"C:\poppler-25.12.0\Library\bin"
```

### Step 3: Test PDF conversion
```cmd
python test_pdf_conversion.py
```
Should show: `✓ PDF to Image conversion is working!`

### Step 4: Restart Flask and test
```cmd
python app_enhanced.py
```
Then upload a PDF in the browser.

---

## 🚀 Using the Startup Script

We've created a startup script that checks everything before starting:

**Windows:**
```cmd
start_app.bat
```

This script will:
- ✅ Check if Tesseract is installed
- ✅ Check if Poppler is installed
- ✅ Start the Flask app
- ✅ Show you the URL to open

---

## 🔧 Alternative: Add Poppler to System PATH

If you want to avoid specifying the path in code:

1. **Open System Properties**:
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter
   - Go to "Advanced" tab
   - Click "Environment Variables"

2. **Edit PATH**:
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\poppler-25.12.0\Library\bin`
   - Click "OK" on all dialogs

3. **Restart your terminal/IDE**

4. **Test**:
   ```cmd
   pdftoppm -v
   ```
   Should show Poppler version.

---

## 📊 Current Configuration Status

✅ **Tesseract:** Installed at `C:\Program Files\Tesseract-OCR\tesseract.exe`
✅ **Poppler:** Installed at `C:\poppler-25.12.0\Library\bin`
✅ **Python packages:** All installed
✅ **Test scripts:** All passing

**Status:** Ready to use - just restart Flask!

---

## 🐛 Still Having Issues?

### Error: "tesseract is not recognized"
**Fix:** Update line 46 in `app_enhanced.py`:
```python
TESSERACT_EXE = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

### Error: "Unable to get page count"
**Fix:** 
1. Stop Flask (Ctrl+C)
2. Verify Poppler path in `app_enhanced.py` line 48
3. Restart Flask

### Error: "No module named 'pdf2image'"
**Fix:**
```cmd
pip install pdf2image
```

### Error: PDF uploads but no text extracted
**Fix:**
- Check if PDF is image-based (good for OCR)
- Increase DPI in `ocr_pdf_to_text()` function
- Check Tesseract language data is installed

---

## 📝 Quick Checklist

Before starting the app, verify:

- [ ] Tesseract installed: `"C:\Program Files\Tesseract-OCR\tesseract.exe"` exists
- [ ] Poppler installed: `"C:\poppler-25.12.0\Library\bin\pdftoppm.exe"` exists
- [ ] Paths configured in `app_enhanced.py` (lines 46 and 48)
- [ ] Python packages installed: `pip install -r requirements.txt`
- [ ] Test scripts pass: `python test_pdf_conversion.py`
- [ ] Flask app restarted after configuration changes

---

## ✨ Success Indicators

When everything is working, you should see:

1. **In terminal:**
   ```
   * Running on http://127.0.0.1:5001
   ```

2. **In browser after uploading PDF:**
   - Green success message
   - Extracted parameters auto-filled in forms
   - No red error messages

3. **In Flask console:**
   ```
   === PAGE 1 STANDARD ===
   [extracted text from PDF]
   ```

---

## 🎯 Next Steps After Fix

Once the error is resolved:

1. Upload your cable datasheet PDF
2. Click "Extract From PDF"
3. Review auto-filled parameters
4. Perform conductor calculation
5. Perform sheath calculation
6. Download reports in PDF or Word format

---

**Need more help?** Check `INSTALLATION_GUIDE.md` for complete setup instructions.
