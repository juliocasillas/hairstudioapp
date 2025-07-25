# Julio Casillas Hair Salon Booking Platform - Development Prompt

## Project Overview
Build a comprehensive, web-based appointment booking and management system tailored for Julio Casillas Hair Salon. The app should allow clients to schedule, manage, and track hair salon appointments online via an elegant client portal inspired by SimplyBook.me. The design features a luxurious black marble and glowing gray aesthetic reflecting the salon's brand.

## Key Features
- Online appointment booking with full workflow
- Service selection (Haircut, Color, Styling, Treatments, etc.)
- Staff member selection with photos and specialties
- Real-time availability calendar with interactive time slot picker
- Comprehensive client intake forms (hair history, allergies, preferences)
- Client portal dashboard for managing appointments, profile, and service history
- Mobile-responsive design
- Admin dashboard for salon management
- Appointment confirmation, reminders, cancellation, and rescheduling
- Payment integration ready
- Loyalty program integration ready
- Before/after photo uploads

## Visual & Design Guidelines
- **Colors:**
  - Primary (Black Marble): #2C2C2E
  - Accent (Glowing Gray): #8E8E93
  - Background: #F2F2F7
  - Dark Mode: #1C1C1E
- **Typography:** Inter font family (Inter, Inter Medium)
- **Framework:** React + Tailwind CSS

## Pages & Components
- Home/Landing page with salon branding and booking CTA
- Service Selection
- Staff Selection
- Date & Time Selection with live calendar
- Client Intake Forms (Hair History, Allergies & Preferences)
- Customer Details form
- Booking Confirmation page
- Client Portal (My Appointments, Profile, Service History)
- Admin Dashboard
- UI Elements: Hero section, service cards, staff cards, appointment cards, navigation header, footer, loading states, success/error messages, form validation, progress indicators

## Important Development Instructions
1. **Before coding, connect to the Supabase backend and thoroughly check the existing database schema.**  
   Most likely, all necessary tables and fields (appointments, clients, services, staff, etc.) are already created.  
   This step avoids duplication and helps you understand data relationships to properly integrate frontend and backend.
2. Map frontend features to the existing database structure.
3. Implement frontend components using React + Tailwind CSS.
4. Use Supabase APIs for data fetching, mutations, and real-time updates.
5. Ensure mobile responsiveness and accessibility.
6. Include error handling, form validation, and user feedback throughout the app.

## Workflow Summary
Book Appointment → Service Selection → Staff Selection → Date & Time → Intake Forms → Customer Details → Confirmation → Client Portal Access

## Deliverables
- Fully functional React app with Tailwind styling
- Integration with Supabase backend
- Responsive UI matching the provided design guidelines
- Well-structured, maintainable code with comments where needed

---

Please confirm the Supabase schema before starting development to ensure alignment with the existing database.