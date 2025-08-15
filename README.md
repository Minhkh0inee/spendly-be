# Spendly Backend

A comprehensive Node.js backend application for expense management that processes receipt images using OCR (Optical Character Recognition) and AI-powered parsing to extract relevant information. The application includes user authentication, project management, and receipt storage with cloud integration.

## Features

- **Receipt Processing**: Upload receipt images and extract text using Tesseract.js OCR
- **AI-Powered Parsing**: Uses Google's Gemini AI to intelligently parse receipt data
- **Cloud Storage**: Automatic image upload and storage using Cloudinary with timeout handling
- **User Authentication**: Complete user registration and login system with JWT
- **Project Management**: Organize receipts by projects and categories
- **Receipt Storage**: Save parsed receipts to MongoDB with full CRUD operations
- **Fallback Parser**: Custom receipt parsing logic when AI parsing fails
- **Timeout Protection**: Robust timeout handling for file uploads and processing
- **Input Validation**: Comprehensive data validation and error handling
- **RESTful API**: Clean API endpoints for all operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Cloud Storage**: Cloudinary for image storage and optimization
- **OCR**: Tesseract.js
- **AI Integration**: Google Generative AI (Gemini)
- **File Upload**: Multer with memory storage
- **Security**: Helmet, CORS, Rate limiting
- **Environment**: dotenv for configuration

## Project Structure

```
spendly-be/
├── index.js                    # Application entry point
├── package.json               # Dependencies and scripts
├── controllers/               # Route handlers
│   ├── auth.controller.js     # Authentication (register, login)
│   ├── upload.controller.js   # Receipt upload and processing
│   ├── user.controller.js     # User CRUD operations
│   ├── project.controller.js  # Project management
│   └── category.controller.js # Category management
├── db/
│   └── mongo_init.js         # MongoDB connection setup
├── middleware/
│   └── upload.middleware.js  # File upload middleware
├── models/
│   ├── user.model.js         # User schema definition
│   ├── receipt.model.js      # Receipt schema with items
│   ├── project.model.js      # Project schema
│   ├── category.model.js     # Category schema
│   └── expense.model.js      # Expense tracking schema
├── routes/
│   ├── auth.route.js         # Authentication endpoints
│   ├── upload.route.js       # Upload endpoints
│   ├── user.route.js         # User endpoints
│   ├── project.route.js      # Project endpoints
│   └── category.route.js     # Category endpoints
└── utils/
    ├── cloudinary.service.js # Cloudinary image upload service
    ├── gemini.service.js     # Google Gemini AI integration
    ├── ocr.service.js        # OCR text extraction
    ├── parseReceipt.js       # Fallback receipt parser
    ├── parseItems.js         # Items array validation
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
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/sign-in` | User login |

#### Register Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

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
| POST | `/api/upload` | Upload and process receipt image (OCR + AI parsing) |
| POST | `/api/upload/cloudinary` | Upload image to Cloudinary only |
| POST | `/api/upload/save` | Save complete receipt with image upload |

#### Upload Request
- **Content-Type**: `multipart/form-data`
- **Field Name**: `receipt`
- **File Types**: Image files (PNG, JPG, JPEG)
- **Max Size**: 5MB

#### Receipt Save Request
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `receipt` (file): Receipt image
  - `vendor` (string): Store name
  - `date` (string): Purchase date
  - `invoiceNumber` (string): Invoice number
  - `address` (string): Store address
  - `amount` (string): Total amount
  - `category` (string): Expense category
  - `items` (JSON string): Array of items

#### Items Format
```json
[
  {
    "name": "Product Name",
    "qty": 2,
    "price": 15.99
  }
]
```

#### Upload Response (OCR + AI Processing)
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

#### Receipt Save Response
```json
{
  "success": true,
  "data": {
    "_id": "receipt_id",
    "vendor": "Store Name",
    "date": "2024-01-15",
    "invoiceNumber": "INV-12345",
    "address": "123 Main St",
    "amount": "25.50",
    "category": "Food & Dining",
    "items": [
      {
        "name": "Product Name",
        "qty": 1,
        "price": 25.50
      }
    ],
    "imgUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/spendly/receipts/abc123def456.jpg",
    "createdAt": "2024-01-15T10:30:45.000Z",
    "updatedAt": "2024-01-15T10:30:45.000Z"
  },
  "message": "Save Receipt Successfully"
}
```

## How It Works

### Receipt Processing Flow

1. **Image Upload**: Client uploads receipt image via upload endpoints
2. **File Validation**: Middleware validates file type, size, and format
3. **Cloud Storage**: Image is uploaded to Cloudinary with optimizations:
   - Stored in organized folders (`spendly/receipts`)
   - Converted to JPG format for consistency
   - Optimized quality and dimensions
   - Timeout protection with retry mechanism
4. **OCR Processing**: Tesseract.js extracts text from the image buffer
5. **AI Parsing**: Google Gemini AI analyzes the OCR text and extracts:
   - Vendor/store name
   - Purchase date
   - Invoice number
   - Store address
   - Total amount
   - Individual items with quantities and prices
6. **Fallback Parser**: If AI parsing fails, a custom parser extracts basic information
7. **Data Validation**: Items array is validated and parsed using `parseItems` utility
8. **Database Storage**: Complete receipt data is saved to MongoDB with relationships
9. **Response**: Structured JSON data including all receipt information and image URL

### Authentication Flow

1. **User Registration**: Email and password validation, password hashing with bcryptjs
2. **User Login**: Credential verification and JWT token generation
3. **Token Management**: JWT tokens for secure API access
4. **Password Security**: Bcrypt hashing for secure password storage

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
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |
| `PORT` | Server port (default: 3000) | No |

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Dependencies

**Production:**
**Production:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cloudinary` - Cloud image storage and optimization
- `multer` - File upload handling
- `tesseract.js` - OCR processing
- `@google/generative-ai` - Google Gemini AI
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `cookie-parser` - Cookie parsing
- `dotenv` - Environment configuration
- `morgan` - HTTP request logger
- `body-parser` - Request body parsing

**Development:**
- `nodemon` - Development server with auto-restart

## Performance & Security Features

### Timeout Protection
- **Request timeout**: 60-second global timeout with proper error handling
- **Upload timeout**: 35-second timeout for Cloudinary uploads with Promise.race
- **Retry mechanism**: 3-attempt retry with exponential backoff for failed uploads
- **Stream management**: Automatic stream destruction on timeout

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for secure password storage
- **CORS Protection**: Configured cross-origin resource sharing
- **Rate Limiting**: Express rate limiting for API protection
- **Input Validation**: Comprehensive data validation and sanitization
- **File Validation**: Image type and size validation for uploads

### Data Models

#### Receipt Model
```javascript
{
  vendor: String (required),
  date: String (required),
  invoiceNumber: String (required),
  address: String (required),
  amount: String (required),
  category: String (required),
  items: [{
    name: String (required),
    qty: Number (required, min: 0),
    price: Number (required, min: 0)
  }],
  imgUrl: String (required),
  timestamps: true
}
```

#### User Model
```javascript
{
  name: String (required),
  email: String (required),
  password: String (required, hashed),
  timestamps: true
}
```

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
- **File upload validation** with proper MIME type checking
- **OCR processing failures** with detailed error messages
- **AI parsing errors** with automatic fallback to custom parser
- **Database connection issues** with retry mechanisms
- **Invalid request data** with specific validation messages
- **Authentication errors** with JWT validation
- **Timeout errors** with user-friendly responses
- **Cloudinary upload failures** with retry logic

## Testing

### Manual Testing Endpoints

1. **Test OCR Processing**:
   ```bash
   curl -X POST http://localhost:3000/api/upload \
     -F "receipt=@path/to/receipt.jpg"
   ```

2. **Test Complete Receipt Save**:
   ```bash
   curl -X POST http://localhost:3000/api/upload/save \
     -F "receipt=@path/to/receipt.jpg" \
     -F "vendor=Test Store" \
     -F "date=2024-01-15" \
     -F "invoiceNumber=INV-123" \
     -F "address=123 Test St" \
     -F "amount=25.50" \
     -F "category=Food" \
     -F 'items=[{"name":"Test Item","qty":1,"price":25.50}]'
   ```

3. **Test User Registration**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

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
