import { createInterface } from "readline";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}

async function main() {
	const platform = await ask("Which platform? (mac/win/linux): ");
	let flag = "";
	if (platform === "mac") flag = "--mac";
	else if (platform === "win") flag = "--win";
	else if (platform === "linux") flag = "--linux";
	else {
		console.log("Invalid platform");
		rl.close();
		return;
	}

	const appId = await ask("App ID (default: com.electron.react.tailwind): ");
	const productName = await ask("Product name (default: YourAppName): ");

	const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
	if (appId) pkg.build.appId = appId;
	if (productName) pkg.build.productName = productName;
	writeFileSync("temp-config.json", JSON.stringify(pkg.build, null, 2));

	console.log("Building...");
	execSync("bunx tsc", { stdio: "inherit" });
	execSync("bunx vite build", { stdio: "inherit" });
	execSync(`bunx electron-builder --config temp-config.json ${flag}`, {
		stdio: "inherit",
	});

	execSync("rm temp-config.json");

	console.log("Build complete!");
	rl.close();
}

main();
