# Journal Template Guide - TinaCMS

## Overview
This guide explains how to use the customizable **Journal** template based on your Figma design. This template is specifically for wedding journal entries and creates a beautiful layout with all elements fully editable through TinaCMS.

> **Note**: This is the Journal template guide. Other content types (like Blog) will have their own separate template guides.

## Template Layout Structure

The template is divided into two main columns:

### Left Column (40% width):
1. **Top Detail Image** - Small decorative photo (bouquet, rings, etc.)
2. **Couple Names** - Main heading with couple's names
3. **Wedding Details** - Nationality, location, and venue information
4. **Main Headline** - Large decorative headline text
5. **Ceremony Photo** - Group or ceremony photo at the bottom

### Right Column (60% width):
1. **Large Portrait** - Main couple portrait (75% height)
2. **Testimonial Section** - Quote and feedback (25% height)

## How to Use

### 1. Create a New Journal Entry

Create a new MDX file in `content/journal/` with the following structure:

```yaml
---
couple_names: BRIDE & GROOM
slug: your-slug
featured_image: /images/featured.jpg

template_layout:
  detail_image: /images/detail.jpg
  main_headline_en: YOUR HEADLINE
  main_headline_vi: TIÊU ĐỀ CỦA BẠN
  ceremony_image: /images/ceremony.jpg
  portrait_image: /images/portrait.jpg

wedding_details:
  nationality_label: NATIONALITY
  nationality: Vietnamese - Vietnamese
  location_label: WEDDING LOCATION
  location: Your City
  venue_label: WEDDING VENUE
  venue: Venue Name
  guest_count: '150'
  wedding_type_en: Traditional Wedding
  wedding_type_vi: Đám cưới truyền thống
  wedding_date: '2024-06-15T00:00:00.000Z'

testimonial:
  heading: Testimonial
  decorative_text: Beautiful script text here
  quote_en: English testimonial quote
  quote_vi: Vietnamese testimonial quote
  author: Couple Names

published: true
---
```

### 2. Customizable Elements

All of the following are fully editable through TinaCMS admin:

#### Text Elements:
- ✅ Couple names
- ✅ Nationality and label
- ✅ Wedding location and label
- ✅ Wedding venue and label
- ✅ Main headline (both EN/VI)
- ✅ Testimonial heading
- ✅ Testimonial decorative text
- ✅ Testimonial quote (both EN/VI)
- ✅ Author name

#### Image Elements:
- ✅ Detail image (top left bouquet/rings)
- ✅ Ceremony photo (group/ceremony shot)
- ✅ Portrait image (large couple photo)

### 3. Accessing TinaCMS Editor

1. Navigate to `/admin` in your browser
2. Select "Journal" from the collections
3. Choose an existing entry or create a new one
4. All template fields are organized in sections:
   - **Template Layout** - Images and headlines
   - **Wedding Details** - Location and venue info
   - **Testimonial Section** - Quote and feedback

### 4. Color Scheme

The template uses a warm, elegant color palette:
- Background: `#F5EFE7` (cream/beige)
- Text accents: `#8B7355` (warm brown)
- Typography: Georgia serif font for elegance

### 5. Responsive Design

The template is designed to maintain its aspect ratio across different screen sizes. The layout uses:
- Flexbox for column structure
- Percentage-based widths (40/60 split)
- Aspect ratio preservation for images

## Example

See `content/journal/ngoc-hung.mdx` for a complete working example.

## Tips

1. **Image Recommendations**:
   - Detail image: 800x800px minimum, square crop
   - Ceremony photo: 1200x900px, 4:3 ratio works best
   - Portrait image: 1200x1600px, vertical orientation

2. **Text Length**:
   - Keep couple names concise (under 20 characters)
   - Headline works best with 2-4 words
   - Testimonial quote: 100-200 characters optimal

3. **Bilingual Content**:
   - Always provide both EN and VI versions
   - The template automatically shows the correct language based on URL

## Need Help?

- Check the TinaCMS documentation: https://tina.io/docs/
- Review existing journal entries for reference
- Contact your development team for custom modifications
