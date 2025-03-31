import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import chalk from "chalk";
import Table from "cli-table3";
import prompts from "prompts";

const program = new Command();
const client = new PrismaClient();

program
  .name("CLI-Contacts")
  .version("0.0.1")
  .description("A simple CLI for managing contacts");

// Add Contact Command
program
  .command("add-contact")
  .description("Add a new contact")
  .action(async () => {
    try {
      const response = await prompts([
        {
          type: "text",
          name: "name",
          message: "Enter the name of the contact",
        },
        {
          type: "text",
          name: "email",
          message: "Email of the contact",
        },
        {
          type: "text",
          name: "phone",
          message: "Phone number of the contact",
        },
      ]);

      await client.contact.create({
        data: {
          id: nanoid(5),
          name: response.name,
          email: response.email,
          phone: response.phone,
        },
      });

      console.log(chalk.green("Contact created successfully!"));
    } catch (e) {
      console.error(chalk.bgRed("Error creating contact:"), e);
    }
  });

// List Contacts Command
program
  .command("list-contacts")
  .description("List all contacts")
  .option("-e, --email <value>", "Filter contacts by email")
  .action(async (options) => {
    try {
      const contacts = await client.contact.findMany({
        where: { email: options.email },
      });

      if (contacts.length === 0) {
        console.log(chalk.yellow("No contacts found."));
        return;
      }

      const table = new Table({
        head: ["ID", "Name", "Email", "Phone"],
        colWidths: [10, 20, 30, 20],
      });

      contacts.forEach((contact) => {
        table.push([contact.id, contact.name, contact.email, contact.phone]);
      });

      console.log(table.toString());
    } catch (e) {
      console.error(chalk.bgRed("Error fetching contacts:"), e);
    }
  });

// Delete Contact Command
program
  .command("delete-contact")
  .description("Delete a contact")
  .requiredOption("-i, --id <value>", "ID of the contact")
  .action(async (options) => {
    try {
      await client.contact.delete({ where: { id: options.id } });
      console.log(chalk.green("Contact deleted successfully!"));
    } catch (e) {
      console.error(chalk.bgRed("Error deleting contact:"), e);
    }
  });

// Update Contact Command
program
  .command("update-contact")
  .description("Update a contact")
  .requiredOption("-i, --id <value>", "ID of the contact")
  .option("-n, --name <value>", "New name of the contact")
  .option("-e, --email <value>", "New email of the contact")
  .option("-p, --phone <value>", "New phone number of the contact")
  .action(async (options) => {
    try {
      const { id, ...data } = options;
      await client.contact.update({
        where: { id },
        data: Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v !== undefined)
        ),
      });
      console.log(chalk.green("Contact updated successfully!"));
    } catch (e) {
      console.error(chalk.bgRed("Error updating contact:"), e);
    }
  });

// Help Command
program
  .command("help")
  .description("Show help information")
  .action(() => {
    console.log(chalk.blue("Available commands:"));
    console.log(chalk.green("add-contact      - Add a new contact"));
    console.log(chalk.green("list-contacts    - List all contacts"));
    console.log(chalk.green("delete-contact   - Delete a contact by ID"));
    console.log(chalk.green("update-contact   - Update a contact by ID"));
  });

// Parse CLI arguments
program.parse(process.argv);
