# MTG Arena Player.log Explorer

## Overview

This tool serves as a solution for exploring an classifiyng the log messages within MTG Arena's Player.log file. Its primary goal is to facilitate the development of applications that enhance the gaming experience of MTG Arena enthusiasts.

All MTG Arena trackers rely on the parsing of the Player.log file to extract crucial data such as user statistics, deck information, gameplay history, and more. Despite its complexity, this log file holds a wealth of valuable information.

The MTG Arena Player.log Explorer simplifies this process by providing a user-friendly interface for navigating the log messages. Whether you're seeking to build statistical tools, deck analyzers, or gameplay visualizations, this tool is your practical companion for unraveling the insights hidden within the log file.

# How it works

For now, it parses the log file in `backend/src/data/Player.log` in a single read operation, line by line and stores the results in a MongoDb database.
For local usage, the MongoDB database is expected to be accessible at the localhost, potentially hosted within a Docker container. No explicit credentials are required at this stage, although a future enhancement involves configuring MongoDB settings within the `.env` file and incorporating necessary credentials.

The collected log messages are organized into five distinct tables, each conforming to the following structure:

```
{
    name: string;
    type: string;
    belongsToMatch: boolean;
    matchId: string | null;
    message: unknown;
}
```

This tables are:

- `matchgameroomstatemessages`: start and end matches messages
- `gretoclientevents`: Records messages sent from the server to the client during a match, with certain extraneous messages originating outside matches.
- `clienttogremessages` client to server messages during a match
- `fromclientmessages`: client to server messages outside a match
- `fromservermessages`: server to client messages in and outside a match. Those wich belongs to a match does not seem to provide relevant information and the other ones provides mostly performance information but I'm still working on it.

## Log Analysis

The log provides several types of messages:

- Strings (well, all are strings)
- Strings containing a parseable JSON in the same line 
- JSON parseable strings in a single line
- Multiline JSON parseable strings

Certain strings serve as indicators for determining the subsequent JSON-parseable string's type, whether it spans a single line or multiple lines.
The naive strategy adopted to parse the log is based on the previous classification and is as follows:

- clienttogremessages

  - Matches if a line contains `ClientToMatchServiceMessageType_ClientToGREMessage`
  - If matches, the following lines are a multiline JSON

- gretoclientevents

  - Matches if a line contains `GreToClientEvent`
  - If matches, next line is a single-line JSON

- fromclientmessages

  - Matches if a line contains `<== `
  - If matches, next line is a single-line JSON

- fromservermessages

  - Matches if a line contains `[UnityCrossThreadLogger]==> `
  - If matches, this same line contains a single-line JSON after the Regex match `/\[UnityCrossThreadLogger\]==>[^\{]*/`

- matchgameroomstatemessages:
  - Matches if a line contains `MatchGameRoomStateChangedEvent`
  - If matches, next line is a single-line JSON

Depending on the nature of the current message, the parsing of a line may trigger the parsing of the next line, or multiple lines may be accumulated for parsing a conforming multiline JSON.
This straightforward strategy appears to be quite effective.    
In `backend/dist/src/data/trash.log` file, unprocessed lines are logged. For a sample Player.log file with a bunch of activity (multiple games, deck changes, etc.) the only non parsed JSON objects came from `AuthenticateResponse`  and `ClientToMatchServiceMessageType_ClientToGREUIMessage` messages, wich both are intentionally ignored. Of course they can be parsed as well with same strategy.   
  
In conclusion, with this strategy all relevant messages are stored and classified. 
