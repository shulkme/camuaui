#!/usr/bin/env node
import { main, reportError } from "../dist/cli.js";
main().catch(reportError);
