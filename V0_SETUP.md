# V0 Deployment Setup Guide

This guide walks you through deploying your Pinterest-style app to V0 with Supabase integration.

## 🚀 V0 Deployment Steps

### 1. Connect Repository to V0
1. Go to [v0.dev](https://v0.dev) and sign in
2. Click **"New Project"** → **"Import from GitHub"**
3. Select your repository: `immonroe/social-mvp`
4. V0 will automatically detect this is a Next.js project

### 2. Configure Supabase Integration
V0 has built-in Supabase integration that will:
- Automatically create a Supabase project for you
- Set up the database schema
- Configure environment variables
- Handle authentication

**In V0 Dashboard:**
1. Go to **Integrations** → **Supabase**
2. Click **"Enable Supabase Integration"**
3. V0 will create a new Supabase project automatically
4. Environment variables will be populated automatically

### 3. Database Schema Setup
Once Supabase is connected, run these SQL commands in the Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create boards table
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create images table
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create board_pins junction table
CREATE TABLE board_pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, image_id)
);

-- Enable Row Level Security policies
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_pins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can view their own boards" ON boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" ON boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" ON boards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for images
CREATE POLICY "Users can view their own images" ON images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own images" ON images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" ON images
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for board_pins
CREATE POLICY "Users can view pins from their boards" ON board_pins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_pins.board_id 
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pins in their boards" ON board_pins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_pins.board_id 
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove pins from their boards" ON board_pins
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_pins.board_id 
      AND boards.user_id = auth.uid()
    )
  );
```

### 4. Storage Bucket Setup
In Supabase Dashboard:
1. Go to **Storage** → **Buckets**
2. Create a new bucket named `images`
3. Set it to **Public** (for easy image access)
4. Configure RLS policy:

```sql
-- Storage policy for images bucket
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 5. Demo Account Setup (Optional)
Create a demo account in Supabase Auth:
1. Go to **Authentication** → **Users**
2. Create a new user:
   - Email: `demo@social-mvp.com`
   - Password: `demo123456`
3. This allows users to try the app without registering

## 🔧 Environment Variables
V0 will automatically set these when Supabase integration is enabled:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 Post-Deployment
After successful deployment:
1. Test user registration/login
2. Test image upload functionality
3. Test board creation and pin management
4. Verify responsive design on mobile/desktop

## 🔗 Useful Links
- [V0 Documentation](https://v0.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
