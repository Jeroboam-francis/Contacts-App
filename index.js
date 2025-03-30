import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import chalk, { Chalk } from "chalk";
import Table from "cli-table3";

const program = new Command();
const client = new PrismaClient();

program.name("CLI-Contacts");
program.version("0.0.1");
program.description("A simple CLI for managing contacts");

const addContactsCommand = program.command("add-contact");
addContactsCommand.description("Add a new contact");
addContactsCommand.requiredOption("-n, --name <value>", "Name of the contact");
addContactsCommand.requiredOption(
  "-e, --email <value>",
  "Email of the contact"
);
addContactsCommand.requiredOption(
  "-p, --phone <value>",
  "Phone number of the contact"
);

addContactsCommand.action(async function (options) {
  const name = options.name;
  const email = options.email;
  const phone = options.phone;

  try {
    const newContact = await client.contact.create({
      data: {
        id: nanoid(5),
        name: name,
        email: email,
        phone: phone,
      },
    });
    console.log(chalk.green("Contact created successfully!"));
  } catch (e) {
    console.log(chalk.bgRed("Error creating contact:"));
    console.log(chalk.red("please check your input and try again."));
  }
});

program
  .command("list-contacts")
  .description("List all contacts")
  .option("-e --email <value>", "Email of the contact")
  .action(async function (options) {
    const email = options.email;
    try {
      const contacts = await client.contact.findMany({
        where: {
          email: email,
        },
      });
      if (contacts.length === 0) {
        console.log(chalk.yellow("No contacts found."));
      } else {
        const table = new Table({
          head: ["ID", "Name", "Email", "Phone"],
          colWidths: [10, 20, 30, 20],
        });
        contacts.forEach((contact) => {
          table.push([contact.id, contact.name, contact.email, contact.phone]);
        });
        console.log(table.toString());
      }
    } catch (e) {
      console.log(chalk.bgRed("Error fetching contacts:"));
      console.log(chalk.red("please check your input and try again."));
    }
  });

program
  .command("delete-contact")
  .description("Delete a contact")
  .requiredOption("-i, --id <value>", "ID of the contact")
  .action(async function (options) {
    const id = options.id;
    try {
      const contact = await client.contact.delete({
        where: {
          id: id,
        },
      });
      console.log(chalk.green("Contact deleted successfully!"));
    } catch (e) {
      console.log(chalk.bgRed("Error deleting contact:"));
      console.log(chalk.red("please check your input and try again."));
    }
  });

program
  .command("update-contact")
  .description("Update a contact")
  .requiredOption("-i, --id <value>", "ID of the contact")
  .requiredOption("-n, --name <value>", "Name of the contact")
  .requiredOption("-e, --email <value>", "Email of the contact")
  .requiredOption("-p, --phone <value>", "Phone number of the contact")
  .action(async function (options) {
    const id = options.id;
    const name = options.name;
    const email = options.email;
    const phone = options.phone;
    try {
      const contact = await client.contact.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
          phone: phone,
        },
      });
      console.log(chalk.green("Contact updated successfully!"));
    } catch (e) {
      console.log(chalk.bgRed("Error updating contact:"));
      console.log(chalk.red("please check your input and try again."));
    }
  });

program
  .command("help")
  .description("Show help information")
  .action(function () {
    console.log(chalk.blue("Available commands:"));
    console.log(chalk.green("add-contact"));
    console.log(chalk.green("list-contacts"));
    console.log(chalk.green("delete-contact"));
    console.log(chalk.green("update-contact"));
  });
program.parse();
