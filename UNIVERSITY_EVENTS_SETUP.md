# University Events Feature - Setup Instructions

## Overview
Successfully replaced the Study Buddy feature with a University Events system that allows admins to post campus events with images, captions, clickable links, and visibility controls. Students can view and like these events.

## Database Setup Required

You'll need to run the SQL schema to create the required tables. The schema is located at:
`database/schema/create_university_events.sql`

### Tables Created:
1. **university_events** - Stores event information
   - id, title, caption, event_link, image_url, event_date
   - visibility_type ('everyone' or 'specific')
   - target_batch, target_section, target_semester (for targeted visibility)
   - posted_at, posted_by

2. **event_likes** - Tracks student likes on events
   - id, event_id, user_id, liked_at
   - Unique constraint on (event_id, user_id)

### Run the SQL in Supabase:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file: `database/schema/create_university_events.sql`
4. Copy and paste the entire contents
5. Click "Run" to execute

## Features Implemented

### For Students (UniversityEvents Component):
- ✅ View all university events in a beautiful card layout
- ✅ Like/unlike events with real-time like counter
- ✅ Search events by title or caption
- ✅ Filter events by: All, Upcoming, Past
- ✅ View event images/posters
- ✅ Click event links to learn more
- ✅ See event date and time
- ✅ Visibility filtering (only see events targeted to their batch/section)

### For Admins (AdminPanel):
- ✅ New "University Events" tab in admin panel
- ✅ Upload event images/posters
- ✅ Add event title and caption/description
- ✅ Set event date and time
- ✅ Add clickable event links (URLs)
- ✅ **Visibility Controls:**
  - Everyone: visible to all students
  - Specific: target specific batch, section, or semester
- ✅ View all posted events with like counts
- ✅ Delete events

## Files Created/Modified

### New Files:
1. `src/components/UniversityEvents.tsx` - Student-facing events component
2. `database/schema/create_university_events.sql` - Database schema

### Modified Files:
1. `src/App.tsx` - Replaced Study Buddy with University Events in navigation
2. `src/components/AdminPanel.tsx` - Added University Events management
   - New event form state
   - Image upload handler
   - Event creation handler
   - Table display for events

## Component Design
- **Color Theme:** Purple gradient (matching Job/Internship functionality)
- **Icon:** PartyPopper (🎉) for the menu
- **Like Feature:** Pink heart icon with counter
- **Layout:** Responsive grid, similar to Careers component

## Next Steps
1. ✅ Run the SQL schema in Supabase
2. ✅ Ensure the storage bucket 'portal-docs' exists for image uploads
3. ✅ Test creating an event via Admin Panel
4. ✅ Test viewing and liking events as a student

## Future Enhancements (Optional)
- Add event RSVP functionality
- Email notifications for new events
- Event categories (sports, academic, cultural, etc.)
- Calendar view for events
- Past event archive with photos
