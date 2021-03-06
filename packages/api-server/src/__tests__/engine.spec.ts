import { DendronAPI, NoteUtilsV2 } from "@dendronhq/common-all";
import {
  EngineTestUtils,
  NodeTestUtils,
  tmpDir,
} from "@dendronhq/common-server";
import fs from "fs-extra";
import path from "path";

describe("main", () => {
  let wsRoot: string;
  let vault: string;

  beforeEach(async () => {
    wsRoot = tmpDir().name;
    vault = path.join(wsRoot, "vault");
    fs.ensureDirSync(vault);
    await EngineTestUtils.setupVault({
      vaultDir: vault,
      initDirCb: (dirPath: string) => {
        NodeTestUtils.createNotes(dirPath, [
          {
            id: "id.foo",
            fname: "foo",
          },
        ]);
      },
    });
  });

  test("query", async () => {
    const payload = {
      uri: wsRoot,
      config: {
        vaults: [vault],
      },
    };
    const api = new DendronAPI({
      endpoint: "http://localhost:3005",
      apiPath: "api",
    });
    await api.workspaceInit(payload);
    const resp = await api.engineQuery({
      ws: wsRoot,
      queryString: "",
      mode: "note" as const,
    });
    expect(resp).toMatchSnapshot();
  });

  test("write", async () => {
    const payload = {
      uri: wsRoot,
      config: {
        vaults: [vault],
      },
    };
    const api = new DendronAPI({
      endpoint: "http://localhost:3005",
      apiPath: "api",
    });
    await api.workspaceInit(payload);
    const resp = await api.engineWrite({
      ws: wsRoot,
      node: NoteUtilsV2.create({ fname: "bond" }),
    });
    expect(resp).toMatchSnapshot();
    const out = fs.readdirSync(vault);
    expect(out).toEqual(["bond.md", "foo.md", "root.md"]);
  });
});
