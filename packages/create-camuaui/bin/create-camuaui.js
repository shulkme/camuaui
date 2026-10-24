#!/usr/bin/env node
import { createMain, reportCreateError } from "camuaui/create";
createMain().catch(reportCreateError);
