import { exec } from "child_process";

// This test can take a long time to run, and that's okay!
jest.setTimeout(30000);

describe("Prettier conformance", () => {
  it("all files should have been formatted by prettier", (done) => {
    exec(
      "prettier --check ./src --plugin @trivago/prettier-plugin-sort-imports",
      (err) => {
        expect(err).toBeNull();
        done();
      }
    );
  });
});
