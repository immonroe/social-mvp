# Vercel + Supabase Integration Guide

## Method 1: Vercel Integration (Automated)

### Step 1: Add Supabase Integration
1. Go to your **Vercel Dashboard**
2. Navigate to your `social-mvp` project
3. Click **"Integrations"** tab
4. Search for **"Supabase"**
5. Click **"Add Integration"**

### Step 2: Configure Integration
1. **Connect or Create Supabase Project**:
   - Choose "Create new project" or "Connect existing"
   - If creating new: name it `social-mvp`
2. **Select Environment**:
   - Choose Production, Preview, and Development
3. **Grant Permissions**:
   - Allow Vercel to manage environment variables
4. Click **"Install Integration"**

### Step 3: Verify Environment Variables
After integration, check **Settings** → **Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (optional)

## Method 2: Manual Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. **"New Project"** → Name: `social-mvp`
3. Choose region and generate password
4. Wait for project to initialize

### Step 2: Get Credentials
In **Supabase Dashboard** → **Settings** → **API**:
- Copy **Project URL**
- Copy **anon public** key

### Step 3: Add to Vercel
In **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
```

## Database Schema Setup

Regardless of method chosen, run this in **Supabase SQL Editor**:

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

-- Enable RLS on all tables
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_pins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can manage their own boards" ON boards
  USING (auth.uid() = user_id);

-- RLS Policies for images  
CREATE POLICY "Users can manage their own images" ON images
  USING (auth.uid() = user_id);

-- RLS Policies for board_pins
CREATE POLICY "Users can manage pins in their boards" ON board_pins
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_pins.board_id 
      AND boards.user_id = auth.uid()
    )
  );
```

## Storage Setup

### Create Images Bucket
1. **Supabase Dashboard** → **Storage** → **"New Bucket"**
2. Name: `images`
3. Public: ✅ Yes
4. Click **"Create"**

### Storage Policies
```sql
-- Allow users to upload their own images
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to images
CREATE POLICY "Public image access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Testing the Integration

### Test Environment Variables
Add this to your Next.js app temporarily to verify:

```typescript
// pages/api/test-supabase.ts
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from('boards').select('count')
    
    if (error) throw error
    
    res.status(200).json({ 
      success: true, 
      message: 'Supabase connected!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20) + '...'
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}
```

Visit `/api/test-supabase` to verify connection.

## Benefits of Vercel + Supabase

- ✅ **Automatic deployments** on database schema changes
- ✅ **Environment variable management**
- ✅ **Branch-specific databases** (preview deployments)
- ✅ **Built-in monitoring and logging**
- ✅ **Seamless authentication flow**
- ✅ **Edge function support**

## Next Steps After Integration

1. **Deploy and test** the connection
2. **Set up authentication pages**
3. **Build the Pinterest-style UI**
4. **Add image upload functionality**
5. **Implement board management**

The integration handles the infrastructure - you focus on building features!
