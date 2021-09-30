# Implementation of a business process mining tool

# Prerequisites
- Node.js >= 16 with npm 7 (will work on other versions, not tested)
- Python 3.7+
- Environment supporting unix shell scripts (components can be built and run on other systems, helpers are written in shell scripts)

# Installation
Install all required packages for ui and api by running the `./install` script 

# Development
Starting both ui and api components in parallel is achieved by running the `./dev` script. You may be prompted to install `concurrently` - a node package that runs multiple tasks together.

Ui will be started on localhost:3000, and the api is hosted on localhost:5000