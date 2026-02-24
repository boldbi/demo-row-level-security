# Filters Demo

This application, featuring Angular for the frontend and .NET for the backend, demonstrates the implementation of various row-level security features within Bold BI dashboards when integrated into embedded solutions.

## Requirements

* [Node.js](https://nodejs.org/en/)
* [.NET Core 6.0](https://dotnet.microsoft.com/download/dotnet-core)
* [Visual Studio Code](https://code.visualstudio.com/download>)
* [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/)

> **NOTE:** Node.js version supported from 20.20.

## Running the Backend .NET Application

To run the backend .NET application, follow these steps:

### Run in Visual Studio

1. Navigate to the `.net/web-api` folder.
2. Open the `boldbi.web.api.sln` solution file.
3. Simply run the application. 

### Run in Visual Studio Code

1. Open a terminal or command prompt.
2. Navigate to the `.net/web-api` folder.
3. Execute the command `dotnet restore` to restore the required dependencies.
4. Build your .NET project by executing the `dotnet build` command in the terminal.
5. To run the application, use the command `dotnet run` in the terminal. 

## Running the Frontend Angular Application

To run the frontend Angular application, ensure that you have the Angular CLI installed on your machine. If not, install it by running `npm install -g @angular/cli`.
Follow these steps to run the project:

1. Open a terminal or command prompt.
2. Navigate to the `angular/web-client` folder.
3. Run `npm install` to install the required npm packages.
4. Run `ng serve` to start the development server and run the project.

### Running a Specific Component

If you want to run a component individually, you can directly bootstrap that component in the `main.ts` file.

By default the `AppComponent` will be bootstrapped, as it is the root-component of the application.

![image](https://github.com/user-attachments/assets/01a653f6-497b-401b-bee5-cfed2a1fc61f)

For example, if you want to run the data source filter sample, you can change the value to `DatasourceComponent`

![image](https://github.com/user-attachments/assets/8fcdeaae-408f-47bf-980a-9ebfcff4f4db)

You can also run the isolation filter sample, by changing the value to `IsolationComponent`

![image](https://github.com/user-attachments/assets/e4ea4958-fb5d-413e-9243-106486a38f10)

This way, only the specified component will be executed.
