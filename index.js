import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import chalk, { Chalk } from "chalk";

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

program.parse();
