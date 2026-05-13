The project was tested manually and through backend validation checks to ensure the core functionality works correctly across the full application flow.

---

# Functional Testing

## Authentication Testing
Tested:
- User signup flow
- Login functionality
- Protected routes
- Logout handling
- Session persistence after refresh

Verified that unauthorized users cannot access protected pages like audit history.

---

## Audit Flow Testing
Tested:
- Adding multiple AI tools dynamically
- Monthly and annual spend calculations
- Gemini AI response generation
- Result page rendering
- Savings calculations

Verified that audit data is stored correctly in MongoDB.

---

## Public Shareable Reports
Tested:
- Unique public URL generation
- Public audit access
- Sensitive information removal
- Shareable report rendering

Verified that company details and private user information are hidden from public pages.

---

## Lead Capture Testing
Tested:
- Lead form submission
- Optional fields handling
- Backend storage
- Email validation

Verified that lead information is saved successfully before result access.

---

## API Testing
Tested backend APIs using:
- Frontend integration
- Postman
- JUnit-based backend testing for validation and API response checks

Verified:
- Correct API responses
- Error handling
- Validation handling
- Authentication middleware flow

---

# Responsive Testing

Tested UI responsiveness on:
- Desktop
- Tablet
- Mobile screen sizes

Verified:
- Layout responsiveness
- Form usability
- Navigation flow
- Public report rendering

---

# Deployment Testing

Tested deployed application on:
- Vercel (Frontend)
- Render (Backend)

Verified:
- Production API connectivity
- Environment variables
- Authentication flow
- MongoDB production connection

---

# Known Limitations

- AI-generated responses may vary slightly depending on Gemini outputs.
- Savings calculations are estimation-based and not connected to real billing APIs.
- Current abuse protection is basic and can be improved further.

---

# Future Testing Improvements

- Add more automated unit tests
- Add integration testing
- Add end-to-end testing using Cypress or Playwright
- Add load testing for API endpoints
- Improve validation edge-case testing
