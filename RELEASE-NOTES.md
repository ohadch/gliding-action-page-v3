# Gliding Action Page Release Notes

## v3.0.0rc2

### Enhancements

- Adds Nginx to the project in order to serve the server in https.
- Adds .env file to the frontend in order to configure the server url.

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
