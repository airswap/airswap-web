import { exec } from "child_process";

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
