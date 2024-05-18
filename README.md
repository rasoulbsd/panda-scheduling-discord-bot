# sedad_bot
Scheduling bot for daily check-in in Discord like exactly like panda commands but with some custom features.

# How to use
## commands
use /panda to access each command. For now, the main commands are based on CRUID fundamentals to prevent the user from accessing the DB directly and handling them in the discord.
### create

- routine (required)
- timezone (required)
- time (required)
- role (optional)
- context (optional)
default context:
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

### delete
- routine_id (required)
### list
It has no attributes and will list all the routines for that channel with respected IDs. Then you can use each ID for other commands like updates and deleting a routine.

### update
It is just like create command but it has an extra attribute named routine_id in order to update the routine.
- routine_id (required)
- routine (required)
- timezone (required)
- time (required)
- role (optional)
- context (optional)

example video for all commands and features:

https://github.com/rasoulbsd/sedad_bot/assets/35425167/f52d77fc-fb24-4997-bafa-aec9f2f826a8


## Added features rather than Panda
- Now messages are in threads for better readability.
- There is a DB (MongoDB) for managing routines directly or using discord commands
- Now user can change the context of the message for the routine
- Now user can select a timezone for better scheduling
- 
## next features:
- Access management for modifying and adding routines.
- DMs to users
- Sending reminders in the thread or in private to the user.
- Read the default timezone based on the user's discord information.
- analyzing tools

# How to Deploy
requirements:
- MongoDB
- 
There are two codes you must run in order to use the bot. Also 
## Using Docker (recommended)

## Using screen (for debugging and testing)

  
