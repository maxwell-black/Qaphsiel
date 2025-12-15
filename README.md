# AQ Bible Search

A simple web application for searching Bible verses by AQ (Alpha-Numeric Quantification) values.

## Running the Application

Due to browser security restrictions, you need to run a local web server to use this app.

### Option 1: Python (Recommended)

If you have Python installed, open a terminal in this folder and run:

```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Node.js

If you have Node.js installed:

```bash
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: PHP

If you have PHP installed:

```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

## Usage

1. Start a local server using one of the methods above
2. Open `http://localhost:8000` in your browser
3. Wait for the Bible text to load
4. Enter any text string in the search field
5. Click "Search" to find all Bible phrases with matching AQ values

