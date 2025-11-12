# Changelog

## [Unreleased]

### Added
- **Database Setup**: Complete Prisma ORM integration with SQLite for development (easily switchable to PostgreSQL for production)
- **File Upload System**: Full file upload, download, list, and delete functionality with local storage
- **Storage Abstraction**: Implemented StorageService interface with LocalStorageService for easy migration to cloud storage (e.g., AWS S3)
- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Teacher, Student)
- **Security Features**: File type validation, size limits (20MB), filename sanitization, and role-based permissions
- **API Endpoints**: Complete REST API for file management with proper error handling
- **Seed Data**: Sample users, courses, and file records for development and testing
- **Configuration**: Environment-based configuration with .env.example template
- **Documentation**: Updated README with setup instructions and API documentation

### Technical Details
- Switched from PostgreSQL to SQLite for easier development setup
- Added File model with relations to User and Course
- Implemented Multer for file handling with custom storage service
- Added role-based guards and decorators for secure access control
- Created uploads/ directory with safe path structure (year/month/random-filename)
- Added comprehensive validation for file uploads
- Updated package.json with necessary dependencies (multer, passport-local, etc.)
