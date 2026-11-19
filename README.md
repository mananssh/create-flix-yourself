# create-flix-yourself

Create your own Netflix-like streaming platform with one command.

## Quick Start

```bash
npx create-flix-yourself my-flix
cd my-flix
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You Get

- 🎬 **Full-featured streaming platform** - Netflix-like UI with video player
- 🗄️ **Multiple database options** - SQLite, PostgreSQL, or CockroachDB
- 💾 **Flexible storage** - Local filesystem, S3, R2, GCS, or Azure
- 🔐 **Authentication options** - None (single-user), internal, or NextAuth (OAuth)
- 🎨 **Content presets** - Couple, Family, Travel, Generic, and more
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- ⚡ **Built with Next.js 15** - React Server Components, App Router
- 🎯 **TypeScript** - Fully typed
- 💅 **Tailwind CSS** - Modern styling
- 🔄 **Prisma ORM** - Type-safe database access

## Usage

### Interactive Mode (Recommended)

```bash
npx create-flix-yourself
```

The CLI will guide you through:
1. Project name
2. Database provider (SQLite, PostgreSQL, CockroachDB)
3. Storage provider (Local, S3, R2, GCS, Azure)
4. Authentication method (None, Internal, NextAuth)
5. Content preset (Couple, Family, Travel, etc.)
6. Dependency installation
7. Git initialization
8. Database setup

### Non-Interactive Mode

Use defaults for quick setup:

```bash
npx create-flix-yourself my-flix --yes
```

### Options

- `[project-name]` - Name of the project directory (default: `my-flix`)
- `--yes` - Use default configuration (SQLite + Local storage + No auth)
- `--skip-install` - Skip dependency installation
- `--template-version <version>` - Use a specific template version/tag

### Examples

```bash
# Interactive setup
npx create-flix-yourself

# Quick setup with defaults
npx create-flix-yourself my-streaming-site --yes

# Custom project name, interactive
npx create-flix-yourself family-flix

# Skip dependency installation
npx create-flix-yourself my-flix --skip-install

# Use a specific template version
npx create-flix-yourself my-flix --template-version v1.0.0
```

## Requirements

- **Node.js 18+** - Required for Next.js 15
- **npm, pnpm, or yarn** - Package manager
- **Git** (optional) - For version control

## Configuration

The CLI generates two configuration files:

### `config.yaml`

Runtime configuration for your platform:

```yaml
database:
  provider: sqlite

storage:
  provider: local

auth:
  provider: none

content:
  preset: generic

features:
  continueWatching: true
  history: true
  profiles: false
  search: true
  subtitles: false
```

### `.env`

Environment variables for sensitive credentials:

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db

STORAGE_PROVIDER=local
STORAGE_LOCAL_PATH=./uploads

AUTH_PROVIDER=none

NODE_ENV=development
PORT=3000
```

## Provider Options

### Database Providers

- **SQLite** (Local, Free)
  - File-based database
  - Perfect for getting started
  - No external dependencies

- **PostgreSQL** (Local/Hosted, Free tier available)
  - Production-ready SQL database
  - Free hosting: Supabase, Neon, Railway
  - Requires connection URL

- **CockroachDB** (Hosted, Free tier)
  - Distributed SQL database
  - 10GB free tier
  - Requires connection URL

### Storage Providers

- **Local filesystem** (Free)
  - Store files on your server
  - Simple setup
  - No external dependencies

- **S3** (AWS)
  - AWS S3 object storage
  - Limited free tier
  - Requires AWS credentials

- **R2** (Cloudflare)
  - Cloudflare R2 (S3-compatible)
  - 10GB free tier
  - Requires Cloudflare account

- **GCS** (Google Cloud)
  - Google Cloud Storage
  - 5GB free tier
  - Requires GCP credentials

- **Azure Blob** (Microsoft)
  - Azure Blob Storage
  - Limited free tier
  - Requires Azure credentials

### Authentication Providers

- **None** (Single-user)
  - No authentication required
  - Perfect for personal use
  - Instant access

- **Internal** (bcrypt)
  - Username/password authentication
  - Self-hosted
  - Secure password hashing

- **NextAuth** (OAuth)
  - OAuth providers (Google, GitHub, etc.)
  - Self-hosted
  - Easy social login

### Content Presets

- **Generic** - Standard streaming platform
- **Couple** - For couples to share memories
- **Gift to friend** - Gift-themed collections
- **Family** - Family-friendly organization
- **Travel** - Travel videos and memories
- **Homework Mode** - Educational content focus
- **Custom** - Configure manually later

## After Installation

### 1. Configure Credentials (if needed)

If you chose PostgreSQL, CockroachDB, or cloud storage:

```bash
cd my-flix
nano .env  # or use your favorite editor
```

Add your database URL and storage credentials.

### 2. Run Database Setup (if skipped)

```bash
npx prisma generate
npx prisma db push
npm run db:seed  # Optional: seed with sample data
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Upload Content

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to upload videos and manage your platform.

## Project Structure

```
my-flix/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and configurations
│   └── ...
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── public/               # Static files
├── uploads/              # Uploaded videos (if using local storage)
├── config.yaml           # Runtime configuration
├── .env                  # Environment variables
├── package.json
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Troubleshooting

### "Directory already exists and is not empty"

Choose a different project name or remove the existing directory:

```bash
rm -rf my-flix
npx create-flix-yourself my-flix
```

### "Failed to fetch template"

Check your internet connection and try again. If the issue persists, the template repository may be temporarily unavailable.

### "Node.js 18 or higher is required"

Upgrade Node.js:

```bash
# Using nvm
nvm install 18
nvm use 18

# Or download from https://nodejs.org
```

### Database connection errors

Ensure your `.env` file has the correct `DATABASE_URL`:

```env
# PostgreSQL example
DATABASE_URL=postgresql://user:password@host:5432/database

# CockroachDB example
DATABASE_URL=postgresql://user:password@host:26257/defaultdb?sslmode=verify-full
```

## Documentation

- **Template Repository**: [github.com/mananssh/flix-yourself-template](https://github.com/mananssh/flix-yourself-template)
- **Configuration Guide**: See `config-options.md` in the generated project
- **Deployment Guide**: See `DEPLOYMENT.md` in the generated project

## License

MIT

## Support

- **Issues**: [github.com/mananssh/create-flix-yourself/issues](https://github.com/mananssh/create-flix-yourself/issues)
- **Template Issues**: [github.com/mananssh/flix-yourself-template/issues](https://github.com/mananssh/flix-yourself-template/issues)

---

**Happy streaming! 🍿**
