# Meraki Wedding Planner Website Specification

## Project Overview
A bilingual WordPress website for Meraki, a wedding planner company, featuring a custom theme with gallery capabilities, journaling, and blogging functionality.

## Technical Stack
- **Platform**: TinaCMS (Latest version) - try to avoid hardcode as much as possible, use tina init command to initialie the project *npx create-tina-app@latest --pkg-manager npm --template tina-remix-starter .*
- **Languages**: JavaScript, CSS/SCSS
- **CSS Framework**: Tailwindcss
- **Multilingual Support**: Custom implementation - Strapi alike

## Website Structure

### Core Pages
1. **Homepage** (`/en/`, `/vi/`)
   - Hero section with company branding
   - Featured weddings carousel
   - Services overview
   - Call-to-action sections
   - Testimonials preview

2. **About Us** (`/en/about`, `/vi/about`)
   - Company story and mission
   - Team member profiles
   - Company values and approach
   - Contact information

3. **Kind Words** (`/en/testimonials`, `/vi/testimonials`)
   - Client testimonials and reviews
   - Photo testimonials
   - Rating/review system
   - Social proof elements

4. **Journal** (`/en/journal`, `/vi/journal`)
   - Grid layout of wedding galleries
   - Filter by wedding type, season, venue
   - Search functionality
   - Pagination

5. **Individual Journal Pages** (`/en/journal/[slug]`, `/vi/journal/[slug]`)
   - Full wedding gallery with lightbox
   - Wedding story and details
   - Vendor credits
   - Social sharing buttons

6. **Blog** (`/en/blog`, `/vi/blog`)
   - Wedding planning tips
   - Industry insights
   - Company news
   - Standard blog layout with categories and tags

7. **Individual Blog Posts** (`/en/blog/[slug]`, `/vi/blog/[slug]`)
   - Standard blog post layout
   - Comments system
   - Related posts
   - Social sharing

## Multilingual Implementation

### URL Structure
- **English**: `/en/[page-slug]`
- **Vietnamese**: `/vi/[page-slug]`
- **Default**: Redirect to `/en/` or detect browser language

### Language Switching
- Language toggle in main navigation
- Maintain current page context when switching
- Store language preference in cookies/localStorage

### Content Management
- Separate post types for each language OR
- Single post type with language meta fields
- Translation management interface in admin
- Dont hardcode anything
## Custom Post Types

### Journal (Wedding Galleries)
```php
TinaCMS Type: 'journal'
Fields:
- Title (multilingual)
- Content/Description (multilingual)
- Gallery Images (Media Library)
- Wedding Date
- Venue Name
- Couple Names
- Featured Image
- SEO Meta (multilingual)
- Status (published/draft)
```

### Testimonials
```php
TinaCMS Type: 'testimonial'
Fields:
- Client Name
- Testimonial Text (multilingual)
- Client Photo
- Wedding Date
- Rating (1-5 stars)
- Featured (yes/no)
```

## Custom Theme Requirements

### Design Principles
- **Elegant and minimalist** aesthetic
- **Mobile-first** responsive design
- **Fast loading** with optimized images
- **SEO-friendly** structure

### Key Features
1. **Image Optimization**
   - Lazy loading for galleries
   - WebP format support
   - Responsive image sizes
   - Image compression

2. **Gallery Functionality**
   - Lightbox/modal view
   - Touch/swipe navigation
   - Full-screen viewing
   - Image zoom capability

3. **Navigation**
   - Sticky header navigation
   - Mobile hamburger menu
   - Breadcrumb navigation
   - Language switcher

4. **Performance**
   - Critical CSS inlining
   - JavaScript minification
   - Database query optimization
   - Caching strategy
   - Avoid hardcode data

## Technical Implementation


## SEO and Performance Requirements

### SEO Features
- Meta titles and descriptions (multilingual)
- Open Graph tags for social sharing
- Structured data markup (JSON-LD)
- XML sitemaps for both languages
- Robot.txt optimization
- Clean URL structure

### Performance Targets
- Page load time: < 3 seconds
- Mobile PageSpeed score: > 85
- Desktop PageSpeed score: > 90
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 2.5 seconds


## Content Management

## Testing Requirements


### Production Environment
- Environment variable management
- Automated backup system
- Monitoring and logging
- Update procedures
- have access to tinacms backend