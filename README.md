# 💰 Money Flow - Personal Finance Management

A modern, feature-rich personal finance management application built with React, TypeScript, and a scalable feature-first architecture.

## 📋 Project Overview

Money Flow helps users manage their personal finances with an intuitive interface for tracking income, expenses, categories, and financial goals. The application features real-time data visualization, responsive design, and a clean, modern UI.

## 🏗️ Architecture

This project follows a **feature-first architecture** pattern for optimal maintainability, scalability, and team collaboration:

```
src/
├── app/                           # Application-level configuration
│   └── layouts/                  # Global layout components
│       ├── auth-layout.tsx       # Authentication pages layout
│       └── dashboard-layout.tsx  # Main dashboard layout
│
├── features/                     # Feature-based modules (self-contained)
│   ├── auth/                     # Authentication feature
│   │   ├── pages/               # Auth-specific pages
│   │   │   ├── login.tsx        # Login page
│   │   │   └── register.tsx     # Registration page
│   │   ├── services/            # Auth API services
│   │   │   └── auth-service.ts  # Authentication service
│   │   └── store/               # Auth state management
│   │       └── use-auth-store.ts
│   │
│   ├── categories/               # Categories management feature
│   │   ├── pages/               # Category pages
│   │   │   └── categories.tsx   # Categories management page
│   │   ├── components/          # Category-specific components
│   │   │   ├── category-manager.tsx
│   │   │   └── quick-category-create.tsx
│   │   ├── services/            # Category API services
│   │   │   └── categories-service.ts
│   │   ├── store/               # Category state management
│   │   │   └── use-category-store.ts
│   │   └── dto/                 # Category data transfer objects
│   │       └── create-category.dto.ts
│   │
│   └── transactions/             # Transactions management feature
│       ├── pages/               # Transaction pages
│       │   ├── overview.tsx     # Dashboard overview
│       │   ├── transactions.tsx # Transactions list
│       │   ├── reports.tsx      # Financial reports
│       │   ├── goals.tsx        # Financial goals
│       │   └── settings.tsx     # User settings
│       ├── components/          # Transaction-specific components
│       │   ├── transaction-form.tsx
│       │   ├── transaction-list.tsx
│       │   ├── transaction-filters.tsx
│       │   ├── finance-chart.tsx
│       │   ├── balance-evolution-chart.tsx
│       │   └── monthly-comparison-chart.tsx
│       ├── services/            # Transaction API services
│       │   └── transactions-service.ts
│       ├── store/               # Transaction state management
│       │   └── use-transaction-store.ts
│       └── dto/                 # Transaction data transfer objects
│           └── create-transaction.dto.ts
│
├── shared/                       # Shared utilities and components
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (40+ components)
│   ├── components/              # Custom shared components
│   │   ├── app-sidebar.tsx      # Main navigation sidebar
│   │   ├── balance-card.tsx     # Balance display card
│   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   ├── api/                     # API configuration
│   │   └── axios.ts             # Axios instance configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-categories.ts    # Categories data hook
│   │   ├── use-transactions.ts  # Transactions data hook
│   │   ├── use-mobile.ts        # Mobile detection hook
│   │   └── use-toast.ts         # Toast notifications hook
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # Common utilities (cn, formatters)
│   ├── constants/               # Application constants
│   │   └── category-type.const.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts              # Authentication types
│   │   ├── categories.ts        # Category types
│   │   └── transaction.ts       # Transaction types
│   └── model/                   # Data models
│       ├── category.model.ts    # Category data model
│       └── transaction.model.ts # Transaction data model
│
└── pages/                       # Global pages
    ├── landing.tsx              # Landing page
    └── not-found.tsx            # 404 error page
```

## ✨ Key Features

### 💳 Transaction Management
- **Add Transactions**: Quick form for income and expenses
- **Transaction List**: View all transactions with filtering and search
- **Real-time Updates**: Instant updates across all components
- **Date Management**: Pre-filled current date with timezone handling

### 📊 Financial Analytics
- **Overview Dashboard**: Visual summary of financial status
- **Interactive Charts**: Pie charts, bar charts, and line graphs
- **Monthly Comparisons**: Track spending patterns over time
- **Balance Evolution**: Monitor account balance changes

### 🏷️ Category Management
- **Custom Categories**: Create personalized income/expense categories
- **Quick Creation**: Fast category creation from transaction form
- **Visual Organization**: Icons and colors for easy identification
- **Category Analytics**: Spending breakdown by category

### 🎯 Goal Setting
- **Financial Goals**: Set and track savings targets
- **Progress Monitoring**: Visual progress indicators
- **Goal Management**: Create, edit, and delete goals

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Theme switching with system preference detection
- **Modern UI**: Clean, intuitive interface using shadcn/ui
- **Real-time Feedback**: Toast notifications and loading states

## 💻 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Local Development

```sh
# Clone the repository
git clone <repository-url>
cd money-flow-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## 🛠️ Technology Stack

### Core Framework
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Lightning-fast build tool and development server

### UI & Styling
- **shadcn/ui** - High-quality, accessible UI component library
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable SVG icons
- **next-themes** - Theme management (dark/light mode)

### State Management & Data
- **Zustand** - Lightweight state management library
- **React Query (TanStack Query)** - Server state management and caching
- **Axios** - HTTP client for API requests

### Routing & Navigation
- **React Router v6** - Declarative routing for React applications

### Data Visualization
- **Recharts** - Composable charting library built on React and D3

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **TypeScript** - Static type checking


## 📁 Project Structure Guidelines

### Feature-First Architecture Benefits
- **Modularity**: Each feature is self-contained and independent
- **Scalability**: Easy to add new features without affecting existing ones
- **Team Collaboration**: Different teams can work on different features
- **Maintainability**: Clear separation of concerns and responsibilities

### Directory Conventions
- **kebab-case**: All files and directories use kebab-case naming
- **Feature Organization**: Each feature contains its own pages, components, services, and store
- **Shared Resources**: Common utilities and components in the `shared/` directory
- **Type Safety**: All TypeScript types and interfaces properly defined

### Import Path Aliases
```typescript
// Configured aliases for clean imports
@/app/*          // src/app/*
@/shared/*       // src/shared/*
@/features/*     // src/features/*
@/*              // src/*
```

### Code Organization Principles
1. **Single Responsibility**: Each file has one clear purpose
2. **Feature Isolation**: Features don't directly import from other features
3. **Shared Dependencies**: Common code goes in `shared/`
4. **Type Safety**: All data flows are typed with TypeScript
5. **Consistent Patterns**: Similar functionality follows the same patterns

## 🚀 Deployment

### Build for Production
```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Deploy the contents to your hosting provider
```

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy from the `dist/` folder or connect to Git
- **GitHub Pages**: Deploy the `dist/` folder to GitHub Pages
- **Any Static Host**: Upload the `dist/` folder contents to any static hosting service

### Development Workflow
1. **Feature Development**: Create new features in the `features/` directory
2. **Shared Components**: Add reusable components to `shared/`
3. **Type Safety**: Always define TypeScript types for new data structures
4. **Testing**: Test new features thoroughly before committing
5. **Code Style**: Follow the established patterns and naming conventions

### Adding New Features
1. Create a new directory under `src/features/`
2. Follow the established structure: `pages/`, `components/`, `services/`, `store/`
3. Update routing in `App.tsx` if needed
4. Add any shared types to `shared/types/`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
