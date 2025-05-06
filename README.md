AdZone - Full Stack Ads Management Platform
AdZone is a full-featured web application designed to manage and browse classified ads efficiently. It provides users with the ability to post, search, and filter ads, while also offering powerful admin and category management features.

Key Features
Authentication & User Management

User registration and login

Password reset functionality

Update user profile

Get user ads by ID

Ads Management

Create, read, update, and delete ads

Upload ad images

View ads by ID

Get all ads or ads by a specific user

Track ad views

Category System

Organize ads into 6 distinct categories

Fetch ads by category

Search & Filtering

Global ad search

Filter ads by price, location, and date

Display popular ads based on views or interactions

Backend Structure
The backend includes 4 main controllers:

Ads Controller

createAds, getAllAds, getAdsByID, updateAds, deleteAds

uploadPhotosAds, getAdsByUser, getUsersByID

Auth Controller

register, login, resetPassword, updateUserDetails

Category Controller

getAdsByKategory (handles 6 ad categories)

Search Controller

searchAds, filterAds, getPopularAds

Tech Stack
Frontend: React.js, Redux Toolkit, TailwindCSS

Backend: Node.js, Express.js, MongoDB

Authentication: JWT (JSON Web Tokens)

Image Upload: Multer
