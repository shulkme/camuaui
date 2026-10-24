#!/usr/bin/env node
import { createMain, reportCreateError } from "../dist/create.js";
createMain().catch(reportCreateError);
