# HelpDesk EDU - College Complaint Management System

A comprehensive digital complaint management system built with Next.js and MongoDB for college services.

## Features

- **Student Authentication**: Login using registration number from ID card barcode
- **Comprehensive Service Coverage**: 20+ college services including hostels, mess, gym, library, etc.
- **Real-time Complaint Tracking**: Track complaint status from submission to resolution
- **Priority Management**: Categorize complaints by priority (low, medium, high, urgent)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure & Fast**: Built with modern web technologies

## Services Covered

### Food Services
- Thapa Mess
- ABC Mess
- Girls Mess
- Food Court
- Open Air Cafeteria
- Juice Shop
- Pizza Shop

### Accommodation
- Abdul Kalam Hostel
- Vishveshwaria Hostel
- Gurbir Hostel
- Kalpana Chawla Hostel
- Mess Side Hostel
- Nand Hostel

### Facilities
- Laundry Service
- Gym Service
- Girls Gym
- Barber
- Stationary
- General Store

### Academic
- Library

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HelpDesk-EDU
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://nayaksumaanyu:purupia123@cluster0.5deqr.mongodb.net/helpdesk_edu?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Usage

### For Students

1. **Registration**
   - Navigate to the registration page
   - Fill in your details including registration number, name, email, department, and year
   - Submit to create your account

2. **Login**
   - Use your registration number to login
   - No password required - authentication is based on registration number

3. **Submit Complaints**
   - Access the dashboard after login
   - Click "New Complaint" to submit a complaint
   - Select the service, provide title and description
   - Set priority level
   - Submit and track status

4. **Track Complaints**
   - View all your complaints on the dashboard
   - Filter by status or service
   - See real-time updates on complaint resolution

### For Administrators

Admin functionality can be extended to include:
- Complaint management and resolution
- Student management
- Service management
- Reports and analytics

## Database Schema

### Students Collection
```javascript
{
  registrationNo: String (unique, required),
  name: String (required),
  email: String (unique, required),
  department: String (required),
  year: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaints Collection
```javascript
{
  studentId: ObjectId (ref: Student),
  registrationNo: String (required),
  serviceId: String (required),
  serviceName: String (required),
  title: String (required, max: 200),
  description: String (required, max: 1000),
  status: String (enum: pending, in_progress, resolved, closed),
  priority: String (enum: low, medium, high, urgent),
  adminNotes: String (max: 500),
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Student login

### Complaints
- `GET /api/complaints` - Get student complaints (with pagination and filters)
- `POST /api/complaints` - Submit new complaint

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

### Other Platforms

The application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- **Authentication**: Uses JWT tokens for secure authentication
- **Input Validation**: All inputs are validated on both client and server side
- **Rate Limiting**: Consider implementing rate limiting for API endpoints
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Keep sensitive data in environment variables

## Future Enhancements

- **Admin Dashboard**: Complete admin interface for complaint management
- **Email Notifications**: Send email updates on complaint status changes
- **File Attachments**: Allow students to attach images/documents to complaints
- **Real-time Updates**: WebSocket integration for real-time status updates
- **Analytics Dashboard**: Complaint analytics and reporting
- **Mobile App**: React Native mobile application
- **Push Notifications**: Browser and mobile push notifications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@helpdesk-edu.com

## Acknowledgments

- Built with Next.js and MongoDB
- UI inspired by modern dashboard designs
- Icons by Lucide React
- Styling with Tailwind CSS
