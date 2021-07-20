# Bootcamper Backend API Documentation

<div style="text-align: center">
    <img src="https://i.imgur.com/KbO2Soz.jpg" />
</div>

---

Bootcamper is a backend RESTFUL api developed with node.js/Express framework for managing bootcamps. The developed api includes all the functionality below.

## Bootcamper Features

### Bootcamps module

- List all bootcamps in the database

  - Pagination
  - Filtering
  - Selecting fields
  - Sort by one or many fields
  - Limiting number of results

- Search bootcamps by raduis from zipcode

  - Use geocoder to get exact location from a single address field along with mapquest api

- Get single bootcamp

- Create new bootcamp

  - Authenticated users only
  - Must have the role **"publisher"** or **"admin"**
  - Only one bootcamp per publisher but the admin can create more
  - Field validation with Mongoose

- Upload a photo for bootcamp
  - Owner only
  - Photo will be uploaded to local filsystem [./public/storage](public/storage) folder
- Update bootcamp

  - Owner only
  - Validation on update

- Delete bootcamp

  - Owner only

- Calculate the average cost of all courses for a bootcamp
- Calculate the average rating from the reviews for a bootcamp

### Courses module

- List all courses for bootcamp

  - Pagination
  - Filtering
  - Selecting fields
  - Sort by one or many fields
  - Limiting number of results

- List all courses in general

  - Pagination
  - Filtering
  - Selecting fields
  - Sort by one or many fields
  - Limiting number of results

- Get single course

- Create new course

  - Authenticated users only
  - Must have the role **publisher** ou **admin**
  - Only the owner or an admin can create a course for a bootcamp
  - Publisher can create multiple courses

- Update course

  - Owner only

- Delete course
  - Owner only

### Reviews module

- List all reviews for a bootcamp
- List all reviews in general

  - Pagination
  - Filtering
  - Selecting fields
  - Sort by one or many fields
  - Limiting number of results

- Get a single review
- Create a review
  - Authenticated users only
  - Must have the role **publisher** ou **user**
- Update reviews
  - Owner only
- Delete review
  - Owner only

### Users module & Authentication

- Authentication using [JWT](https://jwt.io/)/Cookies

  - JWT and cookies expire in 30 days

- User registration

  - Registration as **publisher** or **user**
  - Once registred a token will be sent along with a cookie (token = xxx)
  - JWT is managed using jsonwebtoken dependencie
  - Cookies are managed using cookie-parser dependencie
  - Password must be hashed using bcrypt dependencie

- User login

  - User can login with email and password
  - Plain text password will compare with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)

- User logout

  - Cookie will be sent to set token = none

- Get user

  - Only if logged in
  - Route to get the current logged in user(vie token)

- Password reset
  - User can request to reset password
  - When requested a hashed token will be emailled to the user email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update user info

  - Authenticated and owner user only
  - Separate route to update password

- User CRUD

  - Admin only

- Users can only be made admin by updating the database field manually

### Security module (comming soon ...)
