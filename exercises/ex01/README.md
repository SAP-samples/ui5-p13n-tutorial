# Exercise 1 - Setup

To get started, you need to ensure that you have a recent git and Node.js version 12 or higher installed on your machine. To follow the tutorial it is also recommended to have knowledge in UI5 application or control development. There are great resources available to learn and explore, such as the [UI5 Walkthrough](https://sapui5.hana.ondemand.com/#/entity/sap.m.tutorial.walkthrough).

## Step 1: Install Node.js

If it is not already available, the first step is to download and install it from https://nodejs.org/.

You can confirm the installation by opening your terminal or command prompt and typing:

```bash
node -v
```

This command should display the installed version of Node.js.

## Step 2: Download and Extract Project Files

Next, we will download the project files contained in a .zip file.

- Download the project files from [p13n.tutorial.zip](https://vigilant-adventure-yrgz2ee.pages.github.io/p13n.tutorial.zip).
- Once the download is complete, navigate to the download location and extract the .zip file.

## Step 3: Open the Project Folder

Now, we will open the project folder in your code editor.

- Navigate to the extracted project folder.
- Open the folder in your preferred code editor.

The structure should look like this:

![Application structure](screenshots/ex01_folder.png)

## Step 4: Install Project Dependencies

Once the project is open in your code editor, we will install the project dependencies using npm, the Node Package Manager, which was installed alongside Node.js.

- Open a terminal or command prompt in your project's root directory.
- Run the following command:

```bash
npm install
```

This command will read the `package.json` file in your project and install the necessary dependencies.

## Step 5: Serve the Project

Finally, we will serve the project using ui5.

- In the terminal or command prompt at your project's root directory, run the following command:

```bash
ui5 serve
```

Now open a new browser tab on [http://localhost:8080/index.html](http://localhost:8080/index.html). Make yourself familiar with the application and feel free to explore the corresponding resources in the `sample.p13n/webapp` folder of the repository. This is our starting point.

![Initial application](screenshots/ex01_1.png)

The application is displaying the data of the world's highest mountains in a table. You can see their names, height, year of first ascent and more. Because there is a lot of info at once and maybe more than users need, it might be desirable for them to personalize their experience.

The goal is to enrich the application with features like sorting, grouping and filtering. It should be easy to answer questions such as: In which year happened the first ascent to Mt. Everest? Or: Which are the ten highest mountains in the world?

We want you to achieve this through the following objectives:
- Create a custom table control with dialogs for column selection, sorting etc.
- Add a `sap.f.GridList` as filter option for the table
- Include and connect a `sap.ui.fl.variants.VariantManagement` for persistency


>**Remark:** In case you got stuck an any point of the tutorial, you can go to the [exercises folder](https://github.tools.sap/I516182/openui5-P13nify-Everything/tree/main/exercises) and copy the content of the previous exercises' solution folder into the webapp folder and continue from there.

## Summary

Great! Now that you have prepared the development setup let us start to enhance the application.
Continue to - [Exercise 2](../ex02/)