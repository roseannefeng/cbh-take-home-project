# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

1) Add a new table for custom ids that creates a new row for each custom id added, ex:
    id | agent_id | facility_id | custom_id
    ---------------------------------------
    1  | 1        | 1           | abc
    2  | 2        | 1           | def
    3  | 1        | 2           | 10
    agent_id and facility_id are foreign keys. We should enforce that an agent can only have one row for each facility_id, ex. the facilities aren't trying to assign more than one ID to the same agent, but one agent can have different (or the same) custom id at different facilities.
    custom_id should be a varchar because we don't know what requirements these custom ids have (int, uuids, etc).
    We also don't know if custom ids are guaranteed to be unique at the facility level. I think they should be and would prefer to add a unique key on (facility_id, custom_id) but since that can't be guaranteed, will include that as an action item within the ticket itself, i.e. following up on requirements gathering about different ids used.
    If we need any record of historical values, would also be nice to include in this ticket.
    A/C: Table exists.
    Time: relatively short, a day or two.
2) Create a new endpoint to expose the custom ids table.
    Should take in mappings of multiple Agents to their custom id, as well as the Facility assigning this custom ID. Assuming that we manage the Agents tables and Facilities don't do that directly, it makes more sense to be a separate field since Agents presumably don't work at the same Facilities for their entire time with the company and the process for working there is also variable.
    Would build this so that it's consistent with however we currently manage Agent information, ex. if there's an endpoint that inputs CSVs and creates new objects from those, do that. Ideally this includes the frontend work as well.
    A/C: Endpoint can be used on par with the other endpoints used for Agent management.
    Time: medium to large effort, multiple days or up to a week.
3) Update the function for getShiftsByFacility to return custom id.
    Function has Facility's id, so it should also query the custom ids table and add that to the output if present for that agent. Should still return the fields it already returns.
    Note that we aren't updating the Shifts table because the assumption is that one Agent will have the same custom id for that Facility forever. We could try to reprocess existing Shifts but since it seems unlikely we'll care that much about historical data, it's easier to make the report handle it.
    A/C: List of shifts can include custom id.
    Time: relatively short.
4) Update generateReport to handle custom id.
    When the report is processing the list of Shifts, if there exists an agent that also has a custom id, add custom ID to the report. Otherwise the formatting should be the same (unless we want to encourage their use of custom ids and make it visually different as a lead in to that).
    A/C: Report includes custom id if present, continues to show agent id for all agents.
    Time: relatively short.
5) Update UI for Agents so it can display custom ids.
    Where we display Agent information in a profile or page format, we should also display any custom ids we have for them so that operators can reference them. Note that this does not include updating the Agents model; we just want to query the custom ids table added in ticket 1 by agent_id and display each facility (probably by name with a link to that facility's page) in our UI. If facilities have specific managers who access these pages, we could sort that facility's custom id at the top of the page for convenience, but otherwise we can just sort the list alphabetically.
    This does include updating or making new backend calls to get the agent information. If our model supports that it's much easier.
    A/C: Pages that display agent information display a custom ids component if present.
    Time: short to medium effort, probably a day or two.
