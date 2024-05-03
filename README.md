# GuildWeb

*Copyright © 2024 Yun-T.Z.*

## Introduction

This is a platform designed to address the need for recording various aspects of life, including nutrition planning and task goal setting.

## Features
* Set daily nutrition goals and record ingredients, recipes, and daily meals.
* Customize to-do items and set daily, weekly, and monthly goals.
* Establish adventurer guilds to collaboratively achieve objectives.
* Share ingredients, recipes, and tasks with other users.


## Technical Details
* Language: JavaScript
* Main Frameworks: Node.js, Express
* Frontend Framework: React
* Database: MySQL


## Overview
* Click here to navigate to [GuildWeb](http://guild.yun-tz.com).
* Click here to navigate to [Documentation](https://hackmd.io/@rabbit-house/S1bMt8ceA).

### Backend
* `/backend/lib/app.js` - initializes an Express app with middleware and routing
* `/backend/routes/*` - handle endpoint definition and request handling in the application
* `/backend/lib/db.js` - creates a database connection.
* `/backend/models/*` - handle database operations.
* `/backend/controllers/*` - handle request processing and business logic in the application.
* `/backend/utils/*` - handles error message processing.
* `/backend/verification/*` - manages user authentication.
* `/backend/public/uploads/*` - manages file upload and store.

### Frontend

- `/frontend/public/*` - assets on public path
- `/frontend/src/api/*` - functions related to the API
- `/frontend/src/assets/*` - the static assets including images
- `/frontend/src/components/*` - the common-use react components
- `/frontend/src/mocks/*` - files related to mocks
- `/frontend/src/pages/*` - the page-related react component
- `/frontend/src/styles/*` -  the style related objects
- `/frontend/src/utils/*` - the common-use util function

## Running Locally

To run GuildWeb locally on your machine, follow these steps:

### Prerequisites

Before you begin, ensure you have met the following requirements:

* GuildWeb requires Node.js version 20.11.1. If you haven't installed Node.js and npm yet, you can download them from [Node.js official website](https://nodejs.org/). You can check your Node.js versions by running:
  ```bash
  node --version
  ```
* [MySQL database server](https://www.mysql.com/) installed locally or accessible remotely. 

### Installation
Before you start, ensure you have Node.js and npm installed on your machine.

Clone the repository from GitHub and navigate to the project directory:
  ```
  git clone https://github.com/meatballyun/GuildWeb.git
  ```

Install backend dependencies:
  ```
  cd backend
  npm install
  ```

Install frontend dependencies:
  ```
  cd frontend
  npm install
  ```

### Configuration

1. Set up the MySQL database:
  - Create a MySQL database with the name `guildweb`.
  - Update the database connection configuration in `backend/lib/db.js` if necessary.
2. Set environment variables: Create a `.env` file in the root of the backend directory and add the following variables:
    ```.ENV
    # Environment
    NODE_ENV=development

    # Database
    DB_HOST=localhost
    DB_NAME=guildweb
    DB_USER=root
    DB_PASS=your_mysql_root_password

    # Session
    SESSION_SECRET=your_session_secret

    # JWT
    JWT_SECRET=your_jwt_secret

    # Mail
    MAIL_USER=your_email_username
    MAIL_PASS=your_email_password

    # Server
    PORT=3010

    # URL
    FE_URL=http://localhost:3000

    # Path
    UPLOAD_PATH=uploads
    ```

    Ensure you replace `your_mysql_root_password` with your MySQL root password and other placeholders with appropriate values relevant to your setup.

### Start the Application

1. Start the backend server:
    ```
    cd backend
    npm start
    ```
  
2. Start the frontend development server:
    ```
    cd frontend
    npm start
    ```

### Access the Application
Once the servers are running, you can access GuildWeb by visiting http://localhost:3000 in your web browser.

