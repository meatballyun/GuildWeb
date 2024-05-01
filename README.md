# GuildWeb

*Copyright © 2024 yun-tz*

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
