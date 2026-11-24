# Campus Swap - Student Marketplace

A modern, responsive marketplace platform designed specifically for students to buy, sell, and swap textbooks and electronics. Built with HTML, CSS, and JavaScript, featuring a clean interface and comprehensive functionality for campus commerce.

## 🎯 Project Overview

Campus Swap is a student-focused marketplace that facilitates the exchange of textbooks and electronics within university communities. The platform addresses the common need for affordable academic materials and technology among students while promoting sustainable consumption practices.

## ✨ Features Currently Implemented

### 🏪 Marketplace
- **Searchable Product Grid**: Browse through textbooks and electronics with real-time search functionality
- **Advanced Filtering**: Filter by category (textbooks/electronics) and price ranges
- **Product Cards**: Clean, informative cards displaying item details, pricing, and listing type
- **Sample Data**: Pre-loaded with 6 sample products to demonstrate functionality

### 📋 Post an Item
- **Comprehensive Form**: Multi-step form for posting new items
- **Category Selection**: Choose between textbooks and electronics
- **Condition Assessment**: Rate items from new to fair condition
- **Flexible Pricing**: Support for sale, swap, or both listing types
- **Contact Information**: Email and optional phone contact details
- **Image Upload**: File upload interface for product photos

### 📊 Student Dashboard
- **Statistics Overview**: Track active listings, total views, and successful swaps
- **My Listings Management**: View and manage all your posted items
- **Quick Actions**: Edit or delete listings directly from the dashboard
- **Empty State Handling**: Helpful prompts when no listings exist

### 🎨 Design & UX
- **Modern, Clean Design**: Professional appearance suitable for academic environments
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and hover effects
- **Notification System**: User-friendly success/error messages
- **Mobile Navigation**: Hamburger menu for smaller screens

## 🚀 Technical Implementation

### File Structure
```
campus-swap/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Comprehensive styling
├── js/
│   └── main.js         # Interactive functionality
└── README.md           # This documentation
```

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties, Flexbox, and Grid
- **Vanilla JavaScript**: ES6+ features, async/await, class-based architecture
- **Font Awesome**: Professional icons throughout the interface
- **Google Fonts**: Inter font family for excellent readability

### Key JavaScript Features
- **Class-based Architecture**: `CampusSwap` class encapsulates all functionality
- **Event-driven Programming**: Efficient event handling and delegation
- **Data Management**: In-memory product storage with filtering capabilities
- **Form Validation**: Client-side validation for user inputs
- **Responsive Design**: Mobile-first approach with CSS media queries

## 📈 Data Model

### Products Table Schema
The application uses a RESTful Table API with the following schema:

| Field | Type | Description |
|-------|------|-------------|
| id | text | Unique identifier |
| title | text | Product title/name |
| category | text | Category (textbooks/electronics) |
| condition | text | Item condition (new/like-new/good/fair) |
| description | rich_text | Detailed product description |
| price | number | Price in USD |
| type | text | Listing type (sale/swap/both) |
| contactEmail | text | Contact email address |
| contactPhone | text | Contact phone (optional) |
| userId | text | ID of the posting user |
| views | number | Number of times viewed |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |
| deleted | bool | Soft delete flag |

## 🎯 User Functional Entry Points

### Main Navigation
- **Marketplace**: `#marketplace` - Browse and search all available items
- **Dashboard**: `#dashboard` - View personal statistics and manage listings
- **Post Item**: `#post-item` - Create new product listings

### Key Interactions
1. **Search**: Real-time filtering as you type in the search bar
2. **Category Filter**: Dropdown to filter by textbooks or electronics
3. **Price Filter**: Price range filtering (0-25, 25-50, 50-100, 100+)
4. **Product Cards**: Click to view item details
5. **Form Submission**: Post new items with validation
6. **Listing Management**: Edit/delete your own listings

## 🌟 Sample Data

The application comes pre-loaded with 6 sample products:

1. **Calculus Textbook - 8th Edition** - $45 (Good condition, For Sale)
2. **MacBook Air 2020** - $750 (Like-new, For Sale)
3. **Physics Lab Manual** - $25 (New, Sale or Swap)
4. **iPad Pro 11" 2021** - $650 (Good, For Swap)
5. **Chemistry Textbook** - $20 (Fair, For Sale)
6. **Sony WH-1000XM4 Headphones** - $200 (Like-new, Sale or Swap)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

### Mobile Features
- Stacked navigation with hamburger menu
- Single-column product grid
- Stacked form layouts
- Touch-friendly button sizes
- Optimized typography scaling

## 🔧 Configuration Options

### CSS Custom Properties
The design uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #f59e0b;
    --success-color: #10b981;
    --text-primary: #1f2937;
    --bg-primary: #ffffff;
    /* ... more variables */
}
```

### JavaScript Configuration
The main application can be configured by modifying the `CampusSwap` class:

- Sample data loading
- Filter options
- Notification timing
- Form validation rules

## 🚀 Deployment Instructions

To deploy your Campus Swap marketplace:

1. **Prepare Files**: Ensure all files are in the correct structure
2. **Test Locally**: Open `index.html` in a web browser to verify functionality
3. **Deploy**: Use the Publish tab to make your website live
4. **Access API**: The RESTful Table API endpoints are automatically available

### API Endpoints
- `GET /tables/products` - List all products
- `GET /tables/products/{id}` - Get specific product
- `POST /tables/products` - Create new product
- `PUT /tables/products/{id}` - Update product
- `DELETE /tables/products/{id}` - Delete product

## 🎨 Customization Options

### Styling Modifications
- Update CSS custom properties in `:root` for color schemes
- Modify `css/style.css` for layout changes
- Adjust responsive breakpoints as needed

### Functionality Extensions
- Add new categories in the HTML form and JavaScript validation
- Implement user authentication system
- Add image upload functionality
- Integrate with external payment systems
- Add messaging between users

### Sample Data Updates
- Modify the `loadSampleData()` method in `js/main.js`
- Update the `TableDataAdd` function for different sample products

## 🔒 Security Considerations

### Current Implementation
- Client-side validation (supplement with server-side validation)
- No user authentication (consider adding for production)
- Email validation but no verification system
- File upload interface (requires backend implementation)

### Production Recommendations
- Implement proper user authentication
- Add server-side form validation
- Implement CSRF protection
- Add rate limiting for form submissions
- Secure file upload functionality

## 🐛 Known Limitations

1. **No Backend Integration**: Currently uses in-memory storage
2. **No User Authentication**: No login/signup functionality
3. **No Image Upload**: File upload interface needs backend implementation
4. **No Payment Processing**: No integration with payment systems
5. **No Messaging**: No way for buyers/sellers to communicate
6. **Limited Categories**: Only textbooks and electronics supported

## 🔄 Future Enhancements

### High Priority
- User authentication and profiles
- Real backend integration with database
- Image upload and storage
- Category expansion (furniture, supplies, etc.)

### Medium Priority
- In-app messaging system
- Favorite/bookmark functionality
- Advanced search with filters
- Price negotiation features
- Location-based filtering

### Low Priority
- Mobile app development
- Payment gateway integration
- Social sharing features
- Analytics dashboard
- Push notifications

## 📚 Learning Resources

### Web Development Concepts
- Responsive web design principles
- CSS Grid and Flexbox layouts
- JavaScript ES6+ features
- DOM manipulation and event handling
- Form validation techniques

### Best Practices Applied
- Semantic HTML structure
- Mobile-first responsive design
- Accessibility considerations
- Performance optimization
- Clean, maintainable code

## 🤝 Contributing

When contributing to this project:

1. Maintain the existing code style and structure
2. Test changes across different screen sizes
3. Update documentation for new features
4. Follow semantic versioning for releases
5. Consider accessibility in all UI changes

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed for educational and commercial purposes.

## 🆘 Support

For issues or questions:
1. Check the documentation first
2. Review the browser console for JavaScript errors
3. Test with different browsers and devices
4. Verify API endpoints are accessible
5. Check network connectivity for external resources

---

**Campus Swap** - Empowering students to save money and reduce waste through smart campus commerce!