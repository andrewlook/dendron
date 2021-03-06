import { Uri, window, workspace } from "vscode";
import { Logger } from "../logger";
import { BasicCommand } from "./base";
const L = Logger;

type OpenLogsCommandOpts = {
};

export class OpenLogsCommand extends BasicCommand<OpenLogsCommandOpts, void> {
  async execute(opts: OpenLogsCommandOpts) {
    const ctx = "execute";
    L.info({ ctx, opts });
    const logPath = Logger.logPath;
    if (!logPath) {
        throw Error("logPath not defined");
    }
    const doc= await workspace.openTextDocument(Uri.file(logPath));
    window.showTextDocument(doc);
    return;
  }
}
