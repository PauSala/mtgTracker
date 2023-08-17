# MTG Arena log file anlysis
## Message types and formats
-  Single strings:
    - `[UnityCrossThreadLogger]==> [message_type]`:  Messages from server in a single line (can provide a JSON object next to `message_type` )
    - `<== to server`:  next line is a single line JSON or a string
    - `[UnityCrossThreadLogger]15/08/2023 17:13:08: Match to FCEY2R7I7JB6POXDL3KAIBGDJ4: AuthenticateResponse` : includes a single line JSON message with client id indicating a match start
    - `[UnityCrossThreadLogger]Connecting to matchId ebfbfd7a-c1e8-4457-acc0-aaf33c8ad7f2`: indicates match ID, maybe relevant to track a single match 
- Multiline: some JSON logs are printed multiline, so one-line parsing is not possible



