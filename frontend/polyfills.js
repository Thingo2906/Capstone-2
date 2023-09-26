import process from "process/browser";

if (typeof window !== "undefined") {
  window.process = process;
  console.log("Process object is available:", window.process);
}
