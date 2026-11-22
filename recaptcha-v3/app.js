const run = document.querySelector("#run");
const statusLine = document.querySelector("#status");
const result = document.querySelector("#result");
let config;

function setStatus(message, state = "") {
  statusLine.textContent = message;
  statusLine.dataset.state = state;
}

function withTimeout(operation, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), 12000);
  });
  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
}

async function initialize() {
  document.querySelector("#site-host").textContent = location.hostname;
  const response = await fetch(document.documentElement.dataset.config || "/api/config");
  if (!response.ok) throw new Error("Could not load the demo settings. Reload the page to try again.");
  config = await response.json();
  if (!config.configured) {
    const setup = document.querySelector("#setup");
    if (setup) {
      setup.hidden = false;
      setStatus("Waiting for the localhost key pair.");
    } else {
      setStatus("The online verifier is unavailable. Please try again later.", "error");
    }
    return;
  }

  setStatus("Connecting to Google…");
  const ready = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(config.siteKey);
    script.async = true;
    script.onload = () => {
      if (window.grecaptcha?.ready) window.grecaptcha.ready(resolve);
      else reject(new Error("Google’s library did not load. Check your connection and reload."));
    };
    script.onerror = () => reject(new Error("Google’s library could not load. Allow reCAPTCHA in your browser and reload."));
    document.head.append(script);
  });
  await withTimeout(ready, "Google’s library timed out. Check your connection and reload.");
  setStatus("Ready. The passing score is " + config.minimumScore + " or higher.");
  run.disabled = false;
}

run.addEventListener("click", async () => {
  run.disabled = true;
  result.hidden = true;
  setStatus("Running reCAPTCHA…");
  try {
    const token = await withTimeout(
      window.grecaptcha.execute(config.siteKey, { action: config.action }),
      "Google timed out.",
    );
    setStatus("Verifying with Google…");
    const body = config.verifyUrl ? new URLSearchParams({ token }) : JSON.stringify({ token });
    const response = await fetch(config.verifyUrl || "/api/verify", {
      method: "POST",
      headers: config.verifyUrl ? {} : { "Content-Type": "application/json" },
      credentials: "omit",
      body,
      signal: AbortSignal.timeout(20000),
    });
    const report = await response.json();
    if (Number.isFinite(report.score)) {
      document.querySelector("#score").textContent = String(report.score);
      document.querySelector("#action").textContent = report.action;
      document.querySelector("#hostname").textContent = report.hostname;
      result.hidden = false;
    }
    setStatus(report.message, response.ok && report.accepted ? "passed" : "error");
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Google could not run the check.";
    setStatus(detail + " Check your connection and try again.", "error");
  } finally {
    run.disabled = false;
  }
});

initialize().catch((error) => setStatus(error.message || "Check the local server and reload.", "error"));
