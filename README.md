# Bozorcha E-Commerce Platform

Modern e-commerce platform built with React and Express.js for the Uzbekistan market.

## Features

- **Product Management**: Full CRUD operations for products with categories, pricing, and inventory
- **AI-Powered Blog**: Automated blog post generation using Google Gemini AI
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and content
- **Shopping Cart**: Full shopping cart functionality with order management
- **Responsive Design**: Mobile-first design using Tailwind CSS and shadcn/ui components
- **SEO Optimized**: Built-in SEO tools and meta tag management
- **Bilingual Support**: Uzbek and Russian language support
- **Email Integration**: Contact form with SendGrid email functionality
- **Analytics**: Google Analytics integration for tracking
- **Newsletter**: Email subscription system

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini API for content generation
- **Email**: SendGrid for email delivery
- **Analytics**: Google Analytics 4
- **Deployment**: Replit Platform / Render

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file with:
DATABASE_URL=your_postgres_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

3. Run database migrations:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment to Render

### Prerequisites
- Render account (sign up at https://render.com)
- GitHub repository with your code
- PostgreSQL database (can be created on Render)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/bozorcha.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Fill in database details:
   - **Name**: `bozorcha-db`
   - **Database**: `bozorcha`
   - **User**: `bozorcha_user`
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 3: Deploy Web Service

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in service details:
   - **Name**: `bozorcha`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`

### Step 4: Configure Environment Variables

In the "Environment" section, add these variables:

```
DATABASE_URL=postgresql://your_database_url_from_step2
GEMINI_API_KEY=your_google_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
NODE_ENV=production
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Your app will be available at `https://bozorcha.onrender.com`

### Step 6: Database Setup (First Time Only)

After deployment, run database migrations:

1. Go to your service dashboard
2. Open "Shell" tab
3. Run: `npm run db:push`

### Environment Variables Details

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `SENDGRID_API_KEY` | SendGrid email service API key | Optional |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics measurement ID | Optional |
| `NODE_ENV` | Set to "production" for production builds | Yes |

### Getting API Keys

#### Google Gemini API
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy the key

#### SendGrid API
1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create new API key with "Full Access"
4. Copy the key

#### Google Analytics
1. Go to https://analytics.google.com
2. Create new property
3. Copy Measurement ID (starts with G-)

### Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

### Troubleshooting

#### Common Issues:

1. **Build fails**: Check if all dependencies are in package.json
2. **Database connection error**: Verify DATABASE_URL is correct
3. **Environment variables not working**: Make sure VITE_ prefix is used for client-side variables
4. **Email not sending**: Verify SENDGRID_API_KEY and email configuration

#### Logs:

Check deployment logs in Render dashboard under "Logs" tab.

#### Performance:

- Render free tier has limitations (sleeps after 15 min of inactivity)
- Consider upgrading to paid plan for production use
- Use Redis for session storage in production

### Monitoring

- Monitor your app health in Render dashboard
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Use Google Analytics for user tracking

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/blog` - Get blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/orders` - Create order
- `POST /api/contact` - Send contact form email

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/orders` - Get all orders

### SEO Endpoints
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots.txt file
- `GET /api/seo/analyze` - SEO analysis tool

## Authentication

Admin routes require Bearer token authentication:
```
Authorization: Bearer Gisobot201415*
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

MIT License