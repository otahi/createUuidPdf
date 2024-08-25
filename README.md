# QR Code PDF Generator

This project allows you to generate a PDF with UUID-based QR codes using customizable settings such as page size, QR code size, and position.
You can visit [the deployed page: CreateUuidPdf](https://otahi.github.io/createUuidPdf/).

## Features

- Generate UUID-based QR codes.
- Customize the page size (width, height).
- Customize the QR code size.
- Set the QR code position (x, y) on the page.
- Supports multiple pages.
- Query parameters can be used to pre-fill form inputs.

## Getting Started

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/otahi/createUuidPdf.git
    ```

2. Navigate to the project directory:

    ```bash
    cd createUuidPdf
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Modify and Update:

    ```bash
    npx webpack
    ```

### Usage

1. Start a local server (you can use any local server tool like `live-server` or `http-server`):

    ```bash
    npx live-server
    ```

2. Open the project in your browser:

    ```bash
    http://127.0.0.1:8080
    ```

3. Customize the settings in the form and click "Generate PDF" to download the PDF with your QR codes.

### Query Parameters

You can pre-fill the form by using query parameters in the URL. The available parameters are:

- `numPages`: Number of pages (e.g., `?numPages=2`)
- `qrSize`: QR code size in pixels (e.g., `?qrSize=150`)
- `pageWidth`: Page width in millimeters (e.g., `?pageWidth=210`)
- `pageHeight`: Page height in millimeters (e.g., `?pageHeight=297`)
- `qrX`: QR code X position in millimeters (e.g., `?qrX=50`)
- `qrY`: QR code Y position in millimeters (e.g., `?qrY=50`)

For example:
`http://127.0.0.1:8080/`
or
`http://127.0.0.1:8080/?numPages=2&qrSize=150&qrX=50&qrY=50`


### License

This project is licensed under the MIT License.
