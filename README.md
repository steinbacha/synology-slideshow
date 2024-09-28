# Synology Photo Album Downloader and Slideshow Server

This Node.js application connects to a Synology NAS, downloads a specified photo album, extracts the images, and serves them via a simple slideshow on a web server.

## Features
- Authenticates with a Synology NAS to access the photo album.
- Downloads and extracts images from a specified album in the Synology NAS.
- Serves a slideshow of the images using an Express.js server.
- Provides an `/update` endpoint to refresh the images from the Synology NAS.

## Prerequisites
- Node.js (v12+)
- Synology NAS with access to the API
- An album ID from the Synology NAS
- `npm` package manager
- Environment variables for Synology API access

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/synology-photo-album-downloader.git
    cd synology-photo-album-downloader
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory of the project:
     ```bash
     touch .env
     ```
   - Add the following lines to the `.env` file and fill in the required values:
     ```bash
     SYNOLOGY_API_URL=http://<your-synology-ip>:<port>/webapi
     API_USER=<your-synology-username>
     API_PASS=<your-synology-password>
     ALBUM_ID=<album-id>
     ```

4. **Set up directories:**
   - The application will create the following directories automatically:
     - `images`: Stores the downloaded and extracted images.
     - `temp`: Temporary directory for downloaded files.

## Usage

1. **Start the server:**
    ```bash
    node app.js
    ```
   - The server will run on `http://localhost:3000`.

2. **Update Images:**
   - To download and update the images from the Synology album, navigate to:
     ```
     http://localhost:3000/update
     ```
   - This endpoint will authenticate with the Synology NAS, download the album, extract the images, and store them in the `images` directory.

3. **View the Slideshow:**
   - Once the images are downloaded, you can view the slideshow at:
     ```
     http://localhost:3000/
     ```

## Project Structure

- `app.js`: The main application file containing the server logic.
- `.env`: Environment variables (not included in the repository; you need to create this file).
- `images/`: Directory where extracted images will be stored.
- `temp/`: Temporary directory used to store downloaded files before extraction.

## Endpoints

- **`GET /update`**: Authenticates with the Synology NAS, downloads the specified album, extracts the images, and saves them in the `images` directory.
- **`GET /`**: Serves the slideshow of the images stored in the `images` directory.
- **`GET /images/<filename>`**: Serves individual image files as static content.

## Dependencies

- `express`: Web server framework for Node.js.
- `request-promise-native`: Simplified HTTP request client with promise support.
- `adm-zip`: Utility for zip file management.
- `dotenv`: Loads environment variables from a `.env` file.
- `ejs`: Embedded JavaScript templates for server-side rendering.

## Error Handling
- Errors during Synology API authentication, album download, or file extraction are logged to the console and return an HTTP 500 status with a relevant message.

## Notes
- Make sure the Synology NAS has the API enabled and the user credentials have access to the album.
- Use secure practices when handling sensitive information such as credentials in the `.env` file.

## License
This project is licensed under the MIT License.
