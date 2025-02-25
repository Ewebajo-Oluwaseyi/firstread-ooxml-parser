# Vue.js and OOXML Processing

## 1. Overview

This project is a **Single Page Application (SPA)** built with **Vue 3 and TypeScript**, allowing users to upload, parse, and display Office Open XML (**OOXML**) documents. The application reads `.docx` and `.xml` files, extracts structured content, and displays the formatted text in a web interface.

## 2. Features

✅ **File Upload** – Users can upload an OOXML `.docx` or `.xml` file.  
✅ **OOXML Parsing** – Extracts text and preserves headings, paragraphs, and lists.  
✅ **Content Display** – Displays parsed document content with proper structure.  
✅ **Responsive UI** – Ensures readability across different screen sizes.

## 3. Setup Instructions

### 3.1. Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/your-repo/ooxml-viewer.git
cd ooxml-viewer
npm install
```

### 3.2. Run the Development Server

Start the application locally:

```sh
npm run dev
```

Access it in your browser at `http://localhost:5173/`.

## 4. How It Works

### 4.1. File Upload Handling

- Users select and upload an OOXML `.docx` or `.xml` file via `<input type="file">`.
- The file is read, and based on its type, either the `parseXmlDocument` or `parseOoxmlDocument` function is executed.

### 4.2. OOXML Parsing Logic

- **JSZip** extracts XML from the `.docx` file.
- **DOMParser** parses the XML structure.
- **Mammoth.js** converts `.docx` content to HTML.
- The text is extracted while preserving formatting (headings, lists).

### 4.3. Displaying Content in Vue

Extracted content is stored in a `ref()` and displayed dynamically:

## 5. Troubleshooting & Common Issues

| Issue                   | Solution                                                        |
| ----------------------- | --------------------------------------------------------------- |
| "Cannot parse document" | Ensure the uploaded file is a valid `.docx` or `.xml` format.   |
| "File is too large"     | Limit file size via `FileReader` before processing.             |
| "Deployment failed"     | Check build logs and ensure Node.js dependencies are installed. |

## 6. Conclusion

This application successfully extracts and displays structured OOXML content in Vue 3. By following the setup guide, developers can **easily install, run, and modify** the project for further enhancements.
