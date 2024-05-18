# Sedad Bot

Sedad Bot is a scheduling bot for daily check-ins in Discord, similar to Panda, but with additional custom features. This bot helps manage routines and schedules directly within Discord using a set of commands.

## How to Use

### Commands

Use `/panda` to access each command. The main commands follow CRUD (Create, Read, Update, Delete) principles to prevent direct database access and handle operations within Discord.

#### Create
- **Routine** (required)
  - Options:
    - Everyday
    - Even Days
    - Odd Days
  - Note: All days include only working days (Monday to Friday).

- **Timezone** (required)
  - Options:
    - UTC
    - Eastern Time (ET)
    - Central Time (CT)
    - Mountain Time (MT)
    - Pacific Time (PT)
    - India Standard Time (IST)
  - Note: All times are stored as UTC times in the database.

- **Time** (required)
  - Range: 00:00 to 23:00

- **Role** (optional)
  - Use `@` to mention specific roles in each routine, such as `@everyone` for all users or `@<user>` or `@<role>`.

- **Context** (optional)
  - Default context:
    ```
    Hey Hey, 
    Please leave your updates in this thread,
    Please use the following template:
    🙋‍♀️How I feel🙋‍♂️
    -
    -
    👩‍💻What I'm busy with🧑‍💻
    -
    -
    🧱Blockers I'm facing and suggestions to fix them🧱
    -
    -
    🤓Final remark🤓
    -
    -
    ```

#### Delete
- **routine_id** (required)

#### List
- No attributes required.
- Lists all routines for the channel with respective IDs, which can be used for updating or deleting routines.

#### Update
- Same attributes as the create command with an additional **routine_id** attribute.
  - **routine_id** (required)
  - **routine** (required)
  - **timezone** (required)
  - **time** (required)
  - **role** (optional)
  - **context** (optional)

### Example Video
- [Example Video for All Commands and Features](https://github.com/rasoulbsd/sedad_bot/assets/35425167/f52d77fc-fb24-4997-bafa-aec9f2f826a8)

## Added Features Over Panda
- Messages are now in threads for better readability.
- Uses MongoDB for managing routines directly or through Discord commands.
- Allows users to change the context of the message for routines.
- Users can select a timezone for better scheduling.

## Upcoming Features
- Access management for modifying and adding routines.
- Direct messages (DMs) to users.
- Sending reminders in threads or privately to users.
- Read default timezone based on the user's Discord information.
- Analytical tools.

## How to Deploy

### Requirements
- MongoDB
- Server or Platform as a Service (PaaS)

### Configuration
Complete the `.env` file using the `.env.example` template.

#### .env.example
```env
DISCORD_CLIENT_SECRET=""
DISCORD_TOKEN="xxxxx.xxxxx.xxxxx"
CLIENT_ID="xxxxx"
MONGODB_URI='mongodb+srv://xxxxx:xxxxx@xxxxx/'
BASIC_AUTH_USERNAME='xxxx'
BASIC_AUTH_PASSWORD='xxxx'
PROD_ADDRESS='x.x.x.x'
```

#### Using Docker (recommended)
`docker compose up -d --build`
#### Using screen (for debugging and testing)
install required packages:
`yarn install`
or
`npm install`
create a screen for cronjob:
`screen -S cronJob`
`node cronJob.js`
exit the screen:
`screen -a + d`
create a screen for the bot server:
`screen -S sedad_bot_server`
`yarn run start`
or
`npm run start`

