"""
Test PDF to image conversion with Poppler
"""
from pdf2image import convert_from_bytes
from PIL import Image, ImageDraw
import io

print("Testing PDF to Image conversion...")
print("=" * 60)

# Create a simple test PDF
print("\n1. Creating a test PDF...")
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

pdf_buffer = io.BytesIO()
c = canvas.Canvas(pdf_buffer, pagesize=letter)
c.drawString(100, 750, "Test Cable Datasheet")
c.drawString(100, 700, "Voltage: 132 kV")
c.drawString(100, 650, "Conductor: 3000 mm²")
c.showPage()
c.save()
pdf_bytes = pdf_buffer.getvalue()
print(f"   ✓ Test PDF created ({len(pdf_bytes)} bytes)")

# Test conversion with explicit poppler path
print("\n2. Testing PDF to image conversion...")
POPPLER_PATH = r"C:\poppler-25.12.0\Library\bin"
print(f"   Using Poppler path: {POPPLER_PATH}")

try:
    pages = convert_from_bytes(pdf_bytes, dpi=300, poppler_path=POPPLER_PATH)
    print(f"   ✓ Conversion successful!")
    print(f"   ✓ Extracted {len(pages)} page(s)")
    print(f"   ✓ Page size: {pages[0].size}")
    
    # Save first page as test
    pages[0].save('test_converted_page.png')
    print(f"   ✓ Saved test image: test_converted_page.png")
    
except Exception as e:
    print(f"   ✗ Conversion failed!")
    print(f"   Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test OCR on converted page
print("\n3. Testing OCR on converted page...")
try:
    import pytesseract
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    
    text = pytesseract.image_to_string(pages[0])
    print(f"   ✓ OCR successful!")
    print(f"   Extracted text: '{text.strip()}'")
    
except Exception as e:
    print(f"   ✗ OCR failed: {e}")

print("\n" + "=" * 60)
print("✓ PDF to Image conversion is working!")
print("=" * 60)
print("\nThe Flask app should now work correctly.")
print("Try uploading a PDF again.")
