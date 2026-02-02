# Data Analysis Service

A backend REST API built with Node.js and Express that accepts CSV uploads and
returns dataset metadata and descriptive statistics for numeric columns.

This project demonstrates backend API design, input validation, error handling,
and streaming data processing.

## Features
- Health check endpoint
- CSV file upload via multipart/form-data
- Automatic column detection
- Descriptive statistics for numeric columns (mean, min, max)
- Robust input validation and consistent error responses

## Tech Stack
- Node.js
- Express
- Multer (file upload)
- csv-parser
- Git / GitHub

## Setup
```bash
npm install
node server/app.js
