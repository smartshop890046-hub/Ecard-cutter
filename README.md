# E-Card Cutter (Free ID Card Crop Tool)

A responsive, browser-based ID card cropping and printing website built with HTML, CSS, and JavaScript.

## Features
- Aadhaar, PAN, Voter ID, Ayushman, Ration, ABHA, e-Shram and Punjab Health card crop pages (shared crop workspace with preset aspect ratios)
- Adjustable crop selection using Cropper.js
- Custom output dimensions
- PNG download
- Browser print
- Front & back image merge into one PNG
- Search cards, responsive layout, drag-and-drop image upload
- Local browser processing; images are not uploaded to a server

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Select a tool, upload an image, adjust the crop, then click **Download PNG** or **Print card**.

Cropper.js and Google Fonts are loaded from CDN, so an internet connection is needed for those assets. The core source files are included and can be hosted as static files.

## Free hosting with GitHub Pages
1. Create or sign in to GitHub.
2. Create a public repository (for example `ecard-cutter`).
3. Upload `index.html`, `style.css`, and `script.js` to the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
6. Your site will be published at `https://YOUR-USERNAME.github.io/ecard-cutter/` (may take a few minutes).

## Important
This is a general-purpose image crop and print utility, not an official government service. Users should verify card details and print dimensions before use. Do not use it to alter, fabricate, or misrepresent identity documents.
