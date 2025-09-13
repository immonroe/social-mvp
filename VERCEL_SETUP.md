# Vercel Deployment Setup Guide

This guide walks you through deploying your Pinterest-style app to Vercel with Supabase integration.

## 🚀 Vercel Deployment Steps

### 1. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose **`immonroe/social-mvp`**
5. Vercel will auto-detect Next.js settings
6. Click **"Deploy"**

### 2. Set Up Supabase Project
1. Go to [supabase.com](https://supabase.com) and create account
2. Click **"New Project"**
3. Choose organization and set:
   - **Name**: `social-mvp`
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**

### 3. Configure Environment Variables in Vercel
After Supabase project is created:

1. In **Supabase Dashboard** → **Settings** → **API**
2. Copy these values:
   - **Project URL** 
   - **anon/public key**

3. In **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
4. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [your-project-url]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
   ```
5. Click **"Save"**

### 4. Set Up Database Schema
In **Supabase Dashboard** → **SQL Editor**, run this schema:

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

### 5. Set Up Storage Bucket
In **Supabase Dashboard** → **Storage**:

1. Click **"New Bucket"**
2. **Name**: `images`
3. **Public bucket**: ✅ Yes
4. Click **"Create bucket"**

5. Set up storage policies in **SQL Editor**:
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

### 6. Redeploy Vercel Project
After adding environment variables:
1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click **"Redeploy"** to pick up the new environment variables

### 7. Create Demo Account (Optional)
In **Supabase Dashboard** → **Authentication** → **Users**:
1. Click **"Add user"**
2. **Email**: `demo@social-mvp.com`
3. **Password**: `demo123456`
4. **Email Confirmed**: ✅ Yes
5. Click **"Create user"**

## ✅ Testing Your Deployment

After deployment, test these features:
1. **App loads** without errors
2. **User registration** works
3. **User login** works
4. **Demo account login** works
5. **Database connection** is active

## 🔗 Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
