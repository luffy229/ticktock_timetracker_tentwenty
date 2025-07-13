
# Ticktock Timesheet Tracker

A modern, responsive timesheet management application built with React and TypeScript. This application allows users to track their weekly timesheets with different status levels and provides a clean, professional interface for timesheet management.

## 🚀 Online Demo

[Live Demo](ticktock-timetracker-tentwenty.vercel.app) - Visit the working application

## 📋 Features

- **User Authentication**: Demo login system with localStorage persistence
- **Timesheet Management**: Track weekly timesheets with different statuses
- **Status Tracking**: 
  - ✅ Completed (view-only)
  - ⚠️ Incomplete (editable)
  - ❌ Missing (create new)
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with Ticktock branding
- **Real-time Updates**: Instant feedback and status updates

## 🛠️ Technologies Used

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Beautiful icon library
- **Custom CSS Variables** - Consistent theming system

### State Management & Data
- **React Context API** - Authentication state management
- **localStorage** - Client-side data persistence
- **Mock API** - Simulated backend for demo purposes

### Additional Libraries
- **React Router DOM** - Client-side routing
- **Class Variance Authority** - Component variant management
- **Date-fns** - Date manipulation utilities
- **React Hook Form** - Form state management

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── timesheet/         # Timesheet management components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── pages/                # Main page components
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and mock data
└── api/                  # API layer (mock implementation)
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/luffy229/ticktock_timetracker_tentwenty.git>
   cd ticktock-timesheet-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Login Credentials
- **Email**: `demo@timetracker.com`
- **Password**: `demo123`

## 📝 Usage

1. **Login**: Use the demo credentials to access the application
2. **Dashboard**: View your timesheet summary and quick actions
3. **Timesheet Table**: 
   - View completed timesheets
   - Update incomplete timesheets
   - Create missing timesheets
4. **Weekly View**: Detailed timesheet entry and task management

## 🎨 Design System

The application uses a custom design system with:
- **Primary Color**: Ticktock Blue (`hsl(220, 100%, 50%)`)
- **Status Colors**: 
  - Completed: Green (`hsl(160, 84%, 39%)`)
  - Incomplete: Orange (`hsl(25, 95%, 53%)`)
  - Missing: Red (`hsl(348, 83%, 47%)`)
- **Typography**: Clean, modern font stack
- **Spacing**: Consistent 8px grid system

## 🔧 Assumptions & Notes

### Technical Assumptions
- **Mock Data**: The application uses mock data and localStorage for demonstration
- **Authentication**: Simplified demo authentication (not production-ready)
- **Client-Side Only**: No backend server required for demo purposes
- **Modern Browsers**: Assumes support for ES6+ and CSS Grid/Flexbox

### Business Logic Assumptions
- **Weekly Timesheets**: Timesheets are organized by calendar weeks
- **Status Workflow**: 
  - Missing → Incomplete → Completed (linear progression)
  - Users can view completed timesheets but not edit them
- **Work Week**: Assumes Monday-Sunday work weeks
- **Single User**: Demo supports one user session at a time

### Design Assumptions
- **Mobile-First**: Designed primarily for mobile/tablet usage
- **Professional Context**: UI designed for corporate timesheet tracking
- **Accessibility**: Basic accessibility features implemented

## ⏱️ Time Spent

**Total Development Time: ~7 hours**

### Breakdown:
- **Project Setup & Architecture**: 0.5 hours
  - Vite configuration
  - TypeScript setup
  - Project structure planning
  
- **Authentication System**: 1 hours
  - Login form components
  - Auth context and hooks
  - localStorage persistence
  
- **UI Components & Design System**: 2 hours
  - shadcn/ui integration
  - Custom theming and CSS variables
  - Responsive design implementation
  
- **Timesheet Components**: 2 hours
  - Table component with status logic
  - Modal components for timesheet entry
  - Weekly view implementation
  
- **Data Layer & State Management**: 0.5 hours
  - Mock API implementation
  - Type definitions
  - State management setup
  
- **Testing & Polish**: 0.5 hours
  - Cross-browser testing
  - Mobile responsiveness
  - Final UI polish

## 🚀 Deployment

The application is deployed on Lovable's platform and can be accessed at the demo link above. For custom deployment:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service (Netlify, Vercel, etc.)

## 📄 License

This project is part of a coding assessment and is for demonstration purposes only.

## 🤝 Contributing

This is a demo project, but feedback and suggestions are welcome!

---

**Built with ❤️ By Pratik using React, TypeScript, and Tailwind CSS**
