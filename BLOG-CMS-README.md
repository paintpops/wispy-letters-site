# Blog CMS Setup Guide

## Overview
Your blog now has a complete Content Management System (CMS) that allows you to create, edit, and delete blog posts with a rich text editor.

## Files Created

1. **blog-admin.html** - The CMS admin interface
2. **blog-admin-api.php** - PHP backend for handling file uploads and saving
3. **Photos/blog/** - Directory for uploaded blog images
4. **blog-posts/posts.json** - JSON file storing blog post metadata

## How to Use the CMS

### Accessing the Admin Panel

Open your browser and navigate to:
```
http://localhost:3000/blog-admin.html
```

### Creating a New Blog Post

1. Click on the **"Create New Post"** tab (default view)
2. Fill in the required fields:
   - **Post Title**: The title of your blog post
   - **Publication Date**: When the post was/will be published
   - **Category**: Select from predefined categories
   - **Excerpt**: A brief summary (shown on the blog listing page)
   - **Featured Image**: Upload an image (automatically saved to Photos/blog/)
   - **Post Content**: Write your post using the CKEditor rich text editor

3. Use the CKEditor toolbar to:
   - Format text (bold, italic)
   - Add headings (H2, H3)
   - Create lists (bulleted, numbered)
   - Add links
   - Quote text

4. Click **"Publish Post"** to save

### Managing Existing Posts

1. Click on the **"Manage Posts"** tab
2. You'll see all your published posts listed
3. For each post you can:
   - **Edit**: Click to load the post into the editor for changes
   - **Delete**: Remove the post entirely (with confirmation)

### Editing a Post

1. Go to "Manage Posts" tab
2. Click **"Edit"** on the post you want to modify
3. Make your changes in the form
4. Click **"Update Post"** to save
5. Click **"Cancel"** to discard changes

## How It Works

### Automatic Blog Updates

When you create or edit a post:

1. **Image Upload**: Images are automatically uploaded to `Photos/blog/` with unique filenames
2. **JSON Update**: Post metadata is saved to `blog-posts/posts.json`
3. **HTML Generation**: A complete HTML file is created at `blog-posts/[post-slug].html`
4. **Blog Page**: The main `blog.html` page automatically loads and displays posts from `posts.json`

### Post URLs

Posts are automatically given URL-friendly slugs based on their titles:
- "Valentine's Day at Cartier" → `blog-posts/valentines-day-at-cartier.html`

## Technical Requirements

### Running with PHP Backend (Recommended)

For full functionality (image uploads, file saving), you need PHP:

1. Make sure PHP is installed on your system
2. Start a PHP development server:
   ```bash
   php -S localhost:8000
   ```
3. Access the CMS at: `http://localhost:8000/blog-admin.html`

### Running without PHP (Limited)

If you don't have PHP, the CMS will still work but with limitations:

1. Use the existing Python server (already running on port 3000)
2. Images won't auto-upload - you'll need to manually copy them to `Photos/blog/`
3. Posts are saved to browser localStorage as a backup
4. You'll need to manually update `blog-posts/posts.json`

## Features

### Rich Text Editor (CKEditor)
- Professional WYSIWYG editor
- Supports bold, italic, headings, lists, links, quotes
- Clean HTML output

### Image Management
- Automatic image upload
- Image preview before publishing
- Images stored in organized folder structure

### Automatic Features
- URL-friendly slugs generated from titles
- Posts sorted by date (newest first)
- Responsive design matching your site
- Form validation

### Data Persistence
- Posts saved to JSON file
- HTML files generated automatically
- LocalStorage backup for safety

## Categories

Currently available categories:
- Events
- Tutorials
- Wedding
- Behind the Scenes
- Tips & Advice

You can add more by editing the `<select>` dropdown in blog-admin.html (line ~174).

## Troubleshooting

### Images not uploading
- Make sure PHP backend is running
- Check that `Photos/blog/` folder exists and is writable
- Verify file size is under 5MB
- Check that file format is JPG, PNG, GIF, or WEBP

### Posts not saving
- Make sure PHP backend is running
- Check browser console for error messages
- Posts are backed up to localStorage even if save fails

### Posts not appearing on blog.html
- Check that posts.json contains your post data
- Make sure you're accessing via HTTP server (not file://)
- Check browser console for fetch errors

## Security Note

This is a simple CMS for local/personal use. For production use, you should add:
- Authentication/login system
- CSRF protection
- Input sanitization
- File upload security
- Database instead of JSON files

## Future Enhancements

Possible improvements you could add:
- User authentication
- Draft/published status
- Scheduled publishing
- Tags in addition to categories
- Image gallery within posts
- SEO metadata fields
- Post preview before publishing
- Bulk image upload
