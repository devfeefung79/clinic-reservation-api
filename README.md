# Client Reservation API

## Overview

The Client Reservation API is a RESTful service built with Node.js and Express.js, designed to manage reservations for a clinic. It includes secure authentication using JSON Web Tokens (JWT) to protect sensitive endpoints and ensure that only authorized users can access certain functionalities.

## Features

- **User Authentication**: Secure login using JWT.
- **CRUD Operations**: Create, Read, Update, and Delete operations for reservations.
- **API Documentation**: Interactive API documentation using Swagger.
- **Validation**: Input validation to ensure data integrity.

## Technologies

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **JWT**: JSON Web Tokens for secure authentication.
- **Swagger**: API documentation.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node package manager, which comes with Node.js.

## Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/client-reservation-api.git
   cd client-reservation-api
   ```    
1. **Install dependencies**
   ```bash
   npm install
   ```    
1. **Set up environment variables**
   ```
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=
   
   JWT_SECRET=
   
   SLOT_GENERATION_START_DATE=
   SLOT_GENERATION_END_DATE=
   ```
1. **Run the application**
   ```bash
   npm run start
   ```
   The server will start on `http://localhost:3000`
