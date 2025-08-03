# Spendly Backend

A Node.js backend application for expense management that processes receipt images using OCR (Optical Character Recognition) and AI-powered parsing to extract relevant information.

## Features

- **Receipt Processing**: Upload receipt images and extract text using Tesseract.js OCR
- **AI-Powered Parsing**: Uses Google's Gemini AI to intelligently parse receipt data
- **User Management**: Complete CRUD operations for user accounts
- **Fallback Parser**: Custom receipt parsing logic when AI parsing fails
- **RESTful API**: Clean API endpoints for all operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **OCR**: Tesseract.js
- **AI Integration**: Google Generative AI (Gemini)
- **File Upload**: Multer
- **Environment**: dotenv for configuration

## Project Structure

```
spendly-be/
├── index.js                    # Application entry point
├── package.json               # Dependencies and scripts
├── controllers/               # Route handlers
│   ├── upload.controller.js   # Receipt upload and processing
│   └── user.controller.js     # User CRUD operations
├── db/
│   └── mongo_init.js         # MongoDB connection setup
├── middleware/
│   └── upload.middleware.js  # File upload middleware
├── models/
│   └── user.model.js         # User schema definition
├── routes/
│   ├── upload.route.js       # Upload endpoints
│   └── user.route.js         # User endpoints
└── utils/
    ├── gemini.service.js     # Google Gemini AI integration
    ├── ocr.service.js        # OCR text extraction
    ├── parseReceipt.js       # Fallback receipt parser
    └── response.util.js      # API response utilities
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spendly-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/spendly
   
   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Server Configuration
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a new user |
| PATCH | `/api/users/update/:id` | Update user by ID |
| DELETE | `/api/users/delete/:id` | Delete user by ID |

#### User Model
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

### Receipt Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload and process receipt image |

#### Upload Request
- **Content-Type**: `multipart/form-data`
- **Field Name**: `receipt`
- **File Types**: Image files (PNG, JPG, JPEG)
- **Max Size**: 5MB

#### Upload Response
```json
{
  "success": true,
  "data": {
    "vendor": "Store Name",
    "date": "2024-01-15",
    "invoiceNumber": "INV-12345",
    "address": "123 Main St",
    "amount": "25.50",
    "items": [
      {
        "name": "Product Name",
        "qty": 1,
        "price": 25.50
      }
    ]
  },
  "message": "OCR and parsing successful"
}
```

## How It Works

### Receipt Processing Flow

1. **Image Upload**: Client uploads receipt image via `/api/upload` endpoint
2. **OCR Processing**: Tesseract.js extracts text from the image
3. **AI Parsing**: Google Gemini AI analyzes the OCR text and extracts:
   - Vendor/store name
   - Purchase date
   - Invoice number
   - Store address
   - Total amount
   - Individual items with quantities and prices
4. **Fallback Parser**: If AI parsing fails, a custom parser extracts basic information
5. **Response**: Structured JSON data is returned to the client

### OCR Configuration

The OCR service is configured with:
- Character whitelist for better accuracy
- Single block page segmentation mode
- English language recognition

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `PORT` | Server port (default: 3000) | No |

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Dependencies

**Production:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `multer` - File upload handling
- `tesseract.js` - OCR processing
- `@google/generative-ai` - Google Gemini AI
- `dotenv` - Environment configuration
- `morgan` - HTTP request logger
- `body-parser` - Request body parsing

**Development:**
- `nodemon` - Development server with auto-restart

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Error Handling

The application includes comprehensive error handling for:
- File upload validation
- OCR processing failures
- AI parsing errors with fallback
- Database connection issues
- Invalid request data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please open an issue in the repository or contact the development team.
