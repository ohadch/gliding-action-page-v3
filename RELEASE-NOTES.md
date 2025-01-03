# Gliding Action Page Release Notes

## v3.7.0

## New Features

- When closing an action, a backup of the database and the flights data is created and sent to the assigned email.
- Adds the ability to disable closing action by passing the VITE_DISABLE_CLOSING_ACTION=true environment variable to the frontend service.

## Infra

- The servers docker files were enhanced to allow local debugging.
- Adds the `backup.py` script to the server in order to backup the database and send it by email.

## v3.6.0

### Frontend

- Adds the `flights-board` page that is intended to be displayed on a screen in the club.

### Infrastructure

- Revamps the docker-compose files to be more organized and easier to use.
- Optimizes the server's Dockerfile to be more small and efficient.
- Refactors the frontend's Dockerfile to a multi-stage build.

## v3.5.2

### Bug Fixes

- Fixes a bug that caused the autocomplete items to hide the first pilot selection title. [Issue #155](https://github.com/ohadch/gliding-action-page-v3/issues/155)
- Adds a title for the autocomplete inputs for better clarity.
- Tidies up the payment settlement dialog.
- Tidies up the edit active tow airplane dialog.
- Flips the flight state controller buttons - next state is on the right, and previous state is on the left.
- Emphasizes the payment settlement alert.
- Tidies up the flight dispatch dialog.
- Emphasizes the call signs of the gliders in the flights table.
- Changes the naming of the `Solo Flight?` button in the flight creation dialog for members flight. [Issue #190](https://github.com/ohadch/gliding-action-page-v3/issues/190)
- Updates the flight states colors: blue for draft, yellow for tow, red for inflight, and green for landed.
- Turns the time pickers from am/pm to 24h format.
- Configures minutes steps to 1 min instead of 5.
- Sorts the order of the timepicker inputs from minutes/hours to hours/minutes.

### Enhancements

- Adds more pilots to the seed data.

## v3.5.1

### Enhancements

- Adds a column that shows the traceback in case of an error to the data export requests table in the settings page.

### Bug Fixes

- The server reads the `ETL_SERVER_URL` correctly.

### Infrastructure

- Adds the `default` network to the project to be used by the external ETL compose projects.

## v3.5.1

### Infrastructure

- Adds `max-size` of `10m` to the logging options of the docker compose services.

## v3.5.0

This release introduces the ability to add comments to actions and flights.

### Code Changes

#### Server

- Introduces the `Comment` table in the database in order to store the comments.
- Introduces the `CommentSchema`, `CommentSchemaCreate`, and `CommentSchemaUpdate` classes in order to validate the comments.

#### Frontend

- Adds comments store state in the frontend in order to store the comments.
- Adds the CommentsTable component in order to show the comments in the UI.
- Renders the comments table in the edit flight dialog.
- Renders the flight ID in the edit flight dialog.

## v3.4.0

### New Features

This release introduces the ability to send a flights report by email to the club's members.

### Code Changes

#### Server

- Introduces the `flights_email_report_requested` event and the `FlightsEmailReportRequestedEventHandler`.
- Introduces the `FlightsEmailReport` notification and the `FlightsEmailReportNotificationHandler`.
- Implements the required methods to support the flights email report in the `I18n` class.
- Adds a metadata section to the flights table that is sent by email.
- Adds the `traceback` column to the `NotificationUpdateSchema` in order to allow clearing the traceback when resending the notification.

#### Frontend

- Adds the `FlightsTableSendEmailDialog` component in order to send the flights report by email.
- Adds an `error` column to the `EventsTable` and `NotificationsTable` in order to show the traceback in case of an error.

## v3.3.0

### New Features

- Adds the `State` column to the `EventsTable` in the UI in order to show the state of the event.
- Adds a button in the settings page to export the action data to the ETL server.
- Adds an events table in the settings page in order to show the data export requests.

### Code Changes

- Adds the `data_exported_at` column to the `actions` table in the database.
- Adds the `ETL_SERVER_URL` environment variable to the backend in order to configure the ETL server URL.
- Adds the `ActionDataExportRequested` event to the backend in order to request the ETL server to export the action data.

## v3.2.1

### Migrations

- Adds the `deleted_at` column to the `events` table in the database.

## v3.2.0

### Enhancements

- In case of an error while handling an event or a notification, the error traceback is now saved in the database.

### Migrations

- Adds the `traceback` column to the `events` and `notifications` tables in the database.

## v3.1.2

### Enhancements

- Introduces the ability to delete events from the UI.

## v3.1.1

### Deprecations

- Deletes the flight states filters as it was misleading and not useful.

## v3.1.0

### New Features

- Adds a button in the notifications page in the UI to resend the notification in case it failed to send.

### Enhancements

- Adds the properties to the `NotificationUpdateSchema` in the backend in order to allow updating the state of the notification.

## v3.0.2

### Enhancements

- Adds `pytest` to the project in order to run the tests.

### Bug Fixes

- Fixes a bug that caused the total duration that was sent for the glider in the emails to be incorrect.
- Fixes a bug that cause emails to not be sent for gliders that have active flights.

## v3.0.1

### Bug Fixes

- Fixes an issue that caused the selected action to be reset when the user navigates between the pages.

## v3.0.0

### New Features

- Separate tables by state in the flights page.

### Bug Fixes

- The actions in the action selection dialog in the UI are now sorted by their date.
- Only flights of club guests require payment settlement.

## v3.0.0rc2

### Enhancements

- Adds Nginx to the project in order to serve the server in https.
- Adds .env file to the frontend in order to configure the server url.
- Removes the `AIRPLANE_1000` Tow Type and adds the `AIRPLANE_4000` Tow Type.

## v3.0.0rc1

### Bug Fixes

- The UI does not show alert for non-guest flights that have unsettled payments.

## v3.0.0rc0

First conceptual version of the Gliding Action Page.
This version is a release candidate and is not yet ready for production use.

This version includes:

### Dashboard Page

The dashboard page is the main page of the application.

The dashboard page has two main sections:

#### Action Management

At the top of the page, there is a section for configuring the actions.

The user can:

- Assign a field responsible for the action
- Assign a responsible CFI for the action
- Assign tow pilots and tow planes for the action
- Generate a report for the action
- Close the action

##### Action Report

The action report is a modal that allows the user to generate a report for the action.

The user can:

- Generate a report for a tow plane
- Generate a report for a tow pilot
- Generate a report for a glider
- Generate a report for a glider pilot

##### Action Selection

At any time, the user can select a different action to manage.

#### Flights Management

In addition for the configuration section, the dashboard page has a section for managing the flights.

The user can:

- View the current flights
- Create new flights
- Move each flight to a different status
- Edit each flight's details

##### Flight Creation Wizard

The flight creation wizard is a modal that allows the user to create a new flight.

###### Flight Creation Wizard Default Values Selection

Upon creating a new flight, default values are selected for the flight in order to save the user time and avoid mistakes.

### Events and Notification

The app tracks the events in the actions, and allows to send various notifications by email.

In this version, the following notifications are supported:

- Daily summary for observers
- Flight summary for pilots
- Summary for tow pilot

#### Events Page

The events page is a page includes a table of all the events in the current action.

It allows the user to view a chronological list of all the events in the action.

#### Notifications Page

The notifications page is a page includes a table of all the notifications that were sent in the current action.

It allows the user to view a chronological list of all the notifications in the action.

### Settings Page

The settings page is a page for configuring the application. Currently, it only allows to re-open a closed action.
