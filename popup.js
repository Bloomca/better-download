async function setSavedValues() {
  const { shouldUseFolder, commonFolderName } = await chrome.storage.local.get([
    "shouldUseFolder",
    "commonFolderName",
  ]);

  const useCommonFolderCheckbox = document.getElementById("useCommonFolder");
  const commonFolderNameInput = document.getElementById("commonFolderName");

  if (shouldUseFolder) {
    useCommonFolderCheckbox.checked = true;
  }

  commonFolderNameInput.value = commonFolderName || "BetterDownload";

  useCommonFolderCheckbox.addEventListener("change", (event) => {
    chrome.storage.local.set({
      shouldUseFolder: event.target.checked,
    });
  });

  commonFolderNameInput.addEventListener("change", (event) => {
    chrome.storage.local.set({
      commonFolderName: event.target.value,
    });
  });
}

setSavedValues().catch(() => {
  document.getElementById("settings").style.display = "none";
  document.getElementById("reading-error").style.display = "block";
});
