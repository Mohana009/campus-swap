## Setup and Installation

Follow these steps to run Campus Swap on your local machine.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Visual Studio Code
- MongoDB Atlas account
- Cloudinary account
- VS Code Live Server extension

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone -b frontend https://github.com/Mohana009/campus-swap.git
```

Navigate to the project folder:

```bash
cd campus-swap
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your own MongoDB Atlas and Cloudinary credentials.

**Note:** Never share or upload your `.env` file to GitHub.

### 4. Start the Backend Server

Inside the backend folder, run:

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

The product API is available at:

```text
http://localhost:5000/api/products
```

### 5. Frontend Setup

1. Open the `frontend` folder in Visual Studio Code.
2. Open `js/main.js`.
3. Make sure the API base URL points to your running backend:

```text
http://localhost:5000/api/products
```

4. Right-click `index.html`.
5. Select **Open with Live Server**.

The Campus Swap website will open in your browser.

### 6. Start Using Campus Swap

You can now:

- Browse available products.
- Search and filter listings.
- Post items for sale or exchange.
- Upload product images.
- Edit existing listings.
- Delete listings.

Product information is stored in MongoDB Atlas, and uploaded images are hosted using Cloudinary.
