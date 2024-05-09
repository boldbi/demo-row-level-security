# Filters Demo

This application demonstrates frontend Angular and backend .NET technologies, illustrating different types of filtering in Bold BI with real-life examples.

## Running the Backend .NET Application

To run the backend .NET application, follow these steps:
1. Navigate to the `./net/web-api` folder.
2. Open the `boldbi.web.api.sln` solution file.
3. Simply run the application.

## Running the Frontend Angular Application

To run the frontend Angular application, ensure that you have the Angular CLI installed on your machine. If not, install it by running `npm install -g @angular/cli`.
Follow these steps to run the project:
1. Open a terminal or command prompt.
2. Navigate to the project directory.
3. Run `npm install` to install the required npm packages.
4. Run `ng serve` to start the development server and run the project.
   
### Running a Specific Component

If you want to run a component individually, you can directly bootstrap that component in the `main.ts` file.

By default the `AppComponent` will be bootstrapped, as it is the root-component of the application.
![image](https://github.com/bold-bi/embedded-bi-samples/assets/149655326/a3ba174a-2891-4248-a549-b6513538bca9)

For example, if you want to run the data source filter scenario, you can change the value to `DatasourceComponent`
![image](https://github.com/bold-bi/embedded-bi-samples/assets/149655326/a485df37-a22f-4a8a-97aa-5efc8531c2fa)

You can also run the isolation filter scenario, by changing the value to `IsolationComponent`
![image](https://github.com/bold-bi/embedded-bi-samples/assets/149655326/3cd02a75-5456-4c95-b6d7-80ff3aceea49)

This way, only the specified component will be executed.


