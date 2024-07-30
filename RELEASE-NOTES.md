# Gliding Action Page Release Notes

## v3.3.0

### Code Changes

- Adds the `data_exported_at` column to the `actions` table in the database.
- Adds the `ETL_SERVER_URL` environment variable to the backend in order to configure the ETL server URL.
- Adds the `EtlClient` class to the backend in order to interact with the ETL server.

### Dependencies

- Adds the `requests==2.31.3` package to the backend.

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
