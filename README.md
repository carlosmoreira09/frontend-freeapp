# AppFree - Frontend

AppFree is a modern web application built with React, TypeScript, and Vite that provides a platform for managing client transactions and accounts. The application features separate interfaces for clients and administrators.

## 🚀 Features

### Client Features
- **Dashboard**: Overview of account status and recent activities
- **Transaction Management**: View, add, and manage financial transactions
- **Profile Management**: Update personal information and account settings
- **Responsive Design**: Fully responsive interface for mobile and desktop

### Admin Features
- **Admin Dashboard**: Overview of system metrics and activities
- **Client Management**: View and manage client accounts
- **System Settings**: Configure application settings

## 🛠️ Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Heroicons, Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/frontend-appfree.git
   cd frontend-appfree
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🏗️ Project Structure

```
frontend-appfree/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication related components
│   │   └── layout/     # Layout components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── pages/
│   │   ├── admin/      # Admin interface pages
│   │   ├── auth/       # Authentication pages
│   │   └── client/     # Client interface pages
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # TailwindCSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🔐 Authentication

The application supports two types of users:
- **Clients**: Regular users who can manage their transactions
- **Administrators**: Users with elevated privileges who can manage clients and system settings

## 🎨 UI/UX

The application uses a modern, clean interface with an orange-based color scheme. It's fully responsive and works well on both desktop and mobile devices.

## 🧪 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## 📱 Mobile Support

The application is fully responsive and includes a mobile-specific footer menu for easy navigation on smaller screens.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

For more information, please contact us at [contact@appfree.com](mailto:contact@appfree.com) or via WhatsApp at +55 11 97126-7641.
# frontend-freeapp
