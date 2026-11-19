# Testing Guide for create-flix-yourself

## Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn
- Git installed (for git initialization test)
- Internet connection (for template fetching)

## Local Testing Setup

### 1. Build the CLI

```bash
cd /c/Users/manan/projects/flix-yourself/create-flix-yourself
npm install
npm run build
```

### 2. Link for Local Testing

```bash
npm link
```

This makes `create-flix-yourself` available globally for testing.

### 3. Verify CLI is Working

```bash
# Check version
create-flix-yourself --version

# Check help
create-flix-yourself --help
```

## Test Cases

### Test 1: Interactive Mode (Full Flow)

```bash
cd /tmp  # or any test directory
create-flix-yourself test-project-1

# Follow prompts:
# - Project name: test-project-1 (default)
# - Database: SQLite (default)
# - Storage: Local (default)
# - Auth: None (default)
# - Preset: Generic (default)
# - Install deps: Yes
# - Init git: Yes
# - Setup DB: Yes

# Verify:
cd test-project-1
ls -la  # Should see config.yaml, .env, etc.
cat config.yaml
cat .env
npm run dev  # Should start without errors
```

### Test 2: Non-Interactive Mode (--yes)

```bash
cd /tmp
create-flix-yourself test-project-2 --yes

# Verify:
cd test-project-2
ls -la
cat config.yaml  # Should have default values
cat .env
```

### Test 3: Skip Installation

```bash
cd /tmp
create-flix-yourself test-project-3 --skip-install --yes

# Verify:
cd test-project-3
ls node_modules  # Should NOT exist
npm install  # Install manually
```

### Test 4: Custom Template Version

```bash
cd /tmp
create-flix-yourself test-project-4 --template-version main --yes

# Should fetch from specific branch/tag
```

### Test 5: Different Provider Combinations

#### PostgreSQL + S3 + NextAuth

```bash
cd /tmp
create-flix-yourself test-postgres-s3

# Follow prompts:
# - Database: PostgreSQL
# - Storage: S3
# - Auth: NextAuth
# - Install deps: Yes
# - Init git: Yes
# - Setup DB: No (needs credentials first)

# Verify:
cd test-postgres-s3
cat .env  # Should have PostgreSQL placeholders, S3 placeholders, NextAuth secrets
cat config.yaml  # Should reflect selections
```

#### CockroachDB + R2 + Internal Auth

```bash
cd /tmp
create-flix-yourself test-cockroach-r2

# Follow prompts:
# - Database: CockroachDB
# - Storage: R2 (Cloudflare)
# - Auth: Internal
# - Install deps: Yes
# - Init git: Yes
# - Setup DB: No

# Verify:
cd test-cockroach-r2
cat .env  # Should have CockroachDB placeholder, R2 placeholders, auth secret
```

### Test 6: Error Handling

#### Directory Already Exists

```bash
cd /tmp
mkdir existing-dir
echo "file" > existing-dir/file.txt
create-flix-yourself existing-dir --yes

# Should show error: "Directory already exists and is not empty"
```

#### Invalid Project Name

```bash
create-flix-yourself "Invalid Name With Spaces!"

# Should sanitize or prompt to fix
```

#### Network Failure (Template Fetch)

```bash
# Disconnect internet or use invalid template version
create-flix-yourself test-network --template-version nonexistent-version --yes

# Should show error: "Template not found or version does not exist"
```

### Test 7: Content Presets

Test each preset to ensure config.yaml is generated correctly:

```bash
cd /tmp
create-flix-yourself test-couple

# Select: Couple preset
# Verify config.yaml has: preset: couple

cd /tmp
create-flix-yourself test-family

# Select: Family preset
# Verify config.yaml has: preset: family
```

## Manual Testing Checklist

- [ ] CLI help message displays correctly
- [ ] CLI version displays correctly
- [ ] Interactive prompts work (can navigate with arrows, select options)
- [ ] --yes flag skips all prompts and uses defaults
- [ ] --skip-install flag skips npm install
- [ ] --template-version flag fetches correct version
- [ ] Template fetching works (degit clones successfully)
- [ ] config.yaml is generated with correct values
- [ ] .env is generated with correct values
- [ ] .env contains generated secrets (AUTH_SECRET, NEXTAUTH_SECRET)
- [ ] .env has correct placeholders for external services
- [ ] Prisma schema is updated (if template has one)
- [ ] Dependencies install successfully
- [ ] Git is initialized with initial commit
- [ ] Database setup runs (prisma generate, db push, seed)
- [ ] Success message shows correct next steps
- [ ] Success message shows relevant warnings (e.g., "Add database URL")
- [ ] Error handling works for all failure scenarios
- [ ] Colors and spinners display correctly
- [ ] Node.js version check works (rejects <18)
- [ ] Works on Windows (with MSYS/git-bash)
- [ ] Works with npm, pnpm, and yarn

## Automated Testing (Future)

Consider adding automated tests with:
- Jest or Vitest for unit tests
- E2E tests with temporary directories
- Mock degit for faster tests
- Snapshot testing for generated files

## Cleanup After Testing

```bash
# Unlink the CLI
npm unlink -g create-flix-yourself

# Remove test directories
rm -rf /tmp/test-project-*
rm -rf /tmp/test-*
```

## Known Issues / Limitations

1. **Windows PTY Issues**: Git prompts might not work in some shells
2. **Network Dependency**: Requires internet to fetch template
3. **Template Availability**: Assumes mananssh/flix-yourself-template is accessible
4. **Database Setup**: Auto-setup only works with SQLite (others need credentials first)

## Troubleshooting

### "Cannot find module" errors

```bash
cd /c/Users/manan/projects/flix-yourself/create-flix-yourself
rm -rf node_modules package-lock.json
npm install
npm run build
npm link
```

### Git authentication issues

Ensure git credentials are configured:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Permission errors on Windows

Run terminal as Administrator or use a user-writable directory.
